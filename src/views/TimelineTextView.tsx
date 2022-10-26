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
        frameStart, frame, frameEnd, frameCropStart, frameCropEnd, frameRef,
        setFrame, setCropStart, setCropEnd,
        markerFileData,
    }: Props
) {
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

    return <div id={"timeline-manual-area"}>
        <table>
            <tr>
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
                <td><span className={"timeline-cell label"}>Start</span></td>
                <td><span className={"timeline-cell label"}>Current</span></td>
                <td><span className={"timeline-cell label"}>End</span></td>
            </tr>
        </table>
    </div>;
}