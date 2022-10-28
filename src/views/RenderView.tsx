import * as THREE from "three";
import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { ForceFileData, MarkerFileData } from "../dataTypes";

/* Axis reference */                    /* THREE's relation to trial subject */
//THREE X == Vicon -X == OpenSim -Z     (+left/-right)
//THREE Y == Vicon Z  == OpenSim Y      (+up/-down)
//THREE Z == Vicon Y  == OpenSim X      (+front/-back)

const THREE_X_AXIS = new THREE.Vector3(1,0,0);
const THREE_Y_AXIS = new THREE.Vector3(0,1,0);
const THREE_Z_AXIS = new THREE.Vector3(0,0,1);

const MARKER_COLOR_DEFAULT = new THREE.Color("white");
const MARKER_COLOR_SELECTED = new THREE.Color(0x00FF00);

const FORCE_VEC_SCALE_FACTOR = 0.0005;
const FORCE_VEC_HEAD_LENGTH = 0.05;
const FORCE_VEC_HEAD_WIDTH = 0.025;

interface Props {
    frame: number;
    markerData: MarkerFileData;
    forceData: ForceFileData;
    selectedMarkers: number[];
    setSelectedMarkers( replacementList: number[] | ((currentList: number[]) => number[]) ): void;
}

export default function RenderView(
    {
        frame, markerData, forceData, selectedMarkers, setSelectedMarkers
    }: Props
) {
    const root = useRef<HTMLDivElement|null>(null);

    const [renderer] = useState(() => new THREE.WebGLRenderer({antialias: true}));

    const [aspectRatio, setAspectRatio] = useState(1); //updated by the size handler

    const updateRenderSizeAndAspectRatio = useCallback(() => {
        const width = root.current!.offsetWidth;
        const height = root.current!.offsetHeight;
        renderer.setSize(width, height);
        setAspectRatio(width / height);
    }, [renderer]);

    const [scene] = useState(() => {
        const scn = new THREE.Scene();
        scn.background = new THREE.Color(0x040900);
        return scn
    });

    const [camera] = useState(() => {
        const cam = new THREE.PerspectiveCamera(70, 1); //aspect ratio will be updated later
        cam.position.x = -4.0;
        cam.position.y = 1.5;
        cam.position.z = 0.0;
        cam.rotateOnWorldAxis(THREE_X_AXIS, -Math.PI/8);
        cam.rotateOnWorldAxis(THREE_Y_AXIS, -Math.PI/2);
        cam.rotateOnWorldAxis(THREE_Z_AXIS, 0.0);
        return cam;
    });

    const [cameraControls] = useState(() => new PointerLockControls(camera, renderer.domElement));

    /* For axis helper positioning. camera.position.x|y|z changes are not detected in dependency array */
    const [camPosX, setCamPosX] = useState(camera.position.x);
    const [camPosY, setCamPosY] = useState(camera.position.y);
    const [camPosZ, setCamPosZ] = useState(camera.position.z);
    const [camRotX, setCamRotX] = useState(camera.rotation.x);
    const [camRotY, setCamRotY] = useState(camera.rotation.y);
    const [camRotZ, setCamRotZ] = useState(camera.rotation.z);

    const [groundGrid] = useState(() => {
        const totalWidthMeters = 30;
        const cellsAcross = 30;
        const centerLineColor = 0x220044;
        const gridLineColor = 0x222222;
        return new THREE.GridHelper(totalWidthMeters, cellsAcross, centerLineColor, gridLineColor);
    });

    const [axisHelper] = useState(() => {
        const sizeMeters = 0.1;
        const helper = new THREE.AxesHelper(sizeMeters);
        const ViconXAxisColor = new THREE.Color('red');
        const ViconYAxisColor = new THREE.Color('green');
        const ViconZAxisColor = new THREE.Color('blue');
        helper.setColors(ViconXAxisColor, ViconZAxisColor, ViconYAxisColor); //swaps standard THREE y and z colors to emulate Vicon coordinate system
        helper.scale.x *= -1; //invert x-axis to match Vicon coordinate system
        return helper;
    });

    /* An array of un-positioned marker meshes (mapped from the array of marker labels) */
    const markerMeshes = useMemo(() => {
        return markerData.markers.map((_,idx) => {
            const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.01,16,16), new THREE.MeshBasicMaterial());
            mesh.visible = false;
            mesh.userData.index = idx; //make all meshes independently aware of their index within markerMeshes array (for raycast id)
            return mesh;
        });
    }, [markerData.markers]);

    /* An array of two un-positioned force vectors */
    const [forceVectors] = useState(() => {
        const vec1 = new THREE.ArrowHelper();
        const vec2 = new THREE.ArrowHelper();
        vec1.setColor(0xFF0000);
        vec2.setColor(0xFF0000);
        vec1.visible = false;
        vec2.visible = false;
        return [vec1, vec2];
    });

    const [raycaster] = useState(() => new THREE.Raycaster());

    const handleRaycast = useCallback(({
        clientX, clientY, ctrlKey, shiftKey, currentTarget: {offsetLeft, offsetTop, offsetWidth, offsetHeight}
    }: React.MouseEvent<HTMLDivElement,MouseEvent>) => {
        /* Determine type of selection */
        const multiSelect = ctrlKey || shiftKey;
        /* Raycaster requires coordinates to be transformed to range [-1,1], with positive y toward top of page (inverted from CSS) */
        const percentRight = (clientX-offsetLeft)/offsetWidth;
        const percentDown = (clientY-offsetTop)/offsetHeight;
        const percentUp = 1-percentDown;
        const coords = {
            x: 2*percentRight - 1,
            y: 2*percentUp - 1,
        };
        /* Perform raycast */
        raycaster.setFromCamera(coords, camera);
        const hitList = raycaster.intersectObjects(markerMeshes, true);
        const hit: number|undefined = hitList[0]?.object.userData.index; //get idx of the closest mesh to the camera, if present
        /* Update selected markers list with result  */
        setSelectedMarkers.call(undefined, currentList =>
            hit||hit===0?
                multiSelect?
                    currentList.includes(hit)?
                        currentList.filter(keep=>keep!==hit)
                        :[...currentList,hit]
                    :[hit]
                :multiSelect?
                    currentList
                    :[]
        );
    }, [raycaster, markerMeshes, setSelectedMarkers, camera]);

    // ------------------------------------------------- side effects --------------------------------------------------

    /* Set render size to div dimensions */
    useEffect(() => {
        window.addEventListener("resize", updateRenderSizeAndAspectRatio);
        updateRenderSizeAndAspectRatio();
        return () => window.removeEventListener("resize", updateRenderSizeAndAspectRatio);
    }, [updateRenderSizeAndAspectRatio]);

    /* Update camera aspect ratio according to render size */
    useEffect(() => {
        camera.aspect = aspectRatio;
        camera.updateProjectionMatrix();
    }, [aspectRatio, camera]);

    /* Color marker meshes according to selection status */
    useEffect(() => {
        markerMeshes.forEach((mesh,idx) => {
            mesh.material.color = selectedMarkers.includes(idx) ? MARKER_COLOR_SELECTED : MARKER_COLOR_DEFAULT;
        });
    }, [markerMeshes, selectedMarkers]);

    /* Position marker meshes for the current frame */
    useEffect(() => {
        const frameData = markerData.frames[frame];
        markerMeshes.forEach((mesh,idx) => {
            const pos = frameData.positions[idx];
            if (pos===null) {
                mesh.visible = false; //hide markers with invalid data
                return;
            }
            mesh.position.x = -pos.x; //Vicon x-axis is inverted with respect to THREE's
            mesh.position.y = pos.z; //Vicon z-axis is THREE's y-axis
            mesh.position.z = pos.y; //Vicon y-axis is THREE's z-axis
            mesh.visible = true; //show markers with valid data
        });
    }, [markerMeshes, markerData, frame]);

    /* Position and rotate force vectors for the current frame */
    useEffect(() => {
        const frameData = forceData.frames[frame];
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
    }, [forceVectors, forceData, frame]);

    /* Position axis helper relative to current camera position/rotation */
    useEffect(() => {
        const camDirVec = new THREE.Vector3();
        const camDirPerpVec = THREE_Y_AXIS.clone(); //will be reassigned by cross product of yAxis and camDirVec
        const dist = 2/aspectRatio;
        camera.getWorldDirection(camDirVec);
        camDirPerpVec.cross(camDirVec).normalize(); //gets axis perpendicular to camera's current direction
        camDirVec.applyAxisAngle(camDirPerpVec, Math.PI/6); //put axis helper to the bottom of current camera view
        camDirVec.multiplyScalar(dist);
        camDirVec.add(camera.position);
        camDirVec.add(camDirPerpVec); //put axis helper to the left of current camera view
        axisHelper.position.set(camDirVec.x, camDirVec.y, camDirVec.z);
    }, [camPosX, camPosY, camPosZ, camRotX, camRotY, camRotZ, camera, axisHelper, aspectRatio]);

    /* Add marker meshes to scene */
    useEffect(() => {
        markerMeshes.forEach(mesh => scene.add(mesh));
        return () => markerMeshes.forEach(mesh => scene.remove(mesh)); //function for clearing the scene
    }, [scene, markerMeshes]);

    /* Add force vectors to scene */
    useEffect(() => {
        forceVectors.forEach(mesh => scene.add(mesh));
        return () => forceVectors.forEach(mesh => scene.remove(mesh)); //function for clearing the scene
    }, [scene, forceVectors]);

    /* Add ground grid to scene */
    useEffect(() => {
        scene.add(groundGrid);
        return () => {scene.remove(groundGrid);}; //function for clearing the scene
    }, [scene, groundGrid]);

    /* Add axis helper to scene */
    useEffect(() => {
        scene.add(axisHelper);
        return () => {scene.remove(axisHelper);}; //function for clearing the scene
    }, [scene, axisHelper]);

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
            e.preventDefault(); //don't scroll page wile mouse is in viz area
            if (e.deltaY > 0)
                cameraControls.moveForward(-moveMeters * scaleFactor);
            else
                cameraControls.moveForward(moveMeters * scaleFactor);
            setCamPosX(camera.position.x);
            setCamPosY(camera.position.y);
            setCamPosZ(camera.position.z);
        };
        /* Look controls */
        const mouseDownHandler = (e: MouseEvent) => { //capture mouse movement (to rotate view) while holding middle click
            if (e.button===1) {
                cameraControls.lock();
                document.addEventListener('mousemove', mouseMoveHandler, false);
            }
        };
        const mouseMoveHandler = () => { //rotate view while holding middle click
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
    }, [cameraControls, camera, renderer]);

    /* Only re-render the scene when its visual arrangement changes
     * (new frame, file, camera orientation, selections, or aspect ratio) */
    useEffect(() => {
        requestAnimationFrame(() => renderer.render(scene, camera));
    }, [frame, markerData, forceData, selectedMarkers, renderer, scene,
        camPosX, camPosY, camPosZ, camRotX, camRotY, camRotZ, camera, aspectRatio]);

    /* Add the rendering to the DOM element we will return */
    useEffect(() => {root.current!.appendChild(renderer.domElement)}, [renderer]);

    /* Free GPU resources when renderer is no longer needed */
    useEffect(() => () => renderer.dispose(), [renderer]);

    return <div id={"render-view"} ref={root} onClick={handleRaycast} />;
}
