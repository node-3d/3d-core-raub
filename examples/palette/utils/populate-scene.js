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
		
		const ambientLight = new THREE.AmbientLight(0xeeffee, 0.3);
		scene.add(ambientLight);
		
		const directionalLight1 = new THREE.DirectionalLight(0xeeeeff, 2.4);
		directionalLight1.position.set(20, 20, 20);
		scene.add(directionalLight1);
		
		const d = 10;
		directionalLight1.castShadow = true;
		directionalLight1.shadow.camera.left = -d;
		directionalLight1.shadow.camera.right = d;
		directionalLight1.shadow.camera.top = d;
		directionalLight1.shadow.camera.bottom = -d;
		directionalLight1.shadow.camera.near = 5;
		directionalLight1.shadow.camera.far = 60;
		directionalLight1.shadow.mapSize.x = 2048;
		directionalLight1.shadow.mapSize.y = 2048;
		directionalLight1.shadow.intensity = 0.55;
		
		const directionalLight2 = new THREE.DirectionalLight(0xffaaaa, 0.7);
		directionalLight2.position.set(-20, 5, 20).normalize();
		scene.add(directionalLight2);
		
		const directionalLight3 = new THREE.DirectionalLight(0xffddaa, 0.5);
		directionalLight3.position.set(5, -20, -5).normalize();
		scene.add(directionalLight3);
		
		scene.background = new THREE.Color(0x87ceeb);
		
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
				node.castShadow = true;
				flipUv(node.geometry.attributes.uv);
				flipUv(node.geometry.attributes.uv1);
			});
			
			scene.add(gltf.scene);
			cb(gltf.scene);
		});
		
		const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xface8d });
		const geoFloor = new THREE.PlaneGeometry(100, 100, 4, 4);
		const meshFloor = new THREE.Mesh(geoFloor, floorMaterial);
		meshFloor.rotation.x = -Math.PI * 0.5;
		meshFloor.position.y = -2;
		meshFloor.receiveShadow = true;
		scene.add(meshFloor);
	})();
};

module.exports = { populateScene };
