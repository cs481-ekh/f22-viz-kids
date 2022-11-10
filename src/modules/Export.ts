import { MarkerFileData } from "../dataTypes";

import { computeAngle } from "./Calculations";

export function getAngleExportContent(markerData: MarkerFileData, cropStart: number, cropEnd: number, selectedMarkers: number[]): string {
	if(selectedMarkers.length < 3) {
		throw new Error("Must have at least three markers selected to export angles");
	}

	const usedMarkers = selectedMarkers.slice(0, 3);

	let result = "Frame\tTime\tAngle: " + usedMarkers.map(idx => markerData.markers[idx].label).join(", ");

	for(let i = cropStart; i <= cropEnd; i++) {
		const frame = markerData.frames[i];

		const angle = computeAngle(usedMarkers.map(idx => frame.positions[idx]));
		result += "\n" + i + "\t" + frame.time + "\t" + (angle === null ? "" : angle);
	}

	return result;
}
