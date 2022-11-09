import * as React from "react";
import {PauseIcon, PlayIcon} from "../icons";
import {ChangeEvent, MouseEvent, useCallback} from "react";
import useStateRef from "../useStateRef";

interface Props {
    frameStart: number,
    frame: number, setFrame: React.Dispatch<React.SetStateAction<number>>,
    frameEnd: number,

    frameCropStart: number, setCropStart: React.Dispatch<React.SetStateAction<number>>,
    frameCropEnd: number, setCropEnd: React.Dispatch<React.SetStateAction<number>>,

    frameSpeed: number, setFrameSpeed: React.Dispatch<React.SetStateAction<number>>,

    playing: boolean, setPlaying: React.Dispatch<React.SetStateAction<boolean>>,
    loopPlayback: boolean, setLoopPlayback: React.Dispatch<React.SetStateAction<boolean>>,

    gaitEventSuggestions: number[],
}

export default function TimelineTrackView(
    {
        frameStart,
        frame, setFrame,
        frameEnd,

        frameCropStart, setCropStart,
        frameCropEnd, setCropEnd,

        frameSpeed, setFrameSpeed,   
        
        playing, setPlaying,
        loopPlayback, setLoopPlayback,

        gaitEventSuggestions,
    }: Props
) {
    /* Current frame reference for use in dependency arrays where we don't want to trigger on every frame change */
    const frameRef = useStateRef(frame);

    /* Play button (on click) */
    const togglePlaying = useCallback(() => setPlaying(current => {
        /* Handle start from pause on last frame, if encountered */
        if (frameRef.current>=frameCropEnd) setFrame(frameCropStart);
        /* Invert current playing status */
        return !current;
    }), [frameRef, frameCropStart, frameCropEnd, setFrame, setPlaying]);

    /* Play button loop checkbox (on change) */
    const toggleLooping = useCallback(({target: {checked}}: ChangeEvent<HTMLInputElement>) => {
        setLoopPlayback(checked);
    }, [setLoopPlayback]);

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
    }, [frameRef, frameCropStart, frameCropEnd, setFrame]);

    /* Gait event button (on click) */
    const cropStart = useCallback((eventFrame: number) => {
        /* Setting new crop start is constrained by crop end (and start of data) */
        if (frameStart<=eventFrame && eventFrame<frameCropEnd) {
            setCropStart(eventFrame);
            /* Advance current frame to be in new crop range if needed */
            if (eventFrame>frameRef.current)
                setFrame(eventFrame);
        }
    }, [frameStart, frameCropEnd, setCropStart, setFrame, frameRef]);

    /* Gait event button (on context menu) */
    const cropEnd = useCallback((eventFrame: number) => {
        /* Setting new crop end is constrained by crop start (and end of data) */
        if (frameCropStart<eventFrame && eventFrame<=frameEnd) {
            setCropEnd(eventFrame);
            /* Rewind current frame to be in new crop range if needed */
            if (eventFrame<frameRef.current)
                setFrame(eventFrame);
        }
    }, [frameCropStart, frameEnd, setCropEnd, setFrame, frameRef]);

    /* Timeline track (on context menu) */
    const resetCrop = useCallback((e: MouseEvent<HTMLInputElement>) => {
        e.preventDefault();
        setCropStart(frameStart);
        setCropEnd(frameEnd);
    }, [frameEnd, frameStart, setCropEnd, setCropStart]);

    const frameSpeedOnChange = useCallback(({target: {value}}: ChangeEvent<HTMLInputElement>) => {
        const inputVal = parseFloat(value);
        setFrameSpeed(inputVal);
        
    }, [setFrameSpeed]);

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
                <input id={"rate-input"} type={"number"} step={0.1} value={frameSpeed} min={0.1} max={5.0} 
                        onChange={frameSpeedOnChange}/>x
            </div>
        </div>
        <div id={"gait-suggestion-div"}>
            {
                gaitEventSuggestions.map(eventFrame => {
                    const percentageOfPlayLength = (eventFrame/frameEnd) * 100;
                    const buttonWidth = 4;
                    return <button style={{left: `calc(${percentageOfPlayLength}% - ${buttonWidth/2}px)`}}
                                   onClick={() => cropStart(eventFrame)}
                                   onContextMenu={e => {e.preventDefault(); cropEnd(eventFrame);}}
                    />
                })
            }
        </div>
    </div>;
}
