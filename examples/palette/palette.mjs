import { readFileSync } from 'node:fs';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import glfw from 'glfw-raub';
import Image from 'image-raub';

import node3d from '../../index.js';
const { init, addThreeHelpers } = node3d;
import { generatePalette } from './utils/palette.js';
import { debugShaders } from './utils/debug-shaders.js';
import { createPostMaterial } from './utils/create-post-material.js';
import { createColorQuads } from './utils/create-color-quads.js';
import { createRenderTarget } from './utils/create-render-target.js';
import { populateScene } from './utils/populate-scene.js';


const IS_PERF_MODE = true;

const hueModes = [
	'monochromatic', 'analagous', 'complementary', 'triadic', 'tetradic',
];

const { extraCodes } = glfw;

const {
	doc, gl, Screen, loop,
} = init({
	isGles3: true,
	isWebGL2: true,
	autoEsc: true,
	autoFullscreen: true,
	title: 'Palette Swap',
	vsync: !IS_PERF_MODE,
});
addThreeHelpers(THREE, gl);

const icon = new Image('textures/icon.png');
icon.on('load', () => { doc.icon = icon; });

const cameraPerspective = new THREE.PerspectiveCamera(50, doc.w / doc.h, 1, 1000);
cameraPerspective.position.z = 9;
const screen = new Screen({ three: THREE, camera: cameraPerspective });

const cameraOrtho = new THREE.OrthographicCamera(
	-doc.w * 0.5, doc.w * 0.5, doc.h * 0.5, -doc.h * 0.5, - 10, 10,
);
cameraOrtho.position.z = 5;

const controls = new OrbitControls(cameraPerspective, doc);
controls.update();

let mesh;
populateScene(screen.scene, (m) => { mesh = m; });

const scenePost = new THREE.Scene();

let isSwap = false;
let modeGrayscale = 0;
let modeHue = 0;
let numColors = 9;

const rawPalette0 = generatePalette(hueModes[modeHue], numColors);
let palette = rawPalette0.map((c) => (new THREE.Color(...c)));

const fragmentShader = readFileSync('post.glsl').toString();
let materialPost = createPostMaterial(THREE, numColors, isSwap, modeGrayscale, palette, fragmentShader);

let rt = createRenderTarget(THREE, materialPost, doc.w, doc.h);

let quadPost = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), materialPost);
scenePost.add(quadPost);

const quadHelp = new THREE.Mesh(
	new THREE.PlaneGeometry(256, 256),
	new THREE.MeshBasicMaterial({
		side: THREE.CullFaceFront,
		depthTest: false,
		depthWrite: false,
		transparent: true,
		map: new THREE.TextureLoader().load('textures/help.png'),
	}),
);
quadHelp.position.set(doc.w * 0.5 - 128, -doc.h * 0.5 + 128, 1);
scenePost.add(quadHelp);

let colorQuads = createColorQuads(THREE, scenePost, palette, isSwap);

const setPalette = (newValue) => {
	palette = newValue;
	materialPost.uniforms.colors.value = palette;
	if (palette.length !== colorQuads.length) {
		if (colorQuads) {
			colorQuads.forEach((q) => scenePost.remove(q));
		}
		colorQuads = createColorQuads(THREE, scenePost, palette, isSwap);
	} else {
		palette.forEach((color, i) => {
			colorQuads[i].material.uniforms.color.value = color;
		});
	}
};

const setModeGrayscale = (newValue) => {
	if (isSwap && !newValue) {
		newValue = 1;
	}
	modeGrayscale = newValue;
	materialPost.uniforms.modeGrayscale.value = modeGrayscale;
};

const setIsSwap = (newValue) => {
	if (isSwap && !modeGrayscale) {
		setModeGrayscale(1);
	}
	isSwap = newValue;
	materialPost.uniforms.isSwap.value = isSwap;
	palette.forEach((color, i) => {
		colorQuads[i].visible = isSwap;
	});
};

const randomizePalette = () => {
	const rawPalette = generatePalette(hueModes[modeHue], numColors);
	const colorPalette = rawPalette.map((c) => (new THREE.Color(...c)));
	setPalette(colorPalette);
};

const setModeHue = (newValue) => {
	modeHue = newValue;
	randomizePalette();
};

const setNumColors = (newValue) => {
	if (numColors === newValue) {
		return;
	}
	numColors = newValue;
	
	const rawPalette = generatePalette(hueModes[modeHue], numColors);
	const colorPalette = rawPalette.map((c) => (new THREE.Color(...c)));
	materialPost = createPostMaterial(
		THREE, numColors, isSwap, modeGrayscale, colorPalette, fragmentShader,
	);
	materialPost.uniforms.t.value = rt.texture;
	
	scenePost.remove(quadPost);
	quadPost = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), materialPost);
	scenePost.add(quadPost);
	
	randomizePalette();
};

doc.on('keydown', (e) => {
	if (e.keyCode === glfw.KEY_P) {
		randomizePalette();
		return;
	}
	if (e.keyCode === glfw.KEY_M) {
		setModeHue((modeHue + 1) % hueModes.length);
		return;
	}
	if (e.keyCode === glfw.KEY_S) {
		setIsSwap(!isSwap);
		return;
	}
	if (e.keyCode === glfw.KEY_G) {
		setModeGrayscale((modeGrayscale + 1) % 4);
		return;
	}
	if (e.keyCode === extraCodes[glfw.KEY_EQUAL]) {
		setNumColors(Math.min(16, numColors + 1));
		return;
	}
	if (e.keyCode === extraCodes[glfw.KEY_MINUS]) {
		setNumColors(Math.max(2, numColors - 1));
		return;
	}
	if (e.keyCode === glfw.KEY_H || e.keyCode === extraCodes[glfw.KEY_F1]) {
		quadHelp.visible = !quadHelp.visible;
		return;
	}
});

debugShaders(screen.renderer, false);

doc.on('resize', () => {
	cameraOrtho.left = -doc.w * 0.5;
	cameraOrtho.right = doc.w * 0.5;
	cameraOrtho.top = doc.h * 0.5;
	cameraOrtho.bottom = -doc.h * 0.5;
	cameraOrtho.updateProjectionMatrix();
	
	quadHelp.position.set(doc.w * 0.5 - 128, -doc.h * 0.5 + 128, 1);
	
	if (rt) {
		rt.dispose();
		rt = null;
	}
	rt = createRenderTarget(THREE, materialPost, doc.w, doc.h);
});

const render = () => {
	const rtOld = screen.renderer.getRenderTarget();
	screen.renderer.setRenderTarget(rt);
	screen.draw();
	screen.renderer.setRenderTarget(rtOld);
	
	screen.renderer.render(scenePost, cameraOrtho);
};

let prevTime = Date.now();
let frames = 0;

loop(() => {
	controls.update();
	
	if (mesh) {
		mesh.rotation.y = Date.now() * 0.00005;
	}
	
	render();
	
	if (!IS_PERF_MODE) {
		return;
	}
	
	frames++;
	const time = Date.now();
	if (time >= prevTime + 2000) {
		console.log(
			'FPS:', Math.floor((frames * 1000) / (time - prevTime)),
		);
		prevTime = time;
		frames = 0;
	}
});
