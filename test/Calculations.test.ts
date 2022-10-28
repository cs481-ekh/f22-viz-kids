import {computeAngle} from "../src/modules/Calculations";
import {Point3D} from '../src/dataTypes';


test('valid angle (frame 0 left hip-knee-ankle angle)', () => {
    const LKJC: Point3D  = {x:0.10328, y:-1.47403, z:0.48009}; //left knee joint center
    const LASIS: Point3D = {x:0.07062, y:-1.31965, z:0.92865}; //left anterior-superior-iliac-spine (front edge of hip)
    const LAJC: Point3D  = {x:0.12071, y:-1.59442, z:0.12018}; //left ankle joint center
    const theta = computeAngle([LKJC,LASIS,LAJC]);
    const expected = 178.600363111; //calculated using https://onlinemschool.com/math/assistance/vector/angl/
    const digitsPrecision = 9;
    expect(theta).toBeCloseTo(expected,digitsPrecision);
});

test('valid angle (frame 1 left hip-knee-ankle angle)', () => {
    const LKJC: Point3D  = {x:0.10354, y:-1.47152, z:0.47972}; //left knee joint center
    const LASIS: Point3D = {x:0.07093, y:-1.31522, z:0.92775}; //left anterior-superior-iliac-spine (front edge of hip)
    const LAJC: Point3D  = {x:0.12087, y:-1.59378, z:0.12033}; //left ankle joint center
    const theta = computeAngle([LKJC,LASIS,LAJC]);
    const expected = 178.60980551429304; //calculated using https://onlinemschool.com/math/assistance/vector/angl/
    const digitsPrecision = 9;
    expect(theta).toBeCloseTo(expected,digitsPrecision);
});

test('valid angle (frame 494 left hip-knee-ankle angle)', () => {
    const LKJC: Point3D  = {x:0.15612, y:0.73287, z:0.51114}; //left knee joint center
    const LASIS: Point3D = {x:0.12944, y:0.72296, z:0.96163}; //left anterior-superior-iliac-spine (front edge of hip)
    const LAJC: Point3D  = {x:0.17297, y:0.70129, z:0.13796}; //left ankle joint center
    const theta = computeAngle([LKJC,LASIS,LAJC]);
    const expected = 173.8570748635188; //calculated using https://onlinemschool.com/math/assistance/vector/angl/
    const digitsPrecision = 9;
    expect(theta).toBeCloseTo(expected,digitsPrecision);
});



test('valid angle (frame 0 right hip-knee-ankle angle)', () => {
    const RKJC: Point3D  = {x:0.24749, y:-1.23828, z:0.52749}; //Right knee joint center
    const RASIS: Point3D = {x:0.29669, y:-1.33687, z:0.93532}; //Right anterior-superior-iliac-spine (front edge of hip)
    const RAJC: Point3D  = {x:0.26532, y:-1.19635, z:0.13973}; //Right ankle joint center
    const theta = computeAngle([RKJC,RASIS,RAJC]);
    const expected = 168.10734690179902; //calculated using https://onlinemschool.com/math/assistance/vector/angl/
    const digitsPrecision = 9;
    expect(theta).toBeCloseTo(expected,digitsPrecision);
});

test('valid angle (frame 1 right hip-knee-ankle angle)', () => {
    const RKJC: Point3D  = {x:0.24812, y:-1.23409, z:0.52646}; //Right knee joint center
    const RASIS: Point3D = {x:0.29697, y:-1.33212, z:0.93449}; //Right anterior-superior-iliac-spine (front edge of hip)
    const RAJC: Point3D  = {x:0.26594, y:-1.18703, z:0.13959}; //Right ankle joint center
    const theta = computeAngle([RKJC,RASIS,RAJC]);
    const expected =168.65204332562732; //calculated using https://onlinemschool.com/math/assistance/vector/angl/
    const digitsPrecision = 9;
    expect(theta).toBeCloseTo(expected,digitsPrecision);
});

test('valid angle (frame 494 right hip-knee-ankle angle)', () => {
    const RKJC: Point3D  = {x:0.29999, y:0.70808, z:0.50836}; //Right knee joint center
    const RASIS: Point3D = {x:0.35362, y:0.69912, z:0.95498}; //Right anterior-superior-iliac-spine (front edge of hip)
    const RAJC: Point3D  = {x:0.31261, y:0.4275,  z:0.23976}; //Right ankle joint center
    const theta = computeAngle([RKJC,RASIS,RAJC]);
    const expected = 131.90041068945374; //calculated using https://onlinemschool.com/math/assistance/vector/angl/
    const digitsPrecision = 9;
    expect(theta).toBeCloseTo(expected,digitsPrecision);
});



