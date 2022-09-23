
export interface Point3D {
    x: number;
    y: number;
    z: number;
}

export interface Marker {
    label: string;
}

export interface Frame {
    time: number;
    positions: Array<Point3D|null>; //indices match
}

export interface MarkerFileData {
    markers: Array<Marker>; //indices match
    frames: Array<Frame>;
}

