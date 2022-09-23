
export interface Point3D {
    x: number;
    y: number;
    z: number;
}

export interface Marker {
    label: string;
}

export interface MarkerFrame {
    time: number;
    positions: Array<Point3D|null>; //indices match
}

export interface MarkerFileData {
    markers: Array<Marker>; //indices match
    frames: Array<MarkerFrame>;
}

