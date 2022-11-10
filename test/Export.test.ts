import { MarkerFileData } from "../src/dataTypes";

import { getAngleExportContent } from "../src/modules/Export";

test("single frame", () => {
	const data: MarkerFileData = {
		markers: [
			{label: "LKJC"},
			{label: "LASIS"},
			{label: "LAJC"},
		],
		frames: [
			{
				time: 0,
				positions: [
					{x:0.10354, y:-1.47152, z:0.47972},
					{x:0.07093, y:-1.31522, z:0.92775},
					{x:0.12087, y:-1.59378, z:0.12033},
				]
			}
		],
	};

	const result = getAngleExportContent(data, 0, 0, [0, 1, 2]);

	expect(result).toBe("Frame\tTime\tAngle: LKJC, LASIS, LAJC\n0\t0\t178.60980551429304");
});
