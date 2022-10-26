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
    }: Props
) {
    /* Play button (on click) */
    const togglePlaying = useCallback(() => setPlaying(current => {
        /* Handle start from pause on last frame, if encountered */
        if (frameRef.current>=frameCropEnd) setFrame(frameCropStart);
        /* Invert current playing status */
        return !current;
    }), [frameRef, frameCropStart, frameCropEnd]);

    /* Timeline track thumb (on change) */
    const seek = useCallback(({target: {value}}: ChangeEvent<HTMLInputElement>) => {
        const thumbVal = parseInt(value);
        /* ThumbVal is in range: set frame to it */
        if (frameCropStart<=thumbVal && thumbVal<=frameCropEnd)
            setFrame(thumbVal);
        /* ThumbVal is too low: decrement frame until at crop start */
        else if (thumbVal<frameCropStart && frameRef.current-1>=frameCropStart)
            setFrame(frameRef.current-1);
        /* ThumbVal is too high: increment frame until at crop end */
        else if (thumbVal>frameCropEnd && frameRef.current+1<=frameCropEnd)
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
        <button id={"play-button"} onClick={togglePlaying}>
            {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
        <input id={"timeline-track"} type={"range"}
               value={frame} min={frameStart} max={frameEnd}
               onChange={seek} onContextMenu={resetCrop}
        />
    </div>;
}