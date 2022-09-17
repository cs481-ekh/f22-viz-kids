
interface Point3D {
    x: number;
    y: number;
    z: number;
}

interface Point3DInfo {
    label: string;
}

interface Frame {
    time: number;
    positions: Array<Point3D|null>; //indices match
}

interface MarkerFileData {
    markers: Array<Point3DInfo>; //indices match
    frames: Array<Frame>;
}

