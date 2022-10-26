import { Point3D } from '../dataTypes';


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