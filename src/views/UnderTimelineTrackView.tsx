import * as React from "react";
import {ChangeEvent, useCallback} from "react";

interface Props {
    loopPlayback: boolean, setLoopPlayback: React.Dispatch<React.SetStateAction<boolean>>,
}

export default function UnderTimelineTrackView(
    {
        loopPlayback, setLoopPlayback,
    }: Props
) {
    /* Play button loop checkbox (on change) */
    const toggleLooping = useCallback(({target: {checked}}: ChangeEvent<HTMLInputElement>) => {
        setLoopPlayback(checked);
    }, []);

    return <div id={"timeline-track-under-area"}>
        <label id={"play-button-loop-checkbox-label"}>Loop:
            <input id={"play-button-loop-checkbox"} type={"checkbox"}
                   checked={loopPlayback}
                   onChange={toggleLooping}
            />
        </label>
    </div>;
}