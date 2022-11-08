import * as React from "react";
import { ForceFileData, MarkerFileData } from "../dataTypes";
import { computeAngle } from "../modules/Calculations";

interface Props {
    markerData: MarkerFileData;
    selectedMarkers: number[];
    frame: number;
    forceData: ForceFileData;
}

export default function SelectionInfoView(
    {
        markerData, selectedMarkers, forceData, frame
    }: Props
) {
    const signedValAsString = (n: number) => (n>=0 ? "+" : "") + n;

    const selectedMarkersMetadata = <>
        {
            selectedMarkers.length === 0 ?
                <p>Nothing selected</p> :
                selectedMarkers.map(idx => {
                    const label = markerData.markers[idx].label;
                    const pos = markerData.frames[frame].positions[idx];
                    return <p key={idx}> {/* idx here is effectively an ID in the loaded data */}
                        Label: {label}<br />
                        {
                            pos === null ?
                                "Unknown position" :
                                <>
                                    x: {signedValAsString(pos.x)}<br />
                                    y: {signedValAsString(pos.y)}<br />
                                    z: {signedValAsString(pos.z)}
                                </>
                        }
                    </p>;
                })
        }
    </>;

    let angleOutput;
    if (selectedMarkers.length >= 3) {
        const thetaLabel = markerData.markers[selectedMarkers[0]].label;
        const first3Pos = selectedMarkers.slice(0,3).map(idx => markerData.frames[frame].positions[idx]);
        let angle = computeAngle(first3Pos);
        if (angle!==null) {
            angle = Math.round(10*angle) / 10; //round to the nearest tenth
            angleOutput = <p>{thetaLabel} Angle: {angle}°</p>;
        }
        else angleOutput = <p>Unknown angle (missing marker)</p>;
    }
    else angleOutput = <></>; //no output: not enough selected
    /* Always display force metadata when a force file is loaded */
    const forcesMetadata = <>
        {
            /* Forces, when present, are always at index 0 and 1 */
            [0,1].map(idx => {
                const force = forceData?.frames[frame]?.forces[idx];
                return <p key={"f"+(idx+1)}>
                    {
                        force === undefined ?
                            <></> :
                            <>
                                Force {idx+1}<br />
                                px: {signedValAsString(force.position.x)}<br />
                                py: {signedValAsString(force.position.y)}<br />
                                pz: {signedValAsString(force.position.z)}<br />
                                vx: {signedValAsString(force.components.x)}<br />
                                vy: {signedValAsString(force.components.y)}<br />
                                vz: {signedValAsString(force.components.z)}<br />
                                { force.torque.x !== 0 && <>
                                torque x: {signedValAsString(force.torque.x)}<br /> 
                                </>}
                                { force.torque.y !== 0 && <>
                                torque y: {signedValAsString(force.torque.y)}<br /> 
                                </>}
                                { force.torque.z !== 0 && <>
                                torque z: {signedValAsString(force.torque.z)}<br /> 
                                </>}
                            </>
                    }
                </p>;
            })
        }
    </>;

    return <div id={"selection-info-view"}>
        {angleOutput}
        {selectedMarkersMetadata}
        {forcesMetadata}
    </div>;
}
