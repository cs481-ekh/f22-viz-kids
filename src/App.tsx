import * as React from "react";
import {useEffect, useState} from "react";
import { useFilePicker } from 'use-file-picker';

import {ForceFileData, MarkerFileData} from "./DataTypes";
import {parseForceFileData, parseMarkerFileData} from "./Parser";
import RenderView from "./RenderView";

import "./App.scss";


const emptyMarkerFileData: MarkerFileData = {
	markers: [],
	frames: []
};

const emptyForceFileData: ForceFileData = {
	frames: []
}


export default function App() {

	const [openMarkerFileSelector, {plainFiles: [markerFile], loading: markersLoading}] = useFilePicker({
		accept: ['.txt','.tsv','.csv','.mot']
	});

	const [openForceFileSelector, {plainFiles: [forceFile], loading: forcesLoading}] = useFilePicker({
		accept: ['.txt','.tsv','.csv','.mot']
	});

	// eslint-disable-next-line prefer-const
	let [markerFileData, setMarkerFileData] = useState<MarkerFileData>();
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

	// eslint-disable-next-line prefer-const
	let [forceFileData, setForceFileData] = useState<ForceFileData>();
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

	if (!markerFileData) {
		markerFileData = emptyMarkerFileData;
	}
	if (!forceFileData) {
		forceFileData = emptyForceFileData;
	}
	if (markersLoading || forcesLoading) {
		return <div style={{fontSize: 24}}>Loading file...</div>;
	}

	return <div id={"app-grid"}>
		<div id={"file-area-flex"}>
			<div id={"marker-file-div"}>
				<input type={"button"} id={"marker-file-button"} className={"file-upload-button"} value={"Choose Marker Data File"} onClick={()=>openMarkerFileSelector()} />
				<input type={"file"} id={"marker-file-upload"} hidden />
				<span id={"marker-file-name"}>Trial001_Markers.tsv</span>
			</div>
			<div id={"force-file-div"}>
				<input type={"button"} id={"force-file-button"} className={"file-upload-button"} value={"Choose Force Plate Data File"} onClick={()=>openForceFileSelector()} />
				<input type={"file"} id={"force-file-upload"} hidden />
				<span id={"force-file-name"}>Trial001_Forces.tsv</span>
			</div>
		</div>
		<div id={"logo"}>Movilo</div>
		<div id={"selection-info"}>Selection Info</div>
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
		<div id={"timeline-track-area"}>
			<input type={"button"} id={"play-button"} />
			<input type={"range"} id={"timeline"} min={"0"} max={"494"} value={"0"} />
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