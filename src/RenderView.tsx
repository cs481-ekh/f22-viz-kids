import * as THREE from "three";
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

export default function RenderView() {
	const width = 400;
	const height = 400;

	const [camera] = useState(() => {
		const result = new THREE.PerspectiveCamera(70, width / height);
		result.position.z = .5;
		result.position.y = .5;
		result.rotation.x = -(Math.PI / 4);
		return result;
	});

	const [scene] = useState(() => {
		const result = new THREE.Scene();

		const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
		const material = new THREE.MeshNormalMaterial();

		const mesh = new THREE.Mesh(geometry, material);
		result.add(mesh);

		return result;
	});

	const [renderer] = useState(() => {
		const result = new THREE.WebGLRenderer({antialias: true});
		result.setSize(width, height);
		return result;
	});

	const animationLoop = useCallback(() => {
		renderer.render(scene, camera);
	}, [renderer, scene, camera]);

	const root = useRef();

	useEffect(() => {
		renderer.setAnimationLoop(animationLoop);
		root.current.appendChild(renderer.domElement);
	}, [renderer, animationLoop]);

	useEffect(() => {
		return () => {
			renderer.dispose();
		};
	}, [renderer]);

	return <div ref={root} />;
}
