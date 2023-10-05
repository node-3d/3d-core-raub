'use strict';

const three = require('three');
const { init } = require('..');


const { Screen, Surface, Rect, Points, loop, gl } = init();

const VBO_SIZE = 10000;

const screen = new Screen({ three });
loop(() => screen.draw());

screen.camera.position.z = 400;


const F_KEY = 70;

screen.on('keydown', (e) => {
	if (e.keyCode === F_KEY && e.ctrlKey && e.shiftKey) {
		screen.mode = 'windowed';
	} else if (e.keyCode === F_KEY && e.ctrlKey && e.altKey) {
		screen.mode = 'fullscreen';
	} else if (e.keyCode === F_KEY && e.ctrlKey) {
		screen.mode = 'borderless';
	} else {
		return;
	}
});

const rect1 = new Rect({ screen, pos: [-500, -500], size: [1000, 1000] });
rect1.mat.color.r = 1;
rect1.mat.color.g = 0;
rect1.mat.color.b = 0;

const surface = new Surface({ screen });
surface.camera.position.z = 400;

const rect2 = new Rect({ screen: surface, pos: [-500, -500], size: [1000, 1000] });
rect2.mat.color.r = 0;
rect2.mat.color.g = 1;
rect2.mat.color.b = 0;

const vertices = [];
const colors = [];
for (let i = VBO_SIZE * 3; i > 0; i--) {
	vertices.push( Math.random() * 600 - 300 );
	colors.push( Math.random() );
}

const pos = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, pos);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

const rgb = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, rgb);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

const points = new Points({
	screen: surface,
	count: VBO_SIZE,
	attrs: {
		position: {
			vbo: pos,
			items: 3,
		},
		color: {
			vbo: rgb,
			items: 3,
		},
	},
});


let isRotating = false;
let mouse = { x: 0, y: 0 };

screen.on('mousedown', () => { isRotating = true; });
screen.on('mouseup', () => { isRotating = false; });

screen.on('mousemove', (e) => {
	const dx = mouse.x - e.x;
	const dy = mouse.y - e.y;
	
	mouse.x = e.x;
	mouse.y = e.y;
	
	if (!isRotating) {
		return;
	}
	
	points.mesh.rotation.y += dx * 0.001;
	points.mesh.rotation.x += dy * 0.001;
	
	surface.pos = surface.pos.plused([-dx, dy]);
});
