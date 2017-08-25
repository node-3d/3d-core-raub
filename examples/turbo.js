'use strict';

const node3d  = require('../index');


const buffer = node3d.turbo.alloc(1e6);
const factor = 3;

for (let i = 0; i < 3e4; i++) {
	buffer.data[i] = i * 0.1;
}

node3d.turbo.run(buffer, `void main(void) {
commit(read() * ${factor}.0);
}`);

console.log(buffer.data.subarray(0, 15));


const VBO_SIZE = 10000;

const screen = new node3d.Screen();

const vertices = [];
const colors = [];
for (let i = VBO_SIZE * 3; i > 0; i--) {
	vertices.push( Math.random() * 2000 - 1000 );
	colors.push( Math.random() );
}

const pos = node3d.gl.createBuffer();
node3d.gl.bindBuffer(node3d.gl.ARRAY_BUFFER, pos);
node3d.gl.bufferData(node3d.gl.ARRAY_BUFFER, new Float32Array(buffer.data), node3d.gl.STATIC_DRAW);

const rgb = node3d.gl.createBuffer();
node3d.gl.bindBuffer(node3d.gl.ARRAY_BUFFER, rgb);
node3d.gl.bufferData(node3d.gl.ARRAY_BUFFER, new Float32Array(colors), node3d.gl.STATIC_DRAW);

const points = new node3d.Points({
	
	screen,
	
	count: VBO_SIZE,
	
	attrs: {
		
		position: {
			vbo: buffer.read,
			// vbo: pos,
			items: 4,
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
	
	points.mesh.rotation.y += dx * 0.001;
	points.mesh.rotation.x += dy * 0.001;
	
});


function animation() {
	
	screen.draw();
	node3d.frame(animation);
	
}

node3d.frame(animation);
