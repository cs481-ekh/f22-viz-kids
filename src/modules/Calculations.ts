import { MarkerFileData, Point3D } from '../dataTypes';


/* Compute the angle between the first three Point3Ds in the provided Array
 * in degrees, with index 0 as theta. */
export function computeAngle(points: Array<Point3D|null>): number|null {

    if (points.length < 3)
        return null;

    const first3HasNull = points.slice(0,3).some(point => point===null);

    if (first3HasNull) //may occur in the case of a flickering selected marker
        return null;

    /* Convert 3 points to 2 vectors that share the same relative origin */
    const origin = points[0];
    const vecAB = {
        x: points[1]!.x - origin!.x,
        y: points[1]!.y - origin!.y,
        z: points[1]!.z - origin!.z
    }
    const vecAC = {
        x: points[2]!.x - origin!.x,
        y: points[2]!.y - origin!.y,
        z: points[2]!.z - origin!.z
    }

    /* Compute angle according to the formula:
     *
     *               dot(AB,AC)
     * cos(theta) = -----------
     *              |AB| * |AC|
     */
    const dotProduct = (vecAB.x*vecAC.x) + (vecAB.y*vecAC.y) + (vecAB.z*vecAC.z);

    const vecABMag = Math.sqrt((vecAB.x**2) + (vecAB.y**2) + (vecAB.z**2));
    const vecACMag = Math.sqrt((vecAC.x**2) + (vecAC.y**2) + (vecAC.z**2));

    const cosTheta = dotProduct / (vecABMag*vecACMag);

    const theta = Math.acos(cosTheta) * 180/Math.PI; //convert to degrees

    return theta;
}


export function computeSuggestedGaitEvents(markerData: MarkerFileData): number[] {
	// find the marker with the lowest position across the whole timeline

	let lowest: null | {index: number; z: number} = null;
	markerData.frames.forEach(frame => {
		frame.positions.forEach((pos, index) => {
			if(pos !== null) {
				if(lowest === null || lowest.z > pos.z) {
					lowest = {index, z: pos.z};
				}
			}
		});
	});

	if(lowest === null) throw new Error("No marker data");
	const lowest_: {index: number} = lowest; // for some reason this makes typechecking work
	const followMarker1 = lowest_.index; // should be one of the feet

	// now, to find the other, we find the lowest point at the time that the first point is highest

	let bestOther: null | {index: number; z1: number; z2: number} = null;
	markerData.frames.forEach(frame => {
		const pos1 = frame.positions[followMarker1];
		if(pos1 !== null) {
			const z1 = pos1.z;
			if(bestOther === null || z1 > bestOther.z1) {
				frame.positions.forEach((pos, index) => {
					if(pos !== null) {
						if(bestOther === null || z1 > bestOther.z1 || bestOther.z2 > pos.z) {
							bestOther = {index, z1, z2: pos.z};
						}
					}
				});
			}
		}
	});

	if(bestOther === null) throw new Error("Failed to find other point"); // shouldn't happen?
	const bestOther_: {index: number} = bestOther;
	const followMarkers = [followMarker1, bestOther_.index];

	const result: number[] = [];

	// skip first and last 2 frames since we compare against neighbours
	for(let i = 2; i < markerData.frames.length - 2; i++) {
		followMarkers.forEach(followMarker => {
			const left = markerData.frames[i - 2].positions[followMarker];
			const current = markerData.frames[i].positions[followMarker];
			const right = markerData.frames[i + 2].positions[followMarker];

			if(left === null || current === null || right === null) return;

			const leftSlope = current.z - left.z;
			const rightSlope = right.z - current.z;

			if(leftSlope < -0.0025 && Math.abs(rightSlope) < 0.002) {
				result.push(i);
			}
		});
	}

	// remove consecutive results
	return result.filter((x, index) => index === 0 || (result[index - 1] !== x - 1 && result[index - 1] !== x));
}
