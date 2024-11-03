// Init Node3D environment
const three = require('three');
const { init, addThreeHelpers } = require('../..');
const { doc, gl, requestAnimationFrame } = init({ isGles3: true, isWebGL2: true, vsync: false });
addThreeHelpers(three, gl);

// Three.js rendering setup
const renderer = new three.WebGLRenderer();
const scene = new three.Scene();
const camera = new three.PerspectiveCamera(70, doc.w / doc.h, 0.2, 500);
camera.position.z = 35;
scene.background = new three.Color(0x333333);

// Add scene lights
scene.add(new three.AmbientLight(0xc1c1c1, 0.5));
const sun = new three.DirectionalLight(0xffffff, 2);
sun.position.set(-1, 0.5, 1);
scene.add(sun);

// Original knot mesh
const knotGeometry = new three.TorusKnotGeometry(10, 1.85, 256, 20, 2, 7);
const knotMaterial = new three.MeshToonMaterial({ color: 0x6cc24a });
const knotMesh = new three.Mesh(knotGeometry, knotMaterial);
scene.add(knotMesh);

// A slightly larger knot mesh, inside-out black - for outline
const outlineGeometry = new three.TorusKnotGeometry(10, 2, 256, 20, 2, 7);
const outlineMaterial = new three.MeshBasicMaterial({ color: 0, side: three.BackSide });;
const outlineMesh = new three.Mesh(outlineGeometry, outlineMaterial);
knotMesh.add(outlineMesh);

// Handle window resizing
doc.addEventListener('resize', () => {
	camera.aspect = doc.w / doc.h;
	camera.updateProjectionMatrix();
	renderer.setSize(doc.w, doc.h);
});

// Called repeatedly to render new frames
const animate = () => {
	requestAnimationFrame(animate);
	const time = Date.now();
	knotMesh.rotation.x = time * 0.0005;
	knotMesh.rotation.y = time * 0.001;
	renderer.render(scene, camera);
};

animate();
