import * as React from "react";
import { MarkerFileData } from "../dataTypes";
import { computeAngle } from "../modules/Calculations";

interface Props {
    markerData: MarkerFileData;
    selectedMarkers: number[];
    frame: number;
}

export default function SelectionInfoView(
    {
        markerData, selectedMarkers, frame
    }: Props
) {
    if(selectedMarkers.length === 0)
        return <div id={"selection-info-view"}><p>Nothing selected</p></div>;

    const selectedMarkersMetadata = <>
        {
            selectedMarkers.map(idx => {
                const info = markerData.markers[idx];
                const frameInfo = markerData.frames[frame].positions[idx];
                return <p key={idx}> {/* idx here is effectively an ID in the loaded data */}
                    Label: {info.label}<br />
                    {
                        frameInfo === null ?
                            "Unknown position" :
                            <>
                                x: {frameInfo.x}<br />
                                y: {frameInfo.y}<br />
                                z: {frameInfo.z}
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

    return <div id={"selection-info-view"}>
        {angleOutput}
        {selectedMarkersMetadata}
    </div>;
}