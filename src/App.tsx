import * as React from "react";
import "./App.scss";

import { MarkerFileData } from "./DataTypes";
import RenderView from "./RenderView";


const TMP_DATA: MarkerFileData = {
	markers: [
		{label: "LACR"},
		{label: "LASIS"},
		{label: "LBHD"},
		{label: "LDSK"},
		{label: "LFHD"},
		{label: "LFRM"},
		{label: "LGTR"},
		{label: "LHAND"},
		{label: "LHEEL"},
		{label: "LLEB"},
		{label: "LLEP"},
		{label: "LLMAL"},
		{label: "LLSK"},
		{label: "LLWRT"},
		{label: "LMEB"},
		{label: "LMEP"},
		{label: "LMET5"},
		{label: "LMMAL"},
		{label: "LMWRT"},
		{label: "LPSIS"},
		{label: "LPSK"},
		{label: "LSHO"},
		{label: "LTHI"},
		{label: "LTOE"},
		{label: "RACR"},
		{label: "RASIS"},
		{label: "RBHD"},
		{label: "RDSK"},
		{label: "RFHD"},
		{label: "RFRM"},
		{label: "RGTR"},
		{label: "RHAND"},
		{label: "RHEEL"},
		{label: "RLEB"},
		{label: "RLEP"},
		{label: "RLMAL"},
		{label: "RLSK"},
		{label: "RLWRT"},
		{label: "RMEB"},
		{label: "RMEP"},
		{label: "RMET5"},
		{label: "RMMAL"},
		{label: "RMWRT"},
		{label: "RPSIS"},
		{label: "RPSK"},
		{label: "RSHO"},
		{label: "RTHI"},
		{label: "RTOE"},
		{label: "MID_ASIS"},
		{label: "MID_PSIS"},
		{label: "MID_PELVIS"},
		{label: "MID_HJC"},
		{label: "F_LHIP"},
		{label: "F_RHIP"},
		{label: "LKJC"},
		{label: "RKJC"},
		{label: "LAJC"},
		{label: "RAJC"},
		{label: "LILCR"},
		{label: "RILCR"}
	],
	frames: [{
		time: 0,
		positions: [
			{x:0.04353,y:-1.36928,z:1.35853}, //LACR
			{x:0.07062,y:-1.31965,z:0.92865}, //LASIS
			{x:0.11218,y:-1.39712,z:1.46634}, //LBHD
			{x:0.11939,y:-1.53618,z:0.15535}, //LDSK
			{x:0.15364,y:-1.23728,z:1.52652}, //LFHD
			{x:-0.10165,y:-1.33665,z:0.98007}, //LFRM
			{x:0.00654,y:-1.41742,z:0.86365}, //LGTR
			{x:-0.09351,y:-1.1928,z:0.87744}, //LHAND
			{x:0.1197,y:-1.66992,z:0.08193}, //LHEEL
			{x:-0.08973,y:-1.37968,z:1.06905}, //LLEB
			{x:0.03623,y:-1.45927,z:0.47253}, //LLEP
			{x:0.0802,y:-1.59887,z:0.11966}, //LLMAL
			null, //LLSK
			{x:-0.05328,y:-1.21449,z:0.90552}, //LLWRT
			{x:-0.02519,y:-1.40287,z:1.02347}, //LMEB
			{x:0.17038,y:-1.48873,z:0.48763}, //LMEP
			{x:0.05576,y:-1.48871,z:0.06339}, //LMET5
			{x:0.16121,y:-1.58996,z:0.12075}, //LMMAL
			{x:-0.10082,y:-1.25611,z:0.87592}, //LMWRT
			{x:0.12387,y:-1.51729,z:0.97625}, //LPSIS
			{x:0.10275,y:-1.45189,z:0.39685}, //LPSK
			{x:0.00984,y:-1.3699,z:1.33941}, //LSHO
			{x:0.10283,y:-1.38769,z:0.52008}, //LTHI
			{x:0.13967,y:-1.46387,z:0.07161}, //LTOE
			{x:0.31772,y:-1.39449,z:1.35375}, //RACR
			{x:0.29669,y:-1.33687,z:0.93532}, //RASIS
			{x:0.24782,y:-1.40287,z:1.46882}, //RBHD
			{x:0.26767,y:-1.15861,z:0.18464}, //RDSK
			{x:0.25179,y:-1.25599,z:1.51819}, //RFHD
			{x:0.39862,y:-1.5503,z:1.02816}, //RFRM
			{x:0.35192,y:-1.41916,z:0.88948}, //RGTR
			{x:0.37097,y:-1.5462,z:0.81724}, //RHAND
			{x:0.26037,y:-1.25957,z:0.09143}, //RHAND
			{x:0.39871,y:-1.52195,z:1.08245}, //RLEB
			{x:0.30985,y:-1.22572,z:0.53689}, //RLEP
			{x:0.30526,y:-1.20265,z:0.1366}, //RLMAL
			{x:0.33554,y:-1.24457,z:0.44998}, //RLSK
			{x:0.33743,y:-1.51679,z:0.8648}, //RLWRT
			{x:0.31224,y:-1.5443,z:1.07604}, //RMEB
			{x:0.18511,y:-1.25068,z:0.5181}, //RMEP
			{x:0.32224,y:-1.08309,z:0.10656}, //RMET5
			{x:0.22541,y:-1.19056,z:0.14281}, //RMMAL
			{x:0.36672,y:-1.58104,z:0.86785}, //RMWRT
			{x:0.2276,y:-1.52105,z:0.97346}, //RPSIS
			{x:0.25508,y:-1.18851,z:0.45855}, //RPSK
			{x:0.34511,y:-1.39145,z:1.33606}, //RSHO
			{x:0.24608,y:-1.19763,z:0.58725}, //RTHI
			{x:0.24079,y:-1.07483,z:0.11637}, //RTOE
			{x:0.18364,y:-1.32828,z:0.932}, //MID_ASIS
			{x:0.17574,y:-1.51919,z:0.97486}, //MID_PSIS
			{x:0.17969,y:-1.42373,z:0.95343}, //MID_PELVIS
			{x:0.18231,y:-1.41888,z:0.87897}, //MID_HJC
			{x:0.08159,y:-1.41098,z:0.86891}, //F_LHIP
			{x:0.28303,y:-1.42678,z:0.88902}, //F_RHIP
			{x:0.10328,y:-1.47403,z:0.48009}, //LKJC
			{x:0.24749,y:-1.23828,z:0.52749}, //RKJC
			{x:0.12071,y:-1.59442,z:0.12018}, //LAJC
			{x:0.26532,y:-1.19635,z:0.13973}, //RAJC
			{x:0.02931,y:-1.39297,z:0.99902}, //LILCR
			{x:0.32123,y:-1.3977,z:0.99837} //RILCR
		]
	}]
};


