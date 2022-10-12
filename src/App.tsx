import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFilePicker } from 'use-file-picker';

import { ForceFileData, MarkerFileData } from "./DataTypes";
import { PlayIcon, PauseIcon } from "./icons";
import { parseForceFileData, parseMarkerFileData } from "./Parser";
import RenderView from "./RenderView";
import ErrorPopup from "./ErrorPopup";
import useStateRef from "./useStateRef";

import "./App.scss";

const MILLI_PER = 1000;

export default function App() {
	const [frame, setFrame] = useState(0);
	const frameRef = useStateRef(frame);

	const [playing, setPlaying] = useState(false);
	const [frameStart, setStart] = useState(0);
	
	
 	

	/* Flags for clearing file name if parsing error is encountered */
	const [markerParsingError, setMarkerParsingError] = useState<boolean>(false);
	const [forceParsingError, setForceParsingError] = useState<boolean>(false);
	const [error, setError] = useState<Error|null>(null);

	/* Load and parse provided marker file into markerFileData */
	const [openMarkerFileSelector, {plainFiles: [markerFile], loading: markersLoading}] = useFilePicker({accept: ['.txt','.tsv','.csv']});
	const [markerFileData, setMarkerFileData] = useState<MarkerFileData>({markers: [], frames: []});
	useEffect(()=>{
		let staleRequest = false; //only async parse call from current render should set markerFileData
		if (markerFile) startAsyncMarkerParse();
		return () => {staleRequest = true;}; //clean-up function if new render is triggered while this is still processing
		async function startAsyncMarkerParse() {
			let data: MarkerFileData = {markers: [], frames: []}; //empty data to clear viz area for invalid files
			try {
				data = await parseMarkerFileData(markerFile);
				if (!staleRequest) {
					setError(null);
					setMarkerParsingError(false);
				}
			}
			catch (err) {
				if (!staleRequest) {
					if (err instanceof Error) setError(err);
					setMarkerParsingError(true);
				}
			}
			if (staleRequest) return; //ignore stale data if newer render is triggered and clean-up function was called
			else setMarkerFileData(data);
		}
	}, [markerFile]);

	const [frameEnd, setEnd] = useState(markerFileData.frames.length);

	const timeStep = useMemo(() => {
		if(markerFileData.frames.length < 2) return null;
		return markerFileData.frames[1].time * MILLI_PER;
	}, [markerFileData]);

	/* Load and parse provided force plate file into forceFileData */
	const [openForceFileSelector, {plainFiles: [forceFile], loading: forcesLoading}] = useFilePicker({accept: ['.txt','.tsv','.csv','.mot']});
	const [forceFileData, setForceFileData] = useState<ForceFileData>({frames: []});
	useEffect(()=>{
		let staleRequest = false; //only async parse call from current render should set forceFileData
		if (forceFile) startAsyncForceParse();
		return () => {staleRequest = true;}; //clean-up function if new render is triggered while this is still processing
		async function startAsyncForceParse() {
			let data: ForceFileData = {frames: []}; //empty data to clear viz area for invalid files
			try {
				data = await parseForceFileData(forceFile);
				if (!staleRequest) {
					setError(null);
					setForceParsingError(false);
				}
			}
			catch (err) {
				if (!staleRequest) {
					if (err instanceof Error) setError(err);
					setForceParsingError(true);
				}
			}
			if (staleRequest) return; //ignore stale data if newer render is triggered and clean-up function was called
			else setForceFileData(data);
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
						} else return 0;
						//setPlaying(false);
						//return current;
					});
				}
			}

			lastTimeRef.current = currentTime;
		}

		animationRef.current = requestAnimationFrame(animationLoop);
	}, [markerFileData, timeStep, frameEnd]);

	useEffect(() => {
		if(playing) {
			animationRef.current = requestAnimationFrame(animationLoop);
			return () => cancelAnimationFrame(animationRef.current!);
		}
	}, [animationLoop, playing]);

	const togglePlaying = useCallback(() => {
		setPlaying(current => {
			if(current) return false;

			if(frameRef.current >= markerFileData.frames.length - 1) setFrame(0); // restart if at end
			return true;
		});
	}, [markerFileData.frames.length, frameRef]);

	

	/* Elements/components in the grid are organized top->bottom, left->right */
	return <div id={"app-grid"} style={(markersLoading||forcesLoading) ? {cursor: "progress"} : {cursor: "default"}}>
		{/* ---------------------------------------------- Grid Row 1 ---------------------------------------------- */}
		<div id={"file-area-flex"}>
			<div id={"marker-file-div"}>
				<input id={"marker-file-button"} className={"file-upload-button"} type={"button"} value={"Choose Marker Data File"} onClick={()=>openMarkerFileSelector()} />
				<span id={"marker-file-name"} className={"file-chosen-name"}>{markerFile && !markerParsingError ? markerFile.name : "No file chosen"}</span>
			</div>
			<div id={"force-file-div"}>
				<input id={"force-file-button"} className={"file-upload-button"} type={"button"} value={"Choose Force Plate Data File"} onClick={()=>openForceFileSelector()} />
				<span id={"force-file-name"} className={"file-chosen-name"}>{forceFile && !forceParsingError ? forceFile.name : "No file chosen"}</span>
			</div>
		</div>
		<div id={"logo"}>Movilo</div>
		<div id={"output-area-title"}>Selection Info</div>
		{/* ---------------------------------------------- Grid Row 2 ---------------------------------------------- */}
		<div id={"viz-area"}><RenderView frame={frame} data={markerFileData} /></div>
		<div id={"popup-area"}><ErrorPopup error={error} /></div>
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
							{const inputInt = parseInt(e.target.value);
							if (inputInt < markerFileData.frames.length && inputInt >= 0)
							{setStart(inputInt)}}
						}/></td> 
					<td><input className={"timeline-cell"} type={"number"} value={frame} min={"0"} onChange={(e) => 
							{const inputInt = parseInt(e.target.value);
							if (inputInt < markerFileData.frames.length && inputInt >= 0) 
							{setFrame(parseInt(e.target.value)); togglePlaying;}}
						} /></td>
					<td><input className={"timeline-cell"} type={"number"} value={frameEnd} onChange={(e) => 
						{const inputInt = parseInt(e.target.value);
						if (inputInt >= 0) setEnd(parseInt(e.target.value)); }
						} /></td>
					
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
