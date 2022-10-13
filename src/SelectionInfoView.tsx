import * as React from "react";

import { MarkerFileData } from "./DataTypes";

interface Props {
	markerData: MarkerFileData;
	selectedMarkers: number[];
	frame: number;
}

export default function SelectionInfoView(props: Props) {
	if(props.selectedMarkers.length === 0) return <p>Nothing selected.</p>;
	return <div>
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
	</div>;
}
