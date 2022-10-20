
// -------------------- shared ---------------------

export interface Point3D {
    x: number;
    y: number;
    z: number;
}

// -------------------- markers --------------------

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

// -------------------- forces ---------------------

export interface Force {
    position: Point3D;   //px, py, pz
    components: Point3D; //vx, vy, vz
    torque: number;
}

export interface ForceFrame {
    time: number;
    forces: Array<Force>; //usually 1, at most 2
}

export interface ForceFileData {
    frames: Array<ForceFrame>;
}
