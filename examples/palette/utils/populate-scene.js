const { Worker } = require('node:worker_threads');


const flipUv = (attribute) => {
	if (!attribute) {
		return;
	}
	for (let i = 1; i < attribute.array.length; i += 2) {
		attribute.array[i] = 1 - attribute.array[i];
	}
};


const populateScene = (scene, cb) => {
	global.Worker = class Worker2 extends Worker {
		constructor(name, options) {
			const nameStr = name.toString();
			if (nameStr.startsWith('data:')) {
				const [, body] = nameStr.toString().split(',');
				super(unescape(body), { ...options, eval: true });
				return;
			}
			
			super(name, options);
		}
	};
	
	(async () => {
		const THREE = await import('three');
		const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
		const { DRACOLoader } = await import('./DRACOLoader.mjs');
		
		const directionalLight1 = new THREE.DirectionalLight(0xffffff, 5);
		directionalLight1.position.set(0.5, 0.5, 0.5).normalize();
		directionalLight1.castShadow = true;
		scene.add(directionalLight1);
		
		const directionalLight2 = new THREE.DirectionalLight(0xffffff, 3);
		directionalLight2.position.set(-0.5, 0.5, 0.5).normalize();
		scene.add(directionalLight2);
		
		const directionalLight3 = new THREE.DirectionalLight(0xffffff, 2);
		directionalLight3.position.set(0, -0.5, -0.5).normalize();
		scene.add(directionalLight3);
		
		scene.background = new THREE.Color(0xbfe3dd);
		
		const dracoLoader = new DRACOLoader();
		dracoLoader.setDecoderPath(`${__dirname}/../../../node_modules/three/examples/jsm/libs/draco/gltf/`);
		
		const loader = new GLTFLoader();
		loader.setDRACOLoader(dracoLoader);
		loader.load(__dirname + '/../models/LittlestTokyo.glb', (gltf) => {
			gltf.scene.scale.set(0.01, 0.01, 0.01);
			
			gltf.scene.traverse((node) => {
				if (!node.isMesh) {
					return;
				}
				flipUv(node.geometry.attributes.uv);
				flipUv(node.geometry.attributes.uv1);
			});
			
			scene.add(gltf.scene);
			cb(gltf.scene);
		});
	})();
};

module.exports = { populateScene };
