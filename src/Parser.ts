import * as TSV from 'papaparse';
import {MarkerFileData, ForceFileData, Point3D, Force} from './DataTypes';


export async function parseMarkerFileData(file: File): Promise<MarkerFileData> {

    const markersRow = 1;
    const frame1Row = 5;
    const timesCol = 1;
    const marker1Col = 2;

    const tsvTable = await tsvToTable(file);
    if (tsvTable[5][0]==="time") {
        return Promise.reject(new Error(
            `you selected a force file with the marker file button\n`+
            `File: ${file.name}`
        ));
    }
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
            let pos: Point3D|null = {
                x: parseFloat(tsvTable[row][labelIdx]),
                y: parseFloat(tsvTable[row][labelIdx+1]),
                z: parseFloat(tsvTable[row][labelIdx+2])
            };
            if (isNaN(pos.x)||isNaN(pos.y)||isNaN(pos.z))
                pos = null;
            fileData.frames[row-frame1Row].positions.push(pos);
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
    if (tsvTable[4][0]==="ITEM") {
        return Promise.reject(new Error(
            `you selected a marker file with the force file button\n`+
            `File: ${file.name}`
        ));
    }
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
        let force1: Force|null = {
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
        };
        if (isNaN(force1.position.x) || isNaN(force1.position.y) || isNaN(force1.position.z)
           || (force1.position.x===0 && force1.position.y===0 && force1.position.z===0)
        ) {
            force1 = null;
        }
        let force2: Force|null = {
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
        };
        if (isNaN(force2.position.x) || isNaN(force2.position.y) || isNaN(force2.position.z)
           || (force2.position.x===0 && force2.position.y===0 && force2.position.z===0)
        ) {
            force2 = null;
        }
        fileData.frames[row-frame1Row].forces.push(force1,force2);
    }

    return fileData;
}


async function tsvToTable(file: File): Promise<string[]> {

    if (!file?.name) {
        return Promise.reject(new Error("no file was selected"));
    }

    const supportedFile = file.name.endsWith(".tsv") || file.name.endsWith(".csv") || file.name.endsWith(".txt") || file.name.endsWith(".mot");

    if (!supportedFile) {
        return Promise.reject(new Error(
            `unsupported file type\n`+
            `File: ${file.name}\n\n`+

            `Provided type ${!file.type ? "unknown" : file.type}, but Movilo requires .tsv, .csv, .txt, or .mot`
        ));
    }

    const parseResult: TSV.ParseResult<string> = await new Promise((resolve, reject) => {
        TSV.parse(file, {complete: resolve, error: reject});
    }); //auto-detects delimiter; never throws error, result always contains errors property which details problems, like undetectable delimiter

    if (parseResult.errors.length!==0) {
        return Promise.reject(new Error(
            `data does not conform to official CSV/TSV standard (see IETF RFC 4180)\n`+
            `File: ${file.name}\n\n`+

            `Identified the following errors and their locations in the file:\n`+
            `${JSON.stringify(parseResult.errors,null,2)}` //gives column and index of error, such as an unmatched quote
        ));
    }

    if (parseResult.data.length<6 || !(parseResult.data[4][0]==="ITEM" || parseResult.data[5][0]==="time")) {
        return Promise.reject(new Error(
            `data does not match expected format\n`+
            `File: ${file.name}\n\n`+

            `File contents are misaligned with respect to the output format of Vicon Nexus or OpenSim.\n\n`+

            `Expected marker data format example:\n`+
            `https://docs.google.com/spreadsheets/d/14K0VqbQBQEx_8pWsol8vbl4y-JbVtbO4hzpDPxofYtI/edit?usp=sharing\n\n`+

            `Expected force data format example:\n`+
            `https://docs.google.com/spreadsheets/d/1hCI3JGnILWrYeuYISfwEFBdMzEsuuWzSdFfUbpwdxsk/edit?usp=sharing`
        ));
    }

    return parseResult.data;
}