import * as THREE from "three";
import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

import { ForceFileData, MarkerFileData } from "./DataTypes";

/* Axis reference */                    /* THREE's relation to trial subject */
//THREE X == Vicon -X == OpenSim -Z     (+left/-right)
//THREE Y == Vicon Z  == OpenSim Y      (+up/-down)
//THREE Z == Vicon Y  == OpenSim X      (+front/-back)

const THREExAxis = new THREE.Vector3(1, 0, 0);
const THREEyAxis = new THREE.Vector3(0, 1, 0);
const THREEzAxis = new THREE.Vector3(0, 0, 1);

const MARKER_COLOR_DEFAULT = new THREE.Color("white");
const MARKER_COLOR_SELECTED = new THREE.Color("yellow");

const FORCE_VEC_SCALE_FACTOR = 0.0005;
const FORCE_VEC_HEAD_LENGTH = 0.05;
const FORCE_VEC_HEAD_WIDTH = 0.025;

interface Props {
	markerData: MarkerFileData;
	forceData: ForceFileData;
	frame: number;

	selectedMarkers: number[];
	updateSelectedMarkers(param: number[] | ((current: number[]) => number[])): void;
}

export default function RenderView(props: Props) {
	const [camera] = useState(() => {
		const cam = new THREE.PerspectiveCamera(70, 1); // aspect ratio will be updated later
		cam.position.x = -2.0;
		cam.position.y = 1.5;
		cam.position.z = 0.0;
		cam.rotateOnWorldAxis(THREExAxis, -Math.PI/8);
		cam.rotateOnWorldAxis(THREEyAxis, -Math.PI/2);
		cam.rotateOnWorldAxis(THREEzAxis, 0.0);
		return cam;
	});

	const [raycaster] = useState(() => new THREE.Raycaster());

	const [scene] = useState(() => {
		return new THREE.Scene();
	});

	const [groundGrid] = useState(() => {
		const totalWidthMeters = 30;
		const cellsAcross = 30;
		const centerLineColor = 0x220044; //dark indigo
		const gridLineColor = 0x222222; //dark gray
		return new THREE.GridHelper(totalWidthMeters,cellsAcross,centerLineColor,gridLineColor);
	});

	useEffect(() => {
		scene.add(groundGrid);
		return () => {scene.remove(groundGrid);};
	}, [scene, groundGrid]);

	const [aspectRatio, setAspectRatio] = useState(1); // will be updated by the size handler

	useEffect(() => {
		camera.aspect = aspectRatio;
		camera.updateProjectionMatrix();
	}, [aspectRatio, camera]);

	const [axisHelper] = useState(() => {
		const sizeMeters = 0.1;
		const helper = new THREE.AxesHelper(sizeMeters);
		const COBRxAxisColor = new THREE.Color('red');
		const COBRyAxisColor = new THREE.Color('green');
		const COBRzAxisColor = new THREE.Color('blue');
		helper.setColors(COBRxAxisColor,COBRzAxisColor,COBRyAxisColor); //swaps standard THREE y and z colors to emulate COBR coordinate system
		helper.scale.x *= -1; //invert x-axis to match COBR coordinate system
		return helper;
	});

	/* For axis helper positioning. camera.position.x|y|z changes are not detected in dependency array */
	const [camPosX,setCamPosX] = useState(camera.position.x);
	const [camPosY,setCamPosY] = useState(camera.position.y);
	const [camPosZ,setCamPosZ] = useState(camera.position.z);
	const [camRotX,setCamRotX] = useState(camera.rotation.x);
	const [camRotY,setCamRotY] = useState(camera.rotation.y);
	const [camRotZ,setCamRotZ] = useState(camera.rotation.z);

	/* Position axis helper relative to current camera position/rotation */
	useEffect(() => {
		const camDirVec = new THREE.Vector3();
		const camDirPerpVec = THREEyAxis.clone(); //will be reassigned by cross product of yAxis and camDirVec
		const dist = 2 / aspectRatio;
		camera.getWorldDirection(camDirVec);
		camDirPerpVec.cross(camDirVec).normalize(); //gets axis perpendicular to camera's current direction
		camDirVec.applyAxisAngle(camDirPerpVec,0.5); //put axis helper to the bottom of current camera view
		camDirVec.multiplyScalar(dist);
		camDirVec.add(camera.position);
		camDirVec.add(camDirPerpVec); //put axis helper to the left of current camera view
		axisHelper.position.set(camDirVec.x, camDirVec.y, camDirVec.z);
	}, [camPosX, camPosY, camPosZ, camRotX, camRotY, camRotZ, camera, axisHelper, aspectRatio]);

	useEffect(() => {
		scene.add(axisHelper);
		return () => {scene.remove(axisHelper);};
	}, [scene, axisHelper]);

	const pointsRep = useMemo(() => {
		return props.markerData.markers.map((_, index) => {
			const geometry = new THREE.SphereGeometry(0.01, 16, 16);
			const material = new THREE.MeshBasicMaterial();

			const mesh = new THREE.Mesh(geometry, material);
			mesh.userData.index = index;

			return mesh;
		});
	}, [props.markerData.markers]);

	useEffect(() => {
		pointsRep.forEach(pointRep => scene.add(pointRep));

		return () => pointsRep.forEach(pointRep => scene.remove(pointRep));
	}, [scene, pointsRep]);

	useEffect(() => {
		pointsRep.forEach((pointRep, idx) => {
			pointRep.material.color = props.selectedMarkers.includes(idx) ?
				MARKER_COLOR_SELECTED :
				MARKER_COLOR_DEFAULT;
		});
	}, [pointsRep, props.selectedMarkers]);

	useEffect(() => {
		const frameData = props.markerData.frames[props.frame];
		pointsRep.forEach((pointRep, idx) => {
			const pos = frameData.positions[idx];
			if(pos === null) return;

			pointRep.position.x = -pos.x; //Vicon x-axis is inverted with respect to THREE's
			pointRep.position.y = pos.z; //Vicon z-axis is THREE's y-axis
			pointRep.position.z = pos.y; //Vicon y-axis is THREE's z-axis
		});
	}, [pointsRep, props.markerData, props.frame]);

	/* Force vectors: init */
	const [forceVectors] = useState(() => {
		const vec1 = new THREE.ArrowHelper();
		const vec2 = new THREE.ArrowHelper();
		vec1.setColor(0xFF0000);
		vec2.setColor(0xFF0000);
		vec1.visible = false;
		vec2.visible = false;
		return [vec1, vec2];
	});

	/* Force vectors: position and rotate for the current frame */
	useEffect(() => {
		const frameData = props.forceData.frames[props.frame];
		if (!frameData) return; //animation doesn't depend on forceFileData, so this might be empty from initialization in App.tsx
		forceVectors.forEach((vec,idx) => {
			const pos = frameData.forces[idx]?.position;
			const comps = frameData.forces[idx]?.components;
			if (!pos||!comps) {
				vec.visible = false; //hide forces with no data
				return;
			}
			vec.position.x = -pos.z; //OpenSim's z-axis is THREE's -x-axis
			vec.position.y = pos.y; //y-axis is the same
			vec.position.z = pos.x; //OpenSim's x-axis is THREE's z-axis
			const magnitude = FORCE_VEC_SCALE_FACTOR * Math.sqrt((comps.x**2) + (comps.y**2) + (comps.z**2));
			vec.setLength(magnitude, FORCE_VEC_HEAD_LENGTH, FORCE_VEC_HEAD_WIDTH);
			vec.setDirection(new THREE.Vector3(-comps.z, comps.y, comps.x).normalize());
			vec.visible = true; //show forces with valid data
		})
	}, [forceVectors, props.forceData, props.frame]);

	/* Force vectors: add to scene */
	useEffect(() => {
		forceVectors.forEach(vec => scene.add(vec));
		return () => forceVectors.forEach(vec => scene.remove(vec));
	}, [scene, forceVectors]);

	const [renderer] = useState(() => {
		const result = new THREE.WebGLRenderer({antialias: true});
		return result;
	});

	const updateSize = useCallback(() => {
		const width = root.current!.offsetWidth;
		const height = root.current!.offsetHeight;
		renderer.setSize(width, height);
		setAspectRatio(width / height);
	}, [renderer]);

	useEffect(() => {
		window.addEventListener("resize", updateSize);
		updateSize();

		return () => window.removeEventListener("resize", updateSize);
	}, [updateSize]);

	const [cameraControls] = useState(() => new PointerLockControls(camera, renderer.domElement));

	/* Use camera controls */
	useEffect(() => {
		const moveMeters = 0.05;
		/* Only allow flight while mouse is in visualization area */
		const mouseEnterVizAreaHandler = () => document.addEventListener('keydown', keyPressHandler, false);
		const mouseLeaveVizAreaHandler = () => document.removeEventListener('keydown', keyPressHandler, false);
		/* Flight controls (keys) */
		const keyPressHandler = (e: KeyboardEvent) => {
			switch (e.code) {
				/* Fly left */
				case "KeyA": //for right-handed mouse use
				case "Digit4": //for left-handed mouse use
				case "Numpad4":
				case "Left": //IE/Edge specific value
				case "ArrowLeft": cameraControls.moveRight(-moveMeters); break; //ambi/intuitive control
				/* Fly right */
				case "KeyD": //for right-handed mouse use
				case "Digit6": //for left-handed mouse use
				case "Numpad6":
				case "Right": //IE/Edge specific value
				case "ArrowRight": cameraControls.moveRight(moveMeters); break; //ambi/intuitive control
				/* Fly forward */
				case "KeyW": //for right-handed mouse use
				case "Digit8": //for left-handed mouse use
				case "Numpad8":
				case "Up": //IE/Edge specific value
				case "ArrowUp": cameraControls.moveForward(moveMeters); break; //ambi/intuitive control
				/* Fly backward */
				case "KeyS": //for right-handed mouse use
				case "Digit5": //for left-handed mouse use
				case "Numpad5":
				case "Down": //IE/Edge specific value
				case "ArrowDown": cameraControls.moveForward(-moveMeters); break; //ambi/intuitive control
				/* Fly down */
				case "KeyQ": //for right-handed mouse use
				case "Digit7": //for left-handed mouse use
				case "Numpad7":
				case "PageDown": camera.position.y -= moveMeters; break; //ambi/intuitive control
				/* Fly up */
				case "KeyE": //for right-handed mouse use
				case "Digit9": //for left-handed mouse use
				case "Numpad9":
				case "PageUp": camera.position.y += moveMeters; break; //ambi/intuitive control
			}
			setCamPosX(camera.position.x);
			setCamPosY(camera.position.y);
			setCamPosZ(camera.position.z);
		};
		/* Flight controls (mouse) */
		const mouseWheelHandler = (e: WheelEvent) => {
			const scaleFactor = 4;
			if (e.deltaY > 0)
				cameraControls.moveForward(-moveMeters * scaleFactor);
			else
				cameraControls.moveForward(moveMeters * scaleFactor);
			setCamPosX(camera.position.x);
			setCamPosY(camera.position.y);
			setCamPosZ(camera.position.z);
		}
		/* Look controls */
		const mouseDownHandler = (e: MouseEvent) => { //capture mouse movement (to rotate view) while holding middle click
			if (e.button===1) {
				cameraControls.lock();
				document.addEventListener('mousemove', mouseMoveHandler, false);
			}
		};
		const mouseMoveHandler = () => {
			setCamRotX(camera.rotation.x);
			setCamRotY(camera.rotation.y);
			setCamRotZ(camera.rotation.z);
		};
		const mouseUpHandler = (e: MouseEvent) => { //release mouse after middle click is over
			if (e.button===1) {
				document.removeEventListener('mousemove', mouseMoveHandler, false);
				cameraControls.unlock();
				setCamRotX(camera.rotation.x);
				setCamRotY(camera.rotation.y);
				setCamRotZ(camera.rotation.z);
			}
		};
		/* Add listeners */
		renderer.domElement.addEventListener('mouseenter', mouseEnterVizAreaHandler, false);
		renderer.domElement.addEventListener('mouseleave', mouseLeaveVizAreaHandler, false);
		renderer.domElement.addEventListener('wheel', mouseWheelHandler, false);
		renderer.domElement.addEventListener('mousedown', mouseDownHandler, false);
		renderer.domElement.addEventListener('mouseup', mouseUpHandler, false);
		/* Clean up old listeners if re-rendering */
		return () => {
			document.removeEventListener('keydown', keyPressHandler, false);
			renderer.domElement.removeEventListener('mouseenter', mouseEnterVizAreaHandler, false);
			renderer.domElement.removeEventListener('mouseleave', mouseLeaveVizAreaHandler, false);
			renderer.domElement.removeEventListener('wheel', mouseWheelHandler, false);
			renderer.domElement.removeEventListener('mousedown', mouseDownHandler, false);
			renderer.domElement.removeEventListener('mouseup', mouseUpHandler, false);
			document.removeEventListener('mousemove', mouseMoveHandler, false);
		};
	}, [cameraControls,camera,renderer]);

	const animationLoop = useCallback(() => {
		renderer.render(scene, camera);
	}, [renderer, scene, camera]);

	const root = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		renderer.setAnimationLoop(animationLoop);
		root.current!.appendChild(renderer.domElement);
	}, [renderer, animationLoop]);

	useEffect(() => {
		return () => {
			renderer.dispose();
		};
	}, [renderer]);

	const onClick = useCallback((evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		// raycaster requires coordinates to be transformed like this
		// (in range -1 to 1, and y is reversed)
		const coords = {
			x: ((evt.clientX - evt.currentTarget.offsetLeft) / evt.currentTarget.offsetWidth) * 2 - 1,
			y: -(((evt.clientY - evt.currentTarget.offsetTop) / evt.currentTarget.offsetHeight) * 2 - 1),
		};
		raycaster.setFromCamera(coords, camera);
		const hitList = raycaster.intersectObjects(pointsRep, true);
		if(hitList.length === 0) {
			props.updateSelectedMarkers.call(undefined, []);
		}
		else {
			const hit = hitList[0].object.userData.index as number;
			if(evt.shiftKey || evt.ctrlKey) {
				// multiselect - add or remove from selection
				props.updateSelectedMarkers.call(undefined, current => {
					if(current.includes(hit)) return current.filter(x => x !== hit); // already selected, deselect
					return [...current, hit];
				});
			}
			else {
				props.updateSelectedMarkers.call(undefined, [hit]);
			}
		}
	}, [camera, raycaster, props.updateSelectedMarkers, pointsRep]);

	return <div ref={root} onClick={onClick} />;
}
