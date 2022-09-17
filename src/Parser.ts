import * as CSV from 'papaparse';


export async function parseMarkerFileData(file: File): Promise<MarkerFileData> {

    if (!file || !(file.type==="text/plain" || file.type==="text/csv")) {
        return Promise.reject(new Error("Unsupported file type "+file.type));
    }

    let parseResult: CSV.ParseResult<string>|null = null;
    try {
        parseResult = await new Promise((resolve, reject) => {
            CSV.parse(file, {delimiter: "\t", complete: resolve, error: reject});
        });
    }
    catch (err) {
        return Promise.reject(err);
    }
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
    for (let col=2; col<tsvTable[1].length; col++) {
        label = tsvTable[1][col];
        if (!labelToIdxMap.has(label)) {
            labelToIdxMap.set(label,col);
            fileData.markers.push({label: label});
        }
    }

    /* Extract row data: for every row beneath the 5 header rows, */
    for (let row=5; row<tsvTable.length; row++) {
        /* Read a new Frame */
        fileData.frames.push({
            time: parseFloat(tsvTable[row][1]),
            positions: []
        });
        /* Populate the Frame's positions */
        labelToIdxMap.forEach(labelIdx => { //iterates through labels in insertion order
            fileData.frames[row-5].positions.push({
                x: parseFloat(tsvTable[row][labelIdx]),
                y: parseFloat(tsvTable[row][labelIdx+1]),
                z: parseFloat(tsvTable[row][labelIdx+2])
            });
        });
    }

    return fileData;
}
