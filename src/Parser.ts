import * as CSV from 'papaparse';
import type {MarkerFileData} from './DataTypes';


export async function parseMarkerFileData(file: File): Promise<MarkerFileData> {

    const markersRow = 1;
    const frame1Row = 5;
    const timesCol = 1;
    const marker1Col = 2;

    if (!file || !(file.type==="text/plain" || file.type==="text/csv" || file.type==="text/tab-separated-values")) {
        return Promise.reject(new Error("Unsupported file type "+file.type));
    }

    const parseResult: CSV.ParseResult<string>|null = await new Promise((resolve, reject) => {
        CSV.parse(file, {delimiter: "\t", complete: resolve, error: reject});
    });

    if (!parseResult || !parseResult.data || parseResult.data.length<6 || parseResult.data[4][0] !== "ITEM") {
        return Promise.reject(new Error("Could not read file as TSV"));
    }

    const {data: tsvTable} = parseResult; //result.data is a 2D array
    const fileData: MarkerFileData = { //the return val to populate
        markers: [],
        frames: []
    };
    const labelToIdxMap = new Map<string,number>(); //maps each marker label to the index of its first column (some may be wider than 3 cols)

    /* Read marker labels from row 1 */
    let label = "";
    for (let col=marker1Col; col<tsvTable[markersRow].length; col++) {
        label = tsvTable[markersRow][col];
        if (!labelToIdxMap.has(label)) {
            labelToIdxMap.set(label,col);
            fileData.markers.push({label: label});
        }
    }

    /* Extract row data */
    for (let row=frame1Row; row<tsvTable.length; row++) {
        /* Read a new Frame */
        fileData.frames.push({
            time: parseFloat(tsvTable[row][timesCol]),
            positions: []
        });
        /* Populate the Frame's positions */
        labelToIdxMap.forEach(labelIdx => { //iterates through labels in insertion order
            fileData.frames[row-frame1Row].positions.push({
                x: parseFloat(tsvTable[row][labelIdx]),
                y: parseFloat(tsvTable[row][labelIdx+1]),
                z: parseFloat(tsvTable[row][labelIdx+2])
            });
        });
    }

    return fileData;
}
