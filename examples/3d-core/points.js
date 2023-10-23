'use strict';

const three = require('three');
const { init } = require('../..');


const { Screen, Points, loop, gl } = init({
	isGles3: true,
	isWebGL2: true,
	autoEsc: true,
	autoFullscreen: true,
});

const F_KEY = 70;

const screen = new Screen({ three });
loop(() => screen.draw());

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
screen.camera.position.z = 200;

const VBO_SIZE = 10000;

const vertices = [];
const colors = [];
for (let i = VBO_SIZE * 3; i > 0; i--) {
	vertices.push( Math.random() * 200 - 100 );
	colors.push( Math.random() );
}


const pos = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, pos);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

const rgb = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, rgb);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);


const points = new Points({
	screen,
	size  : '7.0',
	count : VBO_SIZE,
	attrs : {
		position: { vbo: pos, items: 3 },
		color: { vbo: rgb, items: 3 },
	},
});


let isMoving = false;
let mouse = { x: 0, y: 0 };

screen.on('mousedown', () => { isMoving = true; });
screen.on('mouseup', () => { isMoving = false; });

screen.on('mousemove', (e) => {
	const dx = mouse.x - e.x;
	const dy = mouse.y - e.y;
	
	mouse.x = e.x;
	mouse.y = e.y;
	
	if (!isMoving) {
		return;
	}
	
	points.mesh.rotation.y += dx * 0.001;
	points.mesh.rotation.x += dy * 0.001;
});
