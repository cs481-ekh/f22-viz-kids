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
        frameStart, frame, frameEnd, frameCropStart, frameCropEnd, frameRef,
        setFrame, setCropStart, setCropEnd,
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

    return <div id={"timeline-track-area"}>
        <div id="timeline-track-flex">
            <button id={"play-button"}
                    onClick={togglePlaying}>{playing ? <PauseIcon /> : <PlayIcon />}
            </button>
            <input id={"timeline-track"} type={"range"}
                   value={frame} min={frameStart} max={frameEnd}
                   onChange={timelineTrackSeek}
                   onContextMenu={timelineTrackResetCrop}
            />
        </div>
    </div>;
}