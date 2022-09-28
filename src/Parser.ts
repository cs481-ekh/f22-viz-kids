import * as TSV from 'papaparse';
import type {MarkerFileData, ForceFileData} from './DataTypes';


export async function parseMarkerFileData(file: File): Promise<MarkerFileData> {

    const markersRow = 1;
    const frame1Row = 5;
    const timesCol = 1;
    const marker1Col = 2;

    const tsvTable = await tsvToTable(file);
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


export async function parseForceFileData(file: File): Promise<ForceFileData> {

    const frame1Row = 6;
    const timesCol = 0;
    const force1CompCol = 1;
    const force1PosCol = 4;
    const force1TrqCol = 14;
    const force2CompCol = 7;
    const force2PosCol = 10;
    const force2TrqCol = 17;

    const tsvTable = await tsvToTable(file);
    const fileData: ForceFileData = { //the return val to populate
        frames: []
    };

    /* Extract row data */
    for (let row=frame1Row; row<tsvTable.length; row++) {
        /* Read a new Frame */
        fileData.frames.push({
            time: parseFloat(tsvTable[row][timesCol]),
            forces: []
        });
        /* Populate the Frame's forces */
        fileData.frames[row-frame1Row].forces.push(
            { //Force 1
                position: {
                    x: parseFloat(tsvTable[row][force1PosCol]),
                    y: parseFloat(tsvTable[row][force1PosCol+1]),
                    z: parseFloat(tsvTable[row][force1PosCol+2])
                },
                components: {
                    x: parseFloat(tsvTable[row][force1CompCol]),
                    y: parseFloat(tsvTable[row][force1CompCol+1]),
                    z: parseFloat(tsvTable[row][force1CompCol+2])
                },
                torque: parseFloat(tsvTable[row][force1TrqCol])
            },
            { //Force 2
                position: {
                    x: parseFloat(tsvTable[row][force2PosCol]),
                    y: parseFloat(tsvTable[row][force2PosCol+1]),
                    z: parseFloat(tsvTable[row][force2PosCol+2])
                },
                components: {
                    x: parseFloat(tsvTable[row][force2CompCol]),
                    y: parseFloat(tsvTable[row][force2CompCol+1]),
                    z: parseFloat(tsvTable[row][force2CompCol+2])
                },
                torque: parseFloat(tsvTable[row][force2TrqCol])
            }
        );
    }

    return fileData;
}


async function tsvToTable(file: File): Promise<string[]> {

    if (!file || !(file.type==="text/plain" || file.type==="text/csv" || file.type==="text/tab-separated-values")) {
        return Promise.reject(new Error("Unsupported file type "+file.type));
    }

    const parseResult: TSV.ParseResult<string>|null = await new Promise((resolve, reject) => {
        TSV.parse(file, {delimiter: "\t", complete: resolve, error: reject});
    });
    if (!parseResult || !parseResult.data || parseResult.data.length<6 || !(parseResult.data[4][0]==="ITEM" || parseResult.data[5][0]==="time")) {
        return Promise.reject(new Error("Could not read file as TSV"));
    }

    return parseResult.data;
}