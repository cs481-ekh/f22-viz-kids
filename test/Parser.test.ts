import {parseMarkerFileData,parseForceFileData} from "../src/Parser";
import * as fs from 'fs';
import * as path from 'path';

import type {MarkerFileData,MarkerFrame,Marker,Point3D,ForceFileData,ForceFrame,Force} from '../src/DataTypes';


test('parse undefined', async () => {
    //eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    await expect(parseMarkerFileData(undefined)).rejects.toThrow(/no file was selected/);
});


test('parse invalid file type (unknown extension)', async () => {
    const fileContent: Buffer = fs.readFileSync(path.resolve(__dirname, "./fixtures/invalid.unknown"));
    const file: File = new File([fileContent],"invalid.unknown",{type: ""});
    await expect(parseMarkerFileData(file)).rejects.toThrow(/unsupported file type/);
});


test('parse invalid file type (.bin)', async () => {
    const fileContent: Buffer = fs.readFileSync(path.resolve(__dirname, "./fixtures/invalid.bin")); //does contain raw binary
    const file: File = new File([fileContent],"invalid.bin",{type: "application/octet-stream"});
    await expect(parseMarkerFileData(file)).rejects.toThrow(/unsupported file type/);
});


test('parse invalid data (binary / undetectable delimiter)', async () => {
    const fileContent: Buffer = fs.readFileSync(path.resolve(__dirname, "./fixtures/invalid.bin")); //does contain raw binary
    const file: File = new File([fileContent],"invalid.csv",{type: "text/csv"}); //lying about extension and contents
    await expect(parseMarkerFileData(file)).rejects.toThrow(/data does not conform to official CSV\/TSV standard/);
});


test('parse invalid data (unmatched quote)', async () => {
    // const fileContent = "\"Invalid \" orphaned quote\"";
    const fileContent: Buffer = fs.readFileSync(path.resolve(__dirname, "./fixtures/invalid.txt")); //contains unmatched quote and no delimiter
    const file: File = new File([fileContent],"invalid.txt",{type: "text/plain"});
    await expect(parseMarkerFileData(file)).rejects.toThrow(/data does not conform to official CSV\/TSV standard/);
});


test('parse invalid data (non- Vicon or OpenSim file)', async () => {
    const fileContent: Buffer = fs.readFileSync(path.resolve(__dirname, "./fixtures/invalid.csv"));
    const file: File = new File([fileContent], "invalid.csv", {type: "text/csv"});
    await expect(parseMarkerFileData(file)).rejects.toThrow(/data does not match expected format/);
});


test('parse invalid data (marker file accidentally as force file)', async () => {
    const fileContent: Buffer = fs.readFileSync(path.resolve(__dirname,"./fixtures/Trial001_Markers.tsv"));
    const file: File = new File([fileContent],"Trial001_Markers.tsv",{type: "text/tab-separated-values"});
    await expect(parseForceFileData(file)).rejects.toThrow(/you selected a marker file with the force file button/);
});


test('parse invalid data (force file accidentally as marker file)', async () => {
    const fileContent: Buffer = fs.readFileSync(path.resolve(__dirname,"./fixtures/Trial001_Forces.tsv"));
    const file: File = new File([fileContent],"Trial001_Forces.tsv",{type: "text/tab-separated-values"});
    await expect(parseMarkerFileData(file)).rejects.toThrow(/you selected a force file with the marker file button/);
});


test('parse valid marker data (frame 1, CSV format)', async () => {
    const fileContent: Buffer = fs.readFileSync(path.resolve(__dirname,"./fixtures/valid.csv"));
    const file: File = new File([fileContent],"valid.csv",{type: "text/csv"});
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
                    time: 0,
                    positions: expect.arrayContaining<Point3D|null>([
                        { //LACR
                            x: 0.04353,
                            y: -1.36928,
                            z: 1.35853
                        },
                        { //LLSK, which has empty X Y Z R fields
                            x: NaN,
                            y: NaN,
                            z: NaN
                        },
                        { //RILCR
                            x: 0.32123,
                            y: -1.3977,
                            z: 0.99837
                        }
                    ])
                }
            ])
        }
    );
});


test('parse valid marker data (frame 2)', async () => {
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


test('parse valid marker data (frame 3)', async () => {
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


test('parse valid marker data (frame 4)', async () => {
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


test('parse valid marker data bottom up (frame 494)', async () => {
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


test('parse valid marker data bottom up (frame 493)', async () => {
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


test('parse valid force data (frame 151, .mot format)', async () => {
    const fileContent: Buffer = fs.readFileSync(path.resolve(__dirname,"./fixtures/valid.mot"));
    const file: File = new File([fileContent],"valid.mot",{type: ""});
    await expect(parseForceFileData(file)).resolves.toEqual<ForceFileData>(
        {
            frames: expect.arrayContaining<ForceFrame>([
                {
                    time: 0.625,
                    forces: expect.arrayContaining<Force>([
                        {
                            position: {
                                x: -0.857289,
                                y: 0.047706,
                                z: 0.277595
                            },
                            components: {
                                x: 86.972282,
                                y: 556.103516,
                                z: -26.744749
                            },
                            torque: -0.803734
                        },
                        {
                            position: {
                                x: -0.387263,
                                y: 0.069719,
                                z: 0.173425
                            },
                            components: {
                                x: -2.094968,
                                y: 22.52507,
                                z: 0.041487
                            },
                            torque: 0.360246
                        }
                    ])
                }
            ])
        }
    );
});


test('parse valid force data (frame 23)', async () => {
    const fileContent: Buffer = fs.readFileSync(path.resolve(__dirname,"./fixtures/Trial001_Forces.tsv"));
    const file: File = new File([fileContent],"Trial001_Forces.tsv",{type: "text/tab-separated-values"});
    await expect(parseForceFileData(file)).resolves.toEqual<ForceFileData>(
        {
            frames: expect.arrayContaining<ForceFrame>([
                {
                    time: 0.091667,
                    forces: expect.arrayContaining<Force>([
                        {
                            position: {
                                x: -1.021202,
                                y: 0.061155,
                                z: 0.224887
                            },
                            components: {
                                x: -2.664502,
                                y: 27.719698,
                                z: 0.682527
                            },
                            torque: 0.157576
                        }
                    ])
                }
            ])
        }
    );
});
