import * as React from "react";

import { MarkerFileData } from "./DataTypes";
import RenderView from "./RenderView";

const TMP_DATA: MarkerFileData = {
	markers: [
		{
			label: "LACR" //first label
		},
		{
			label: "LLSK" //middle label with empty X Y Z R fields
		},
		{
			label: "RILCR" //last label
		}
	],
	frames: [
		{
			time: 0.00417,
			positions: [
				{ //LACR
					x: 0.04408,
					y: -1.36457,
					z: 1.35774
				},
				null, // LLSK
				{ //RILCR
					x: 0.32163,
					y: -1.3931,
					z: 0.99752
				}
			],
		}
	],
};

export default function App() {
	return <div>
		<h1>Hello, world!</h1>
		<RenderView frame={0} data={TMP_DATA} />
	</div>;
}
