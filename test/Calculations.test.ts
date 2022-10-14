import {computeAngle} from "../src/Calculations";
import {Point3D} from '../src/DataTypes';


test('valid angle (frame 0 left hip-knee-ankle angle)', () => {
    const LKJC: Point3D  = {x:0.10328, y:-1.47403, z:0.48009}; //left knee joint center
    const LASIS: Point3D = {x:0.07062, y:-1.31965, z:0.92865}; //left anterior-superior-iliac-spine (front edge of hip)
    const LAJC: Point3D  = {x:0.12071, y:-1.59442, z:0.12018}; //left ankle joint center
    expect(computeAngle([LKJC,LASIS,LAJC])).toEqual(178.6); //calculated using https://onlinemschool.com/math/assistance/vector/angl/
});