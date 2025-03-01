import * as THREE from 'three';

import node3d from '../index.js';
const { init, addThreeHelpers } = node3d;

const { gl, loop, Screen } = init({
	isGles3: true, vsync: true, autoEsc: true, autoFullscreen: true, title: 'Crate',
});
addThreeHelpers(THREE, gl);
const screen = new Screen({ three: THREE, fov: 70, z: 2 });

const texture = new THREE.TextureLoader().load('three/textures/crate.gif');
texture.colorSpace = THREE.SRGBColorSpace;
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ map: texture });
const mesh = new THREE.Mesh(geometry, material);
screen.scene.add(mesh);

loop((now) => {
	mesh.rotation.x = now * 0.0005;
	mesh.rotation.y = now * 0.001;
	screen.draw();
});
