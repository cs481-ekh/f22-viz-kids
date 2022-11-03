import * as fs from 'fs';
import * as path from 'path';

import {computeAngle, computeSuggestedGaitEvents} from "../src/Calculations";
import {parseMarkerFileData} from "../src/Parser";
import {Point3D} from '../src/DataTypes';


test('valid angle (frame 0 left hip-knee-ankle angle)', () => {
    const LKJC: Point3D  = {x:0.10328, y:-1.47403, z:0.48009}; //left knee joint center
    const LASIS: Point3D = {x:0.07062, y:-1.31965, z:0.92865}; //left anterior-superior-iliac-spine (front edge of hip)
    const LAJC: Point3D  = {x:0.12071, y:-1.59442, z:0.12018}; //left ankle joint center
    const theta = computeAngle([LKJC,LASIS,LAJC]);
    const expected = 178.600363111; //calculated using https://onlinemschool.com/math/assistance/vector/angl/
    const digitsPrecision = 9;
    expect(theta).toBeCloseTo(expected,digitsPrecision);
});

test("suggested gait events for valid file", async () => {
    const fileContent: Buffer = fs.readFileSync(path.resolve(__dirname,"./fixtures/Trial001_Markers.tsv"));
    const file: File = new File([fileContent],"Trial001_Markers.tsv",{type: "text/tab-separated-values"});
    const data = await parseMarkerFileData(file);
	expect(computeSuggestedGaitEvents(data)).toEqual([39, 173, 303, 448]);
});
