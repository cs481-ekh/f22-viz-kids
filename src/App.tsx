import * as React from "react";
import { useEffect, useState } from "react";
import { useFilePicker } from 'use-file-picker';

import { ForceFileData, MarkerFileData } from "./DataTypes";
import { parseForceFileData, parseMarkerFileData } from "./Parser";
import RenderView from "./RenderView";

import "./App.scss";


export default function App() {

	/* Load and parse provided marker file into markerFileData */
	const [openMarkerFileSelector, {plainFiles: [markerFile], loading: markersLoading}] = useFilePicker({accept: ['.txt','.tsv','.csv']});
	const [markerFileData = {markers: [], frames: []}, setMarkerFileData] = useState<MarkerFileData>();
	useEffect(()=>{
		let active = true;
		startAsyncMarkerParse();
		return () => {active = false;};
		async function startAsyncMarkerParse() {
			const data = await parseMarkerFileData(markerFile);
			if (!active) return;
			setMarkerFileData(data);
		}
	}, [markerFile]);

	/* Load and parse provided force plate file into forceFileData */
	const [openForceFileSelector, {plainFiles: [forceFile], loading: forcesLoading}] = useFilePicker({accept: ['.txt','.tsv','.csv','.mot']});
	const [forceFileData = {frames: []}, setForceFileData] = useState<ForceFileData>();
	useEffect(()=>{
		let active = true;
		startAsyncForceParse();
		return () => {active = false;};
		async function startAsyncForceParse() {
			const data = await parseForceFileData(forceFile);
			if (!active) return;
			setForceFileData(data);
		}
	}, [forceFile]);

	/* Elements/components in the grid are organized top->bottom, left->right */
	return <div id={"app-grid"} style={(markersLoading||forcesLoading) ? {cursor: "progress"} : {cursor: "default"}}>
		{/* ---------------------------------------------- Grid Row 1 ---------------------------------------------- */}
		<div id={"file-area-flex"}>
			<div id={"marker-file-div"}>
				<input id={"marker-file-button"} className={"file-upload-button"} type={"button"} value={"Choose Marker Data File"} onClick={()=>openMarkerFileSelector()} />
				<span id={"marker-file-name"} className={"file-chosen-name"}>{markerFile ? markerFile.name : "No file chosen"}</span>
			</div>
			<div id={"force-file-div"}>
				<input id={"force-file-button"} className={"file-upload-button"} type={"button"} value={"Choose Force Plate Data File"} onClick={()=>openForceFileSelector()} />
				<span id={"force-file-name"} className={"file-chosen-name"}>{forceFile ? forceFile.name : "No file chosen"}</span>
			</div>
		</div>
		<div id={"logo"}>Movilo</div>
		<div id={"output-area-title"}>Selection Info</div>
		{/* ---------------------------------------------- Grid Row 2 ---------------------------------------------- */}
		<div id={"viz-area"}><RenderView frame={0} data={markerFileData} /></div>
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
		{/* ---------------------------------------------- Grid Row 3 ---------------------------------------------- */}
		<div id={"timeline-track-area"}>
			<input id={"play-button"} type={"button"} />
			<input id={"timeline-track"} type={"range"} min={"0"} max={"494"} value={"0"} />
		</div>
		<div id={"timeline-manual-area"}>
			<table>
				<tr>
					<td><span className={"timeline-cell label"}>Frame</span></td>
					<td><input className={"timeline-cell"} type={"text"} value={"0"} /></td>
					<td><input className={"timeline-cell"} type={"text"} value={"0"} /></td>
					<td><input className={"timeline-cell"} type={"text"} value={"494"} /></td>
				</tr>
				<tr>
					<td><span className={"timeline-cell label"}>Time</span></td>
					<td><input className={"timeline-cell"} type={"text"} value={"0.0"} disabled /></td>
					<td><input className={"timeline-cell"} type={"text"} value={"0.0"} disabled /></td>
					<td><input className={"timeline-cell"} type={"text"} value={"2.05417"} disabled /></td>
				</tr>
				<tr>
					<td><span className={"timeline-cell label"}></span></td>
					<td><span className={"timeline-cell label"}>Start</span></td>
					<td><span className={"timeline-cell label"}>Current</span></td>
					<td><span className={"timeline-cell label"}>End</span></td>
				</tr>
			</table>
		</div>
	</div>;
}
