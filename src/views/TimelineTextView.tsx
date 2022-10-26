import * as React from "react";
import {ChangeEvent, useCallback} from "react";
import {MarkerFileData} from "../dataTypes";

interface Props {
    frameStart: number,
    frame: number, setFrame: React.Dispatch<React.SetStateAction<number>>,
    frameEnd: number,

    frameCropStart: number, setCropStart: React.Dispatch<React.SetStateAction<number>>,
    frameCropEnd: number, setCropEnd: React.Dispatch<React.SetStateAction<number>>,

    frameRef: React.MutableRefObject<number>,

    markerFileData: MarkerFileData,
}

export default function TimelineTextView(
    {
        frameStart,
        frame, setFrame,
        frameEnd,

        frameCropStart, setCropStart,
        frameCropEnd, setCropEnd,

        frameRef,

        markerFileData,
    }: Props
) {
    /* Start cell (on change) */
    const cropStart = useCallback(({target: {value}}: ChangeEvent<HTMLInputElement>) => {
        const inputVal = parseInt(value);
        /* Setting new crop start is constrained by crop end (and start of data) */
        if (frameStart<=inputVal && inputVal<frameCropEnd) {
            setCropStart(inputVal);
            /* Advance current frame to be in new crop range if needed */
            if (inputVal>frameRef.current)
                setFrame(inputVal);
        }
    }, [frameRef, frameStart, frameCropEnd]);

    /* Current cell (on change) */
    const seek = useCallback(({target: {value}}: ChangeEvent<HTMLInputElement>) => {
        const inputVal = parseInt(value);
        /* Setting current frame must be in crop range */
        if (frameCropStart<=inputVal && inputVal<=frameCropEnd)
            setFrame(inputVal);
    }, [frameCropStart, frameCropEnd]);

    /* End cell (on change) */
    const cropEnd = useCallback(({target: {value}}: ChangeEvent<HTMLInputElement>) => {
        const inputVal = parseInt(value);
        /* Setting new crop end is constrained by crop start (and end of data) */
        if (frameCropStart<inputVal && inputVal<=frameEnd) {
            setCropEnd(inputVal);
            /* Rewind current frame to be in new crop range if needed */
            if (inputVal<frameRef.current)
                setFrame(inputVal);
        }
    }, [frameRef, frameCropStart, frameEnd]);

    return <div id={"timeline-text-view"}>
        <table>
            <tr>
                {/* Start frame */}
                <td><input className={"timeline-cell"} type={"number"}
                           value={frameCropStart} min={frameStart} max={frameCropEnd-1}
                           onChange={cropStart}
                /></td>
                {/* Current frame */}
                <td><input className={"timeline-cell"} type={"number"}
                           value={frame} min={frameCropStart} max={frameCropEnd}
                           onChange={seek}
                /></td>
                {/* End frame */}
                <td><input className={"timeline-cell"} type={"number"}
                           value={frameCropEnd} min={frameCropStart+1} max={frameEnd}
                           onChange={cropEnd}
                /></td>
            </tr>
            <tr>
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
                {/* Labels */}
                <td><span className={"timeline-cell label"}>Start</span></td>
                <td><span className={"timeline-cell label"}>Current</span></td>
                <td><span className={"timeline-cell label"}>End</span></td>
            </tr>
        </table>
    </div>;
}