export default function App() {
	return <div id={"app-grid"}>
		<div id={"file-area-flex"}>
			<div id={"marker-file-div"}>
				<input type={"button"} id={"marker-file-button"} className={"file-upload-button"} value={"Choose Marker Data File"} />
				<input type={"file"} id={"marker-file-upload"} hidden />
				<span id={"marker-file-name"}>Trial001_Markers.tsv</span>
			</div>
			<div id={"force-file-div"}>
				<input type={"button"} id={"force-file-button"} className={"file-upload-button"} value={"Choose Force Plate Data File"} />
				<input type={"file"} id={"force-file-upload"} hidden />
				<span id={"force-file-name"}>Trial001_Forces.tsv</span>
			</div>
		</div>
		<div id={"logo"}>Movilo</div>
		<div id={"selection-info"}>Selection Info</div>
		<div id={"viz-area"}><RenderView frame={0} data={TMP_DATA} /></div>
		<div id={"output-area"}>
			{`Label: LASIS
			x: 0.07062
			y: -1.31965
			z: 0.92865

			Label: LKJC
			x: 0.10328
			y: -1.47403
			z: 0.48009

			Label: LAJC
			x: 0.12071
			y: -1.59442
			z: 0.12018

			LKJC Angle: 178.6°`}
		</div>
		<div id={"timeline-track-area"}>
			<input type={"button"} id={"play-button"} />
			<input type={"range"} id={"timeline"} min={"0"} max={"494"} />
		</div>
		<div id={"timeline-manual-area"}>
			<table>
				<tr>
					<td><span className={"timeline-cell"}>Frame</span></td>
					<td><input type={"text"} className={"timeline-cell"} value={"0"} /></td>
					<td><input type={"text"} className={"timeline-cell"} value={"0"} /></td>
					<td><input type={"text"} className={"timeline-cell"} value={"494"} /></td>
				</tr>
				<tr>
					<td><span className={"timeline-cell"}>Time</span></td>
					<td><input type={"text"} className={"timeline-cell"} value={"0.0"} disabled /></td>
					<td><input type={"text"} className={"timeline-cell"} value={"0.0"} disabled /></td>
					<td><input type={"text"} className={"timeline-cell"} value={"2.05417"} disabled /></td>
				</tr>
				<tr>
					<td><span className={"timeline-cell"}></span></td>
					<td><span className={"timeline-cell"}>Start</span></td>
					<td><span className={"timeline-cell"}>Current</span></td>
					<td><span className={"timeline-cell"}>End</span></td>
				</tr>
			</table>
		</div>
	</div>;
}
