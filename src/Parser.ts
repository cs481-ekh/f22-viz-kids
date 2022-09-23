import type {MarkerFileData} from './DataTypes';


export async function parseMarkerFileData(file: File): Promise<MarkerFileData> {
    return {
        markers: [],
        frames: []
    };
}
