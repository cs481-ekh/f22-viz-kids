import * as React from "react";
import { ChangeEvent, MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFilePicker } from "use-file-picker";

import { ForceFileData, MarkerFileData } from "./DataTypes";
import { parseForceFileData, parseMarkerFileData } from "./Parser";
import RenderView from "./RenderView";
import ErrorPopup from "./ErrorPopup";
import { PlayIcon, PauseIcon } from "./icons";
import useStateRef from "./useStateRef";

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
		const lastFrameParsed = markerFileData.frames.length-2;
		if (lastFrameParsed > 0) {
			setEnd(lastFrameParsed);
			setCropEnd(lastFrameParsed);
		}
	}, [markerFileData]);

	// ---------------------------------------------------- Metadata ---------------------------------------------------

	/* Array of the indices of the currently selected markers */
	const [selectedMarkers, setSelectedMarkers] = useState<number[]>([]);

	// ---------------------------------------------------- Controls ---------------------------------------------------

	/* Play button (on click) */
	const togglePlaying = useCallback(() => setPlaying(current => {
		/* Handle start from pause on last frame, if encountered */
		if (frameRef.current>=frameCropEnd) setFrame(frameCropStart);
		/* Invert current playing status */
		return !current;
	}), [frameRef, frameCropStart, frameCropEnd]);

	/* Play button loop checkbox (on change) */
	const toggleLooping = useCallback(({target: {checked}}: ChangeEvent<HTMLInputElement>) => {
		setLoopPlayback(checked);
	}, []);

	/* Timeline track thumb (on change) */
	const timelineTrackSeek = useCallback(({target: {value}}: ChangeEvent<HTMLInputElement>) => {
		const thumbVal = parseInt(value);
		if (frameCropStart<=thumbVal && thumbVal<=frameCropEnd) setFrame(thumbVal);
		else if (thumbVal<frameCropStart && frameRef.current-1>=frameCropStart) setFrame(frameRef.current-1);
		else if (thumbVal>frameCropEnd && frameRef.current+1<=frameCropEnd) setFrame(frameRef.current+1);
	}, [frameRef, frameCropStart, frameCropEnd]);

	/* Timeline track (on context menu) */
	const timelineTrackResetCrop = useCallback((e: MouseEvent<HTMLInputElement>) => {
		e.preventDefault();
		if (e.button==2) {
			setCropStart(frameStart);
			setCropEnd(frameEnd);
		}
	}, [frameEnd]);

	/* Timeline text start frame cell (on change) */
	const timelineTextCropStart = useCallback(({target: {value}}: ChangeEvent<HTMLInputElement>) => {
		const inputVal = parseInt(value);
		if (frameStart<=inputVal && inputVal<frameCropEnd) {
			setCropStart(inputVal);
			if (inputVal>frameRef.current)
				setFrame(inputVal);
		}
	}, [frameRef, frameStart, frameCropEnd]);

	/* Timeline text current frame cell (on change) */
	const timelineTextCurrentFrameSeek = useCallback(({target: {value}}: ChangeEvent<HTMLInputElement>) => {
		const inputVal = parseInt(value);
		if (frameCropStart<=inputVal && inputVal<=frameCropEnd)
			setFrame(inputVal);
	}, [frameCropStart, frameCropEnd]);

	/* Timeline text end frame cell (on change) */
	const timelineTextCropEnd = useCallback(({target: {value}}: ChangeEvent<HTMLInputElement>) => {
		const inputVal = parseInt(value);
		if (frameCropStart<inputVal && inputVal<=frameEnd) {
			setCropEnd(inputVal);
			if (inputVal<frameRef.current)
				setFrame(inputVal);
		}
	}, [frameRef, frameCropStart, frameEnd]);

	// ---------------------------------------------------- App JSX ----------------------------------------------------

	/* Elements/components in the grid are organized top->bottom, left->right */
	return <>
		<div id={"app-grid"} style={(markersLoading||forcesLoading) ? {cursor: "progress"} : {cursor: "default"}}>
			{/* ---------------------------------------------- Grid Row 1 ---------------------------------------------- */}
			<div id={"file-area-flex"}>
				<div id={"marker-file-div"}>
					<input id={"marker-file-button"} className={"file-upload-button"} type={"button"} value={"Choose Marker Data File"} onClick={openMarkerFileSelector} />
					<span id={"marker-file-name"} className={"file-chosen-name"}>{markerFile && !markerParsingError ? markerFile.name : "No file chosen"}</span>
				</div>
				<div id={"force-file-div"}>
					<input id={"force-file-button"} className={"file-upload-button"} type={"button"} value={"Choose Force Plate Data File"} onClick={openForceFileSelector} />
					<span id={"force-file-name"} className={"file-chosen-name"}>{forceFile && !forceParsingError ? forceFile.name : "No file chosen"}</span>
				</div>
			</div>
			<div id={"logo"}>Movilo</div>
			<div id={"output-area-title"}>Selection Info</div>
			{/* ---------------------------------------------- Grid Row 2 ---------------------------------------------- */}
			<div id={"viz-area"}>
				<RenderView frame={frame} markerData={markerFileData} forceData={forceFileData}
					selectedMarkers={selectedMarkers} setSelectedMarkers={setSelectedMarkers}
				/>
			</div>
			<div id={"popup-area"}><ErrorPopup error={error} /></div>
			<div id={"output-area"}>
				{`Label: LASIS
				x: 0.07062
				y: -1.31965
				z: 0.92865
	
				Label: LKJC
				x: 0.10328
				y: -1.47403
				z: 0.48009
	
				Label: LAJC
				x: 0.12071
				y: -1.59442
				z: 0.12018
	
				LKJC Angle: 178.6°
				`}
			</div>
			{/* ---------------------------------------------- Grid Row 3 ---------------------------------------------- */}
			<div id={"timeline-track-area"}>
				<div id="timeline-track-flex">
					<button id={"play-button"} onClick={togglePlaying}>{playing ? <PauseIcon /> : <PlayIcon />}</button>
					<input id={"timeline-track"} type={"range"}
						value={frame} min={frameStart} max={frameEnd}
						onChange={timelineTrackSeek}
						onContextMenu={timelineTrackResetCrop}
					/>
				</div>
			</div>
			<div id={"timeline-manual-area"}>
				<table>
					<tr>
						<td><span className={"timeline-cell label"}>Frame</span></td>
						{/* Start frame */}
						<td><input className={"timeline-cell"} type={"number"}
							value={frameCropStart} min={frameStart} max={frameCropEnd-1}
							onChange={timelineTextCropStart}
						/></td>
						{/* Current frame */}
						<td><input className={"timeline-cell"} type={"number"}
							value={frame} min={frameCropStart} max={frameCropEnd}
							onChange={timelineTextCurrentFrameSeek}
						/></td>
						{/* End frame */}
						<td><input className={"timeline-cell"} type={"number"}
							value={frameCropEnd} min={frameCropStart+1} max={frameEnd}
							onChange={timelineTextCropEnd}
						/></td>
					</tr>
					<tr>
						<td><span className={"timeline-cell label"}>Time</span></td>
						{/* Start time */}
						<td><input className={"timeline-cell"} type={"number"} disabled
							value={frameEnd>0 ? markerFileData.frames[frameCropStart]?.time : 0}
						/></td>
						{/* Current time */}
						<td><input className={"timeline-cell"} type={"number"} disabled
							value={frameEnd>0 ? markerFileData.frames[frame]?.time : 0}
						/></td>
						{/* End time */}
						<td><input className={"timeline-cell"} type={"number"} disabled
							value={frameEnd>0 ? markerFileData.frames[frameCropEnd]?.time : 0}
						/></td>
					</tr>
					<tr>
						<td><span className={"timeline-cell label"}></span></td>
						<td><span className={"timeline-cell label"}>Start</span></td>
						<td><span className={"timeline-cell label"}>Current</span></td>
						<td><span className={"timeline-cell label"}>End</span></td>
					</tr>
				</table>
			</div>
			{/* ---------------------------------------------- Grid Row 4 ---------------------------------------------- */}
			<div id={"timeline-track-under-area"}>
				<label id={"play-button-loop-checkbox-label"}>Loop:
					<input id={"play-button-loop-checkbox"} type={"checkbox"}
						checked={loopPlayback}
						onChange={toggleLooping}
					/>
				</label>
			</div>
		</div>
		{/* --------------------------------------------- Beneath App grid --------------------------------------------- */}
		<div id={"sdp-logo-area"}>
			<div id={"sdp-flex"}>
				{/* eslint-disable-next-line @typescript-eslint/no-var-requires */}
				<img id={"sdp-logo"} src={require('../assets/images/sdp-logo-3.png').default} alt="senior design project logo" />
				<div id={"sdp-info"}>
					{`This website was created for a Boise State University
					Computer Science Senior Design Project by
					
					Colin Reeder
					Connor Jackson
					Cory Tomlinson
					Javier Trejo
					William Kenny
					
					For information about sponsoring a project, go to
					`}
					<a href={"https://www.boisestate.edu/coen-cs/community/cs481-senior-design-project/"}>
						https://www.boisestate.edu/coen-cs/community/cs481-senior-design-project/
					</a>
				</div>
			</div>
		</div>
	</>;
}
