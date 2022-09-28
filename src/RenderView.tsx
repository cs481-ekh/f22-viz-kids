import * as THREE from "three";
import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { MarkerFileData } from "./DataTypes";

interface Props {
	data: MarkerFileData;
	frame: number;
}

export default function RenderView(props: Props) {
	const width = 400;
	const height = 400;

	const [camera] = useState(() => {
		const result = new THREE.PerspectiveCamera(70, width / height);
		result.position.z = 1.5;
		result.position.y = .5;
		result.rotation.x = -(Math.PI / 4);
		return result;
	});

	const [scene] = useState(() => {
		return new THREE.Scene();
	});

	const pointsRep = useMemo(() => {
		return props.data.markers.map(() => {
			const geometry = new THREE.SphereGeometry(0.01, 16, 16);
			const material = new THREE.MeshBasicMaterial();

			const mesh = new THREE.Mesh(geometry, material);

			return mesh;
		});
	}, [props.data.markers]);

	useEffect(() => {
		pointsRep.forEach(pointRep => scene.add(pointRep));

		return () => pointsRep.forEach(pointRep => scene.remove(pointRep));
	}, [scene, pointsRep]);

	useEffect(() => {
		const frameData = props.data.frames[props.frame];
		pointsRep.forEach((pointRep, idx) => {
			const pos = frameData.positions[idx];
			if(pos === null) return;

			pointRep.position.x = pos.x;
			pointRep.position.y = pos.y;
			pointRep.position.z = pos.z;
		});
	}, [pointsRep, props.data, props.frame]);


	const [renderer] = useState(() => {
		const result = new THREE.WebGLRenderer({antialias: true});
		result.setSize(width, height);
		return result;
	});

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

	return <div ref={root} />;
}