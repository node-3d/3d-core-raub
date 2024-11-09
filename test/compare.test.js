'use strict';

const assert = require('node:assert').strict;
const { describe, it } = require('node:test');
const three = require('three');

const { screenshot } = require('./screenshot');
const { window, document } = require('./init');


const loadBox = () => {
	return new Promise((res) => {
		let mesh = null;
		const texture = new three.TextureLoader().load(
			__dirname + '/../examples/three/textures/crate.gif',
			() => res(mesh),
		);
		texture.colorSpace = three.SRGBColorSpace;
		const geometry = new three.BoxGeometry();
		const material = new three.MeshBasicMaterial({ map: texture });
		mesh = new three.Mesh(geometry, material);
		mesh.rotation.x = Math.PI / 7;
		mesh.rotation.y = Math.PI / 5;
	});
};

describe('Screenshots', () => {
	it('matches box screenshot', async () => {
		const camera = new three.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
		camera.position.z = 2;
		const scene = new three.Scene();
		
		const mesh = await loadBox();
		scene.add(mesh);
		
		const renderer = new three.WebGLRenderer();
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);
		
		renderer.render(scene, camera);
		
		assert.ok(await screenshot('box'));
	});
});
