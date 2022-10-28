import * as React from "react";
import {PauseIcon, PlayIcon} from "../icons";
import {ChangeEvent, MouseEvent, useCallback} from "react";

interface Props {
    frameStart: number,
    frame: number, setFrame: React.Dispatch<React.SetStateAction<number>>,
    frameEnd: number,

    frameCropStart: number, setCropStart: React.Dispatch<React.SetStateAction<number>>,
    frameCropEnd: number, setCropEnd: React.Dispatch<React.SetStateAction<number>>,

    frameRef: React.MutableRefObject<number>,

    playing: boolean, setPlaying: React.Dispatch<React.SetStateAction<boolean>>,
    loopPlayback: boolean, setLoopPlayback: React.Dispatch<React.SetStateAction<boolean>>,
}

export default function TimelineTrackView(
    {
        frameStart,
        frame, setFrame,
        frameEnd,

        frameCropStart, setCropStart,
        frameCropEnd, setCropEnd,

        frameRef,

        playing, setPlaying,
        loopPlayback, setLoopPlayback,
    }: Props
) {
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
    const seek = useCallback(({target: {value}}: ChangeEvent<HTMLInputElement>) => {
        const thumbVal = parseInt(value);
        /* ThumbVal is in range: set frame to it */
        if (frameCropStart<=thumbVal && thumbVal<=frameCropEnd)
            setFrame(thumbVal);
        /* ThumbVal is too low: decrement frame until at crop start */
        else if (thumbVal<frameCropStart && frameCropStart<=frameRef.current-1)
            setFrame(frameRef.current-1);
        /* ThumbVal is too high: increment frame until at crop end */
        else if (thumbVal>frameCropEnd && frameCropEnd>=frameRef.current+1)
            setFrame(frameRef.current+1);
    }, [frameRef, frameCropStart, frameCropEnd]);

    /* Timeline track (on context menu) */
    const resetCrop = useCallback((e: MouseEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.button==2) {
            /* Undo crop */
            setCropStart(frameStart);
            setCropEnd(frameEnd);
        }
    }, [frameEnd]);

    return <div id={"timeline-track-view"}>
        {/* ---------------------------------------------- Sub-Grid Row 1 ---------------------------------------------- */}
        <button id={"play-button"} onClick={togglePlaying}>
            {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
        <input id={"timeline-track"} type={"range"}
               value={frame} min={frameStart} max={frameEnd}
               onChange={seek} onContextMenu={resetCrop}
        />
        {/* ---------------------------------------------- Sub-Grid Row 2 ---------------------------------------------- */}
        <div id={"play-button-options"}>
            {/* option divs are stacked in flex column */}
            <div id={"loop-div"}>
                Loop: <input id={"loop-checkbox"} type={"checkbox"} checked={loopPlayback} onChange={toggleLooping} />
            </div>
            <div id={"rate-div"}>
                {/* TODO: add rate input */}
            </div>
        </div>
        <div id={"gait-suggestion-div"}>
            {/* TODO: add buttons */}
        </div>
    </div>;
}