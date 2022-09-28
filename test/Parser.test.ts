import {parseMarkerFileData} from "../src/Parser";
import * as fs from 'fs';
import * as path from 'path';

import type {MarkerFileData,MarkerFrame,Marker,Point3D} from '../src/DataTypes';


test('parse valid marker data',async () => {
    const fileContent: Buffer = fs.readFileSync(path.resolve(__dirname,"./fixtures/Trial001_Markers.tsv"));
    const file: File = new File([fileContent],"Trial001_Markers.tsv",{type: "text/tab-separated-values"});
    await expect(parseMarkerFileData(file)).resolves.toEqual<MarkerFileData>(
        {
            markers: expect.arrayContaining<Marker>([
                {
                    label: "LACR" //first label
                },
                {
                    label: "LLSK" //middle label with empty X Y Z R fields
                },
                {
                    label: "RILCR" //last label
                }
            ]),
            frames: expect.arrayContaining<MarkerFrame>([
                {
                    time: 0.00417,
                    positions: expect.arrayContaining<Point3D|null>([
                        { //LACR
                            x: 0.04408,
                            y: -1.36457,
                            z: 1.35774
                        },
                        { //LLSK, which has empty X Y Z R fields
                            x: NaN,
                            y: NaN,
                            z: NaN
                        },
                        { //RILCR
                            x: 0.32163,
                            y: -1.3931,
                            z: 0.99752
                        }
                    ])
                }
            ])
        }
    );
});


test('parse invalid marker data',async () => {
    const fileContent = new ArrayBuffer(4);
    const bin = 0b01110101001010110111010111010001;
    new DataView(fileContent).setUint32(0,bin,true);
    const file: File = new File([fileContent],"data.csv",{type: "text/csv"});
    await expect(parseMarkerFileData(file)).rejects.toThrow("Could not read file as TSV");
});


test('parse invalid marker data file type', async () => {
    const fileContent = new ArrayBuffer(4);
    const bin = 0b01110101001010110111010111010001;
    new DataView(fileContent).setUint32(0,bin,true);
    const file: File = new File([fileContent],"data.bin",{type: "application/octet-stream"});
    await expect(parseMarkerFileData(file)).rejects.toThrow("Unsupported file type application/octet-stream");
});

test('parse valid marker data 2',async () => {
    const fileContent: Buffer = fs.readFileSync(path.resolve(__dirname,"./fixtures/Trial001_Markers.tsv"));
    const file: File = new File([fileContent],"Trial001_Markers.tsv",{type: "text/tab-separated-values"});
    await expect(parseMarkerFileData(file)).resolves.toEqual<MarkerFileData>(
        {
            markers: expect.arrayContaining<Marker>([
                {
                    label: "LACR" //first label
                },
                {
                    label: "LLSK" //middle label with empty X Y Z R fields
                },
                {
                    label: "RILCR" //last label
                }
            ]),
            frames: expect.arrayContaining<MarkerFrame>([
                {
                    time: 0.00833,
                    positions: expect.arrayContaining<Point3D|null>([
                        { //LACR
                            x: 0.04463,
                            y: -1.35998,
                            z: 1.35677
                        },
                        { //LLSK, which has empty X Y Z R fields
                            x: NaN,
                            y: NaN,
                            z: NaN
                        },
                        { //RILCR
                            x: 0.32196,
                            y: -1.3884,
                            z: 0.99661
                        }
                    ])
                }
            ])
        }
    );
});

test('parse valid marker data 3',async () => {
    const fileContent: Buffer = fs.readFileSync(path.resolve(__dirname,"./fixtures/Trial001_Markers.tsv"));
    const file: File = new File([fileContent],"Trial001_Markers.tsv",{type: "text/tab-separated-values"});
    await expect(parseMarkerFileData(file)).resolves.toEqual<MarkerFileData>(
        {
            markers: expect.arrayContaining<Marker>([
                {
                    label: "LACR" //first label
                },
                {
                    label: "LLSK" //middle label with empty X Y Z R fields
                },
                {
                    label: "RILCR" //last label
                }
            ]),
            frames: expect.arrayContaining<MarkerFrame>([
                {
                    time: 0.0125,
                    positions: expect.arrayContaining<Point3D|null>([
                        { //LACR
                            x: 0.04519,
                            y: -1.35523,
                            z: 1.35585
                        },
                        { //LLSK, which has empty X Y Z R fields
                            x: NaN,
                            y: NaN,
                            z: NaN
                        },
                        { //RILCR
                            x: 0.32234,
                            y: -1.3838,
                            z: 0.99568
                        }
                    ])
                }
            ])
        }
    );
});

test('parse valid marker data bottom up 1',async () => {
    const fileContent: Buffer = fs.readFileSync(path.resolve(__dirname,"./fixtures/Trial001_Markers.tsv"));
    const file: File = new File([fileContent],"Trial001_Markers.tsv",{type: "text/tab-separated-values"});
    await expect(parseMarkerFileData(file)).resolves.toEqual<MarkerFileData>(
        {
            markers: expect.arrayContaining<Marker>([
                {
                    label: "LACR" //first label
                },
                {
                    label: "LLSK" //middle label with empty X Y Z R fields
                },
                {
                    label: "RILCR" //last label
                }
            ]),
            frames: expect.arrayContaining<MarkerFrame>([
                {
                    time: 2.05417,
                    positions: expect.arrayContaining<Point3D|null>([
                        { //LACR
                            x: 0.09354,
                            y: 0.62127,
                            z: 1.37952
                        },
                        { //LLSK, which has empty X Y Z R fields
                            x: NaN,
                            y: NaN,
                            z: NaN
                        },
                        { //RILCR
                            x: 0.37687,
                            y: 0.63324,
                            z: 1.01455
                        }
                    ])
                }
            ])
        }
    );
});

test('parse valid marker data bottom up 2',async () => {
    const fileContent: Buffer = fs.readFileSync(path.resolve(__dirname,"./fixtures/Trial001_Markers.tsv"));
    const file: File = new File([fileContent],"Trial001_Markers.tsv",{type: "text/tab-separated-values"});
    await expect(parseMarkerFileData(file)).resolves.toEqual<MarkerFileData>(
        {
            markers: expect.arrayContaining<Marker>([
                {
                    label: "LACR" //first label
                },
                {
                    label: "LLSK" //middle label with empty X Y Z R fields
                },
                {
                    label: "RILCR" //last label
                }
            ]),
            frames: expect.arrayContaining<MarkerFrame>([
                {
                    time: 2.05,
                    positions: expect.arrayContaining<Point3D|null>([
                        { //LACR
                            x: 0.09372,
                            y: 0.61867,
                            z: 1.37884
                        },
                        { //LLSK, which has empty X Y Z R fields
                            x: NaN,
                            y: NaN,
                            z: NaN
                        },
                        { //RILCR
                            x: 0.37728,
                            y: 0.63108,
                            z: 1.01382
                        }
                    ])
                }
            ])
        }
    );
});
