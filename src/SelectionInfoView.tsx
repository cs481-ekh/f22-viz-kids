import * as React from "react";

import { MarkerFileData, MarkerFrame } from "./DataTypes";
import { computeAngle} from "./Calculations";

interface Props {
	markerData: MarkerFileData;
	selectedMarkers: number[];
	frame: number;
}

	export default function SelectionInfoView(props: Props) {

		if(props.selectedMarkers.length === 0)
			return <div id={"selection-info-view"}><p>Nothing selected.</p></div>;
	
		const selectedMarkersMetadata = <>
			{
				props.selectedMarkers.map(idx => {
					const info = props.markerData.markers[idx];
					const frameInfo = props.markerData.frames[props.frame].positions[idx];
	
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
	
		const thetaLabel = props.markerData.markers[props.selectedMarkers[0]].label;
		let angle: number|null = null;
		let angleOutput;
	
		if (props.selectedMarkers.length >= 3) {
			const first3Pos = props.selectedMarkers.slice(0,3).map(idx => props.markerData.frames[props.frame].positions[idx]);
			angle = computeAngle(first3Pos);
			if (angle!==null) {
				angle = Math.round(10 * angle) / 10; //round to nearest tenth
				angleOutput = <p>{thetaLabel} Angle: {angle} deg</p>;
			}
			else angleOutput = <p>Unknown angle (missing marker)</p>;
		}
		else angleOutput = <></>; //no output: not enough selected
	
		return <div id={"selection-info-view"}>
			{angleOutput}
			{selectedMarkersMetadata}
		</div>;
	}
