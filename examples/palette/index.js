
const { read } = require('addon-tools-raub');
const glfw = require('glfw-raub');
const Image = require('image-raub');

const { init, addThreeHelpers } = require('../../index');
const { generatePalette } = require('./utils/palette');
const { debugShaders } = require('./utils/debug-shaders');
const { createPostMaterial } = require('./utils/create-post-material');
const { createColorQuads } = require('./utils/create-color-quads');
const { createRenderTarget } = require('./utils/create-render-target');
const { populateScene } = require('./utils/populate-scene');

const hueModes = [
	'monochromatic', 'analagous', 'complementary', 'triadic', 'tetradic',
];

const { extraCodes } = glfw;

const {
	doc, requestAnimationFrame, gl,
} = init({
	isGles3: true,
	isWebGL2: true,
	autoEsc: true,
	autoFullscreen: true,
});

const icon = new Image(__dirname + '/textures/icon.png');
icon.on('load', () => { doc.icon = icon; });
doc.title = 'Palette Swap';
doc.getRootNode = () => doc;

(async () => {
	const THREE = await import('three');
	const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');
	
	addThreeHelpers(THREE, gl);
	
	const fragmentShader = await read(`${__dirname}/post.glsl`);
	
	const cameraOrtho = new THREE.OrthographicCamera(
		-doc.w / 2, doc.w / 2, doc.h / 2, -doc.h / 2, - 10, 10,
	);
	cameraOrtho.position.z = 5;
	
	const cameraPerspective = new THREE.PerspectiveCamera(50, doc.w / doc.h, 1, 1000);
	const controls = new OrbitControls(cameraPerspective, doc);
	
	cameraPerspective.position.z = 9;
	controls.update();
	
	const scene = new THREE.Scene();
	let mesh;
	populateScene(scene, (m) => { mesh = m; });
	
	const scenePost = new THREE.Scene();
	
	let isSwap = false;
	let modeGrayscale = 0;
	let modeHue = 0;
	let numColors = 9;
	
	const rawPalette0 = generatePalette(hueModes[modeHue], numColors);
	let palette = rawPalette0.map((c) => (new THREE.Color(...c)));
	
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
			map: new THREE.TextureLoader().load( __dirname + '/textures/help.png' ),
		}),
	);
	quadHelp.position.set(doc.w / 2 - 128, -doc.h / 2 + 128, 1);
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
	
	const renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(doc.devicePixelRatio);
	renderer.setSize(doc.w, doc.h);
	debugShaders(renderer, false);
	
	doc.on('resize', () => {
		cameraPerspective.aspect = doc.w / doc.h;
		cameraPerspective.updateProjectionMatrix();
		controls.update();
		
		cameraOrtho.left = -doc.w / 2;
		cameraOrtho.right = doc.w / 2;
		cameraOrtho.top = doc.h / 2;
		cameraOrtho.bottom = -doc.h / 2;
		cameraOrtho.updateProjectionMatrix();
		
		quadHelp.position.set(doc.w / 2 - 128, -doc.h / 2 + 128, 1);
		
		renderer.setSize(doc.w, doc.h);
		if (rt) {
			rt.dispose();
			rt = null;
		}
		rt = createRenderTarget(THREE, materialPost, doc.w, doc.h);
	});
	
	const render = () => {
		const rtOld = renderer.getRenderTarget();
		renderer.setRenderTarget(rt);
		renderer.render(scene, cameraPerspective);
		renderer.setRenderTarget(rtOld);
		
		renderer.render(scenePost, cameraOrtho);
	};
	
	const animate = () => {
		requestAnimationFrame(animate);
		
		controls.update();
		
		if (mesh) {
			mesh.rotation.y = Date.now() * 0.00005;
		}
		
		render();
	};
	
	animate();
})();
