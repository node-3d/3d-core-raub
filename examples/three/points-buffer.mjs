import * as three from 'three';
import { init } from '../../index.js';

console.log('https://threejs.org/examples/#webgl_points_random');

const { Screen, loop, gl, doc } = init({
	isGles3: true,
	isWebGL2: true,
	autoEsc: true,
	autoFullscreen: true,
	vsync: true,
});

const camera = new three.PerspectiveCamera(75, doc.width / doc.height, 1, 3000);
const scene = new three.Scene();
const screen = new Screen({ three, camera, scene });

const REAL_SIZE = 20000;

var particles, materials = [], i, h, color, size;
var mouseX = 0, mouseY = 0;
var windowHalfX = screen.width / 2;
var windowHalfY = screen.height / 2;

let cloud = null;


const onWindowResize = () => {
	windowHalfX = screen.width / 2;
	windowHalfY = screen.height / 2;
};

const onDocumentMouseMove = (event) => {
	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - windowHalfY;
};

const onDocumentTouchStart = (event) => {
	if (event.touches.length === 1) {
		event.preventDefault();
		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;
	}
};

const onDocumentTouchMove = (event) => {
	if (event.touches.length === 1) {
		event.preventDefault();
		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;
	}
};


const addCloud = () => {
	const geo = new three.BufferGeometry();
	geo.computeBoundingSphere = (() => {
		geo.boundingSphere = new three.Sphere(undefined, Infinity);
	});
	geo.computeBoundingSphere();
	geo.setDrawRange(0, 0);
	
	const vertices = [];
	for (i = 0; i < REAL_SIZE; i++) {
		vertices.push(Math.random() * 2000 - 1000);
		vertices.push(Math.random() * 2000 - 1000);
		vertices.push(Math.random() * 2000 - 1000);
	}
	const vbo = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	const posAttr = new three.GLBufferAttribute(vbo, gl.FLOAT, 3, 4, REAL_SIZE);
	geo.setAttribute('position', posAttr);
	geo.setDrawRange(0, REAL_SIZE);
	
	color = [1, 1, 0.5];
	size = 5;
	materials[0] = new three.PointsMaterial({ size: size });
	materials[0].color.setHSL(color[0], color[1], color[2]);
	particles = new three.Points(geo, materials[0]);
	scene.add(particles);
	
	return particles;
};


camera.position.z = 1000;
scene.fog = new three.FogExp2(0x000000, 0.0007);

cloud = addCloud();

screen.document.addEventListener('mousemove', onDocumentMouseMove, false);
screen.document.addEventListener('touchstart', onDocumentTouchStart, false);
screen.document.addEventListener('touchmove', onDocumentTouchMove, false);

screen.document.addEventListener('resize', onWindowResize, false);


loop(() => {
	var time = Date.now() * 0.00005;
	camera.position.x += (mouseX - camera.position.x) * 0.05;
	camera.position.y += (-mouseY - camera.position.y) * 0.05;
	camera.lookAt(scene.position);
	
	for (i = 0; i < materials.length; i++) {
		color = [1, 1, 0.5];
		h = (360 * (color[0] + time) % 360) / 360;
		materials[i].color.setHSL(h, color[1], color[2]);
	}
	
	cloud.rotation.y = time * (i < 4 ? i + 1 : -(i + 1));
	
	screen.draw(scene, camera);
});
