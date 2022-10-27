import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFilePicker } from "use-file-picker";

import { parseForceFileData, parseMarkerFileData } from "./modules/Parser";

import FileUploadView from "./views/FileUploadView";
import RenderView from "./views/RenderView";
import PopupView from "./views/PopupView";
import SelectionInfoView from "./views/SelectionInfoView";
import TimelineTrackView from "./views/TimelineTrackView";
import TimelineTextView from "./views/TimelineTextView";

import { ForceFileData, MarkerFileData } from "./dataTypes";
import { MenuIcon } from "./icons";
import useStateRef from "./useStateRef";

import * as sdpLogo from "../assets/images/sdp-logo-3.png";

import "./App.scss";

const MILLIS_PER_SEC = 1000;

export default function App() {

    // ---------------------------------------------- Uploading & Parsing ----------------------------------------------

    /* File upload hooks */
    const [openMarkerFileSelector, {plainFiles: [markerFile], loading: markersLoading}] = useFilePicker({accept: ['.txt','.tsv','.csv']});
    const [openForceFileSelector, {plainFiles: [forceFile], loading: forcesLoading}] = useFilePicker({accept: ['.txt','.tsv','.csv','.mot']});

    /* Loaded data */
    const [markerFileData, setMarkerFileData] = useState<MarkerFileData>({markers: [], frames: []});
    const [forceFileData, setForceFileData] = useState<ForceFileData>({frames: []});

    /* Flags for clearing file name if parsing error is encountered */
    const [markerParsingError, setMarkerParsingError] = useState(false);
    const [forceParsingError, setForceParsingError] = useState(false);

    /* Most recent error, for displaying in error popup */
    const [error, setError] = useState<Error|null>(null);

    /* Parse provided markerFile into markerFileData */
    useEffect(() => {
        /* Only async parse call using the most recent file state should set markerFileData */
        let fileHasNotChanged = true;
        /* Call parseMarkerFileData inside anonymous wrapper function to handle returned Promise or Error */
        if (markerFile) (async () => {
            try {
                const data = await parseMarkerFileData(markerFile);
                if (fileHasNotChanged) {
                    setError(null);
                    setMarkerParsingError(false);
                    setMarkerFileData(data);
                }
            }
            catch (err) {
                if (fileHasNotChanged && err instanceof Error) {
                    setError(err);
                    setMarkerParsingError(true);
                }
            }
        })();
        /* Clean-up function called if there is a new file state while parsing is still in progress.
         * Effectively abandons stale results. */
        return () => {fileHasNotChanged = false};
    }, [markerFile]);

    /* Parse provided forceFile into forceFileData */
    useEffect(() => {
        /* Only async parse call using the most recent file state should set forceFileData */
        let fileHasNotChanged = true;
        /* Call parseForceFileData inside anonymous wrapper function to handle returned Promise or Error */
        if (forceFile) (async () => {
            try {
                const data = await parseForceFileData(forceFile);
                if (fileHasNotChanged) {
                    setError(null);
                    setForceParsingError(false);
                    setForceFileData(data);
                }
            }
            catch (err) {
                if (fileHasNotChanged && err instanceof Error) {
                    setError(err);
                    setForceParsingError(true);
                }
            }
        })();
        /* Clean-up function called if there is a new file state while parsing is still in progress.
         * Effectively abandons stale results. */
        return () => {fileHasNotChanged = false};
    }, [forceFile]);

    // --------------------------------------- Animation & Animation Control Data --------------------------------------

    /* Start, current, and end frames from data */
    const frameStart = 0;
    const [frame, setFrame] = useState(0);
    const [frameEnd, setEnd] = useState(0);

    /* User-selected start and end frames (for cropping) */
    const [frameCropStart, setCropStart] = useState(0);
    const [frameCropEnd, setCropEnd] = useState(0);

    /* Current frame reference for use in dependency arrays where we don't want to trigger on every frame change */
    const frameRef = useStateRef(frame);

    /* Flags for playback */
    const [playing, setPlaying] = useState(false);
    const [loopPlayback, setLoopPlayback] = useState(true);

    /* Handle on most recent animation loop, so it may be cancelled */
    const animationRef = useRef<number>();

    /* The time for one marker/force frame in ms */
    const timeStepMillis = useMemo(() => {
        if (markerFileData.frames.length<2) return null;
        return markerFileData.frames[1].time * MILLIS_PER_SEC; //convert from secs to millis
    }, [markerFileData]);

    /* Time of previous animation loop iteration (most recent render).
     * For finding elapsed time between loops to determine which marker/force frame to render next. */
    const lastRepaintTimeRef = useRef<DOMHighResTimeStamp|null>(null);

    /* The cumulative elapsed time that has not yet been animated.
     * Decremented by timeStepMillis for every marker frame increment. */
    const interFrameTimeRef = useRef(0);

    /* Tail recursive loop, called once per next available browser repaint (at rate of user's display's refresh rate),
     * that handles updating the marker/force frame number (to drive the animation) by the correct amount according to
     * the time elapsed between repaints. This allows the animation to play at 1x speed. */
    const animationLoop = useCallback((currentTime: DOMHighResTimeStamp) => {
        /* If file has not been parsed for the time step, there isn't enough info to know how to animate */
        if (!timeStepMillis) return;
        /* When paused, pretend no time has elapsed */
        const elapsedTime = (lastRepaintTimeRef.current!==null) ? currentTime-lastRepaintTimeRef.current : 0;
        /* When playing, before next repaint, increment frame by the correct amount for the elapsed time since last paint */
        for (interFrameTimeRef.current += elapsedTime; interFrameTimeRef.current > timeStepMillis; interFrameTimeRef.current -= timeStepMillis) {
            setFrame(current => {
                if (current+1<=frameCropEnd) return current+1; //next frame is in range, proceed
                else if (loopPlayback) return frameCropStart; //not in range: wrap around to start if looping
                else {setPlaying(false); return current;} //not in range: stop playing on final frame if not looping
            });
        }
        /* While playing, loop forever with tail recursion */
        if (playing) {
            lastRepaintTimeRef.current = currentTime; //store time for getting elapsed time in next loop
            animationRef.current = requestAnimationFrame(animationLoop); //get handle of new loop
        }
    }, [playing, loopPlayback, timeStepMillis, frameCropStart, frameCropEnd]);

    /* Activate animation loop on play, deactivate on pause */
    useEffect(() => {
        if (playing) animationRef.current = requestAnimationFrame(animationLoop); //enter new animation loop
        else lastRepaintTimeRef.current = null; //clear time on pause so animation won't skip ahead on next play
        return () => cancelAnimationFrame(animationRef.current!); //escape old animation loop callback when play/pause state changes
    }, [animationLoop, playing]);

    /* Set end frame from newly-parsed data for animation controls */
    useEffect(() => {
        const lastFrameParsed = markerFileData.frames.length-1;
        if (lastFrameParsed > 0) {
            setEnd(lastFrameParsed);
            setCropEnd(lastFrameParsed);
        }
    }, [markerFileData]);

    // ---------------------------------------------------- Metadata ---------------------------------------------------

    /* Array of the indices of the currently selected markers */
    const [selectedMarkers, setSelectedMarkers] = useState<number[]>([]);

    // ---------------------------------------------------- Popups -----------------------------------------------------

    const [menu, setMenu] = useState(false);
    const [controlsHelpImgNum, setControlsHelpImgNum] = useState(0);
    const [sdpInfo, setSdpInfo] = useState(false);

    // ---------------------------------------------------- App JSX ----------------------------------------------------

    /* Elements/components in the grid are organized top->bottom, left->right */
    return <div id={"app-grid"} style={(markersLoading||forcesLoading) ? {cursor: "progress"} : {cursor: "default"}}>
        {/* ---------------------------------------------- Grid Row 1 ---------------------------------------------- */}
        <FileUploadView openMarkerFileSelector={openMarkerFileSelector} openForceFileSelector={openForceFileSelector}
                        markerFile={markerFile} markerParsingError={markerParsingError}
                        forceFile={forceFile} forceParsingError={forceParsingError}
        />
        <div id={"logo-menu-button-div"}>
            <div id={"logo"}>Movilo</div>
            <button id={"main-menu-button"} onClick={()=>setMenu(!menu)}><MenuIcon /></button>
        </div>
        <div id={"selection-info-title"}>
            Selection Info
        </div>
        {/* --------------------------------------------- Grid Row 2-3 --------------------------------------------- */}
        <RenderView frame={frame} markerData={markerFileData} forceData={forceFileData}
                    selectedMarkers={selectedMarkers} setSelectedMarkers={setSelectedMarkers}
        />
        <PopupView error={error} sdpInfo={sdpInfo} menu={menu}
                   controlsHelpImgNum={controlsHelpImgNum} setControlsHelpImgNum={setControlsHelpImgNum}
        />
        <SelectionInfoView markerData={markerFileData} selectedMarkers={selectedMarkers} frame={frame}
        />
        <img id={"sdp-logo"} src={sdpLogo} alt={"senior design project logo"} onClick={()=>setSdpInfo(!sdpInfo)}
        />
        {/* --------------------------------------------- Grid Row 4-5 --------------------------------------------- */}
        <TimelineTrackView frameStart={frameStart} frame={frame} frameRef={frameRef} frameEnd={frameEnd}
                           frameCropStart={frameCropStart}  frameCropEnd={frameCropEnd}
                           playing={playing} loopPlayback={loopPlayback}
                           setPlaying={setPlaying} setLoopPlayback={setLoopPlayback}
                           setFrame={setFrame} setCropStart={setCropStart} setCropEnd={setCropEnd}
        />
        <TimelineTextView frameStart={frameStart} frame={frame} frameRef={frameRef} frameEnd={frameEnd}
                          frameCropStart={frameCropStart} frameCropEnd={frameCropEnd} markerFileData={markerFileData}
                          setFrame={setFrame} setCropStart={setCropStart}  setCropEnd={setCropEnd}
        />
    </div>;
}
