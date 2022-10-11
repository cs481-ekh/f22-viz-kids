import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFilePicker } from 'use-file-picker';

import { ForceFileData, MarkerFileData } from "./DataTypes";
import { PlayIcon, PauseIcon } from "./icons";
import { parseForceFileData, parseMarkerFileData } from "./Parser";
import RenderView from "./RenderView";
import useStateRef from "./useStateRef";

import "./App.scss";

const MILLI_PER = 1000;

export default function App() {
	const [frameStart, setStart] = useState(0);
	const [frame, setFrame] = useState(0);
	const frameRef = useStateRef(frame);

	const [playing, setPlaying] = useState(false);
	
	const [frameEnd, setEnd] = useState(493);
	
 	

	/* Load and parse provided marker file into markerFileData */
	const [openMarkerFileSelector, {plainFiles: [markerFile], loading: markersLoading}] = useFilePicker({accept: ['.txt','.tsv','.csv']});
	const [markerFileData, setMarkerFileData] = useState<MarkerFileData>({markers: [], frames: []});
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

	const timeStep = useMemo(() => {
		if(markerFileData.frames.length < 2) return null;
		return markerFileData.frames[1].time * MILLI_PER;
	}, [markerFileData]);

	/* Load and parse provided force plate file into forceFileData */
	const [openForceFileSelector, {plainFiles: [forceFile], loading: forcesLoading}] = useFilePicker({accept: ['.txt','.tsv','.csv','.mot']});
	const [forceFileData, setForceFileData] = useState<ForceFileData>({frames: []});
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

	const interFrameTimeRef = useRef(0);
	const lastTimeRef = useRef<null | DOMHighResTimeStamp>(null);

	useEffect(() => {
		if(playing) lastTimeRef.current = null; // skip time while paused
	}, [playing]);

	const animationRef = useRef<number>();
	const animationLoop = useCallback(() => {
		if(timeStep !== null) {
			const currentTime = performance.now();
			if(lastTimeRef.current !== null) {
				const elapsedTime = currentTime - lastTimeRef.current;

				interFrameTimeRef.current += elapsedTime;
				while(interFrameTimeRef.current > timeStep) {
					interFrameTimeRef.current -= timeStep;
					setFrame(current => {
						if(current + 1 < markerFileData.frames.length && current + 1 < frameEnd) {return current + 1;
						} else return frameStart;
						//setPlaying(false);
						//return current;
					});
				}
			}

			lastTimeRef.current = currentTime;
		}

		animationRef.current = requestAnimationFrame(animationLoop);
	}, [markerFileData, timeStep, frameEnd, frameStart]);

	useEffect(() => {
		if(playing) {
			animationRef.current = requestAnimationFrame(animationLoop);
			return () => cancelAnimationFrame(animationRef.current!);
		}
	}, [animationLoop, playing]);

	const togglePlaying = useCallback(() => {
		setPlaying(current => {
			if(current) return false;

			if(frameRef.current >= markerFileData.frames.length - 1) setFrame(frameStart); // restart if at end
			return true;
		});
	}, [markerFileData.frames.length, frameRef, frameStart]);

	

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
		<div id={"viz-area"}><RenderView frame={frame} data={markerFileData} /></div>
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
			<div id="timeline-track-main-area">
				<button id={"play-button"} onClick={togglePlaying}>
					{playing ? <PauseIcon /> : <PlayIcon />}
				</button>
				<input id={"timeline-track"} type={"range"} min={"0"} max={"494"} value={"0"} />
			</div>
		</div>
		<div id={"timeline-manual-area"}>
			<table>
				<tr>
					<td><span className={"timeline-cell label"}>Frame</span></td>
					<td><input className={"timeline-cell"} type={"number"} value={frameStart} min={"0"} onChange={(e) => 
						{if (parseInt(e.target.value) < markerFileData.frames.length && parseInt(e.target.value) >= 0) 
						{setStart(parseInt(e.target.value));}}} /></td>
					<td><input className={"timeline-cell"} type={"number"} value={frame} min={"0"} onChange={(e) => 
						{if (parseInt(e.target.value) < markerFileData.frames.length && parseInt(e.target.value) >= 0) 
						{setFrame(parseInt(e.target.value));}}} /></td>
					<td><input className={"timeline-cell"} type={"number"} value={frameEnd} min={"0"} max={"493"} onChange={(e) => 
						{if (parseInt(e.target.value) >= 0) setEnd(parseInt(e.target.value)); }} /></td>
					
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
