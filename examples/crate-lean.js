const three = require('three');

const { init, addThreeHelpers } = require('..');


const { doc, gl, requestAnimationFrame } = init({ isGles3: true });
addThreeHelpers(three, gl);

const renderer = new three.WebGLRenderer();
renderer.setPixelRatio( doc.devicePixelRatio );
renderer.setSize( doc.innerWidth, doc.innerHeight );

const camera = new three.PerspectiveCamera(70, doc.innerWidth / doc.innerHeight, 1, 1000);
camera.position.z = 2;
const scene = new three.Scene();

const texture = new three.TextureLoader().load(__dirname + '/three/textures/crate.gif');
texture.colorSpace = three.SRGBColorSpace;

const geometry = new three.BoxGeometry();
const material = new three.MeshBasicMaterial({ map: texture });
const mesh = new three.Mesh( geometry, material );
scene.add(mesh);

doc.addEventListener('resize', () => {
	camera.aspect = doc.innerWidth / doc.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(doc.innerWidth, doc.innerHeight);
});

const animate = () => {
	requestAnimationFrame(animate);
	const time = Date.now();
	mesh.rotation.x = time * 0.0005;
	mesh.rotation.y = time * 0.001;
	
	renderer.render(scene, camera);
};

animate();
