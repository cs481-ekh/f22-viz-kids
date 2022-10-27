import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFilePicker } from 'use-file-picker';

import { ForceFileData, MarkerFileData } from "./DataTypes";
import { PlayIcon, PauseIcon } from "./icons";
import { parseForceFileData, parseMarkerFileData } from "./Parser";
import RenderView from "./RenderView";
import ErrorPopup from "./ErrorPopup";
import SelectionInfoView from "./SelectionInfoView";
import useStateRef from "./useStateRef";
import * as sdpLogo from "../assets/images/sdp-logo-3.png";

import "./App.scss";

const MILLI_PER = 1000;

export default function App() {
	const [frame, setFrame] = useState(0);
	const frameRef = useStateRef(frame);
	const [playing, setPlaying] = useState(false);
	const [frameStart, setStart] = useState(0);
	const [frameEnd, setEnd] = useState(0);

	const [loopCheck, setLoopCheck] = useState(true);

	const [sdpInfo, setSdpInfo] = useState(false); //to toggle displaying SDP info popup

	
	const [selectedMarkers, setSelectedMarkers] = useState<number[]>([]);

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

	useEffect(() => {
		const end = markerFileData.frames.length-1;
		if (end > 0) setEnd(end);

	}, [markerFileData]);

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
						} else if(loopCheck == false) { //if loop checkbox unchecked then don't loop
								setPlaying(loopCheck); //changed play to pause once reaches end if loop unchecked, for frame manipulation 
								return current; //returns last frame - 1, based on calculation in first if statement
						}
							else return frameStart; //loop if loop checkbox is checked
						
					});
				}
			}

			lastTimeRef.current = currentTime;
		}
		
		animationRef.current = requestAnimationFrame(animationLoop);
	}, [markerFileData, timeStep, frameEnd, frameStart, loopCheck]);

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
				<span id={"marker-file-name"} className={"file-chosen-name"}>{markerFile && !markerParsingError ? markerFile.name : "No file chosen"}</span>
			</div>
			<div id={"force-file-div"}>
				<input id={"force-file-button"} className={"file-upload-button"} type={"button"} value={"Choose Force Plate Data File"} onClick={()=>openForceFileSelector()} />
				<span id={"force-file-name"} className={"file-chosen-name"}>{forceFile && !forceParsingError ? forceFile.name : "No file chosen"}</span>
			</div>
		</div>
		<div id={"logo"}>Movilo</div>
		<div id={"output-area-title"}>Selection Info</div>
		{/* --------------------------------------------- Grid Row 2-3 --------------------------------------------- */}
		<div id={"viz-area"}>
			<RenderView
				frame={frame}
				markerData={markerFileData}
				forceData={forceFileData}
				selectedMarkers={selectedMarkers}
				updateSelectedMarkers={setSelectedMarkers}
			/>
		</div>
		<div id={"popup-area"}>
			<ErrorPopup error={error} />
			<div id={"sdp-info-popup"} style={sdpInfo ? {visibility: 'visible'} : {visibility: 'hidden'}}>
				{`This website was created for a Boise State University
				Computer Science Senior Design Project by
				
				Colin Reeder
				Connor Jackson
				Cory Tomlinson
				Javier Trejo
				William Kenny
				
				For information about sponsoring a project, go to
				`}
				<a href={"https://www.boisestate.edu/coen-cs/community/cs481-senior-design-project/"} target={'_blank'}>
					https://www.boisestate.edu/coen-cs/community/cs481-senior-design-project/
				</a>
			</div>
		</div>
		<div id={"output-area"}>
			<SelectionInfoView markerData={markerFileData} selectedMarkers={selectedMarkers} frame={frame} />
		</div>
		<img id={"sdp-logo"} src={sdpLogo} alt={"senior design project logo"} onClick={()=>setSdpInfo(!sdpInfo)} />
		{/* ---------------------------------------------- Grid Row 4 ---------------------------------------------- */}
		<div id={"timeline-track-area"}>
			<div id="timeline-track-main-area">
				<button id={"play-button"} onClick={togglePlaying}>
					{playing ? <PauseIcon /> : <PlayIcon />}
				</button>
				<input id={"timeline-track"} type={"range"} min={"0"} max={markerFileData.frames.length - 1}
					onChange={(e) => setFrame(parseInt(e.target.value))} value={frame} />
				<label><input type="checkbox" checked={loopCheck} onChange={(e) => {
					setLoopCheck(e.target.checked);
					/*if (!checked) {
						setPlaying(true); //sets from pause to play if you check loop box again
					}*/
					}
					}/>Loop</label>
			</div>
		</div>
		<div id={"timeline-manual-area"}>
			<table>
				<tr>
					<td><span className={"timeline-cell label"}>Frame</span></td>
					<td><input className={"timeline-cell"} type={"number"} value={frameStart} min={"0"} max={markerFileData.frames.length} onChange={(e) => {
							const inputInt = parseInt(e.target.value);
							if (inputInt < markerFileData.frames.length && inputInt >= 0)
							{
								setStart(inputInt)
							}
						}
						}/></td> 
					<td><input className={"timeline-cell"} type={"number"} value={frame} min={"0"} max={markerFileData.frames.length} onChange={(e) => {
							const inputInt = parseInt(e.target.value);
							if (inputInt < markerFileData.frames.length && inputInt >= 0) 
							{
								setFrame(inputInt);
							}
						}
						} /></td>
					<td><input className={"timeline-cell"} type={"number"} value={frameEnd} min={"0"} max={markerFileData.frames.length} onChange={(e) => {
							const inputInt = parseInt(e.target.value);
							if (inputInt < markerFileData.frames.length && inputInt >= 0) setEnd(inputInt); 
						}
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
