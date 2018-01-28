'use strict';

const { Screen, Tris, loop, gl } = require('../index');


const screen = new Screen();
loop(() => screen.draw());


const VBO_SIZE = 3000;


const vertices = [];
const colors = [];
for (let i = VBO_SIZE * 3; i > 0; i--) {
	vertices.push( Math.random() * 500 - 250 );
	colors.push( Math.random() );
}

const pos = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, pos);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

const rgb = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, rgb);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

const tris = new Tris({
	
	screen,
	
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


let isMoving = false;
let mouse = { x: 0, y: 0 };

document.on('mousedown', e => isMoving = true);
document.on('mouseup', e => isMoving = false);

document.on('mousemove', e => {
	
	const dx = mouse.x - e.x;
	const dy = mouse.y - e.y;
	
	mouse.x = e.x;
	mouse.y = e.y;
	
	if ( ! isMoving ) {
		return;
	}
	
	tris.mesh.rotation.y += dx * 0.001;
	tris.mesh.rotation.x += dy * 0.001;
	
});