test('valid angle (frame 0 left shoulder-elbow-hand angle)', () => {
    const LMEB: Point3D  = {x:-0.02519, y:-1.40287, z:1.02347}; //left elbow
    const LSHO: Point3D  = {x:0.00984,  y:-1.3699,  z:1.33941}; //left shoulder
    const LHAND: Point3D = {x:-0.09351, y:-1.1928,  z:0.87744}; //left hand
    const theta = computeAngle([LMEB,LSHO,LHAND]);
    const expected = 119.44691263275874; //calculated using https://onlinemschool.com/math/assistance/vector/angl/
    const digitsPrecision = 9;
    expect(theta).toBeCloseTo(expected,digitsPrecision);
});

test('valid angle (frame 1 left shoulder-elbow-hand angle)', () => {
    const LMEB: Point3D  = {x:-0.02484, y:-1.39762, z:1.02257}; //left elbow
    const LSHO: Point3D  = {x:0.01038,  y:-1.36522, z:1.33846}; //left Shoulder
    const LHAND: Point3D = {x:-0.09352, y:-1.18697, z:0.87771}; //left hand
    const theta = computeAngle([LMEB,LSHO,LHAND]);
    const expected = 119.27199541696437; //calculated using https://onlinemschool.com/math/assistance/vector/angl/
    const digitsPrecision = 9;
    expect(theta).toBeCloseTo(expected,digitsPrecision);
});

test('valid angle (frame 494 left shoulder-elbow-hand angle)', () => {
    const LMEB: Point3D  = {x:0.05491,  y:0.52679, z:1.05451}; //left Elbow
    const LSHO: Point3D  = {x:0.0614,   y:0.62164, z:1.35794}; //left Shoulder
    const LHAND: Point3D = {x:-0.00987, y:0.65488, z:0.83173}; //left hand
    const theta = computeAngle([LMEB,LSHO,LHAND]);
    const expected = 131.52795596572224; //calculated using https://onlinemschool.com/math/assistance/vector/angl/
    const digitsPrecision = 9;
    expect(theta).toBeCloseTo(expected,digitsPrecision);
});



test('valid angle (frame 0 right shoulder-elbow-hand angle)', () => {
    const RMEB: Point3D  = {x:0.31224, y:-1.5443,  z:1.07604}; //right Elbow
    const RSHO: Point3D  = {x:0.34511, y:-1.39145, z:1.33606}; //right Shoulder
    const RHAND: Point3D = {x:0.37097, y:-1.5462,  z:0.81724}; //right Hand
    const theta = computeAngle([RMEB,RSHO,RHAND]);
    const expected = 144.62393601668833; //calculated using https://onlinemschool.com/math/assistance/vector/angl/
    const digitsPrecision = 9;
    expect(theta).toBeCloseTo(expected,digitsPrecision);
});

test('valid angle (frame 1 right shoulder-elbow-hand angle)', () => {
    const RMEB: Point3D  = {x:0.31251, y:-1.53961, z:1.07533}; //right Elbow
    const RSHO: Point3D  = {x:0.34569, y:-1.3866,  z:1.33511}; //right Shoulder
    const RHAND: Point3D = {x:0.37128, y:-1.54186, z:0.81649}; //right Hand
    const theta = computeAngle([RMEB,RSHO,RHAND]);
    const expected = 144.61143274389914; //calculated using https://onlinemschool.com/math/assistance/vector/angl/
    const digitsPrecision = 9;
    expect(theta).toBeCloseTo(expected,digitsPrecision);
});

test('valid angle (frame 494 right shoulder-elbow-hand angle)', () => {
    const RMEB: Point3D  = {x:0.37997, y:0.51703, z:1.066}; //right Elbow
    const RSHO: Point3D  = {x:0.39966, y:0.60185, z:1.35986}; //right Shoulder
    const RHAND: Point3D = {x:0.47702, y:0.59593, z:0.83514}; //right Hand
    const theta = computeAngle([RMEB,RSHO,RHAND]);
    const expected = 137.401167962484; //calculated using https://onlinemschool.com/math/assistance/vector/angl/
    const digitsPrecision = 9;
    expect(theta).toBeCloseTo(expected,digitsPrecision);
});
