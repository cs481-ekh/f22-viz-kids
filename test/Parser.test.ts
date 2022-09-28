import {parseMarkerFileData,parseForceFileData} from "../src/Parser";
import * as fs from 'fs';
import * as path from 'path';

import type {MarkerFileData,MarkerFrame,Marker,Point3D,ForceFileData,ForceFrame,Force} from '../src/DataTypes';


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


test('parse valid force data',async () => {
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