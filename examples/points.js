'use strict';

const node3d  = require('../index');


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
node3d.gl.bufferData(node3d.gl.ARRAY_BUFFER, new Float32Array(vertices), node3d.gl.STATIC_DRAW);

const rgb = node3d.gl.createBuffer();
node3d.gl.bindBuffer(node3d.gl.ARRAY_BUFFER, rgb);
node3d.gl.bufferData(node3d.gl.ARRAY_BUFFER, new Float32Array(colors), node3d.gl.STATIC_DRAW);

const points = new node3d.Points({
	
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


function animation() {
	
	screen.draw();
	node3d.frame(animation);
	
}

node3d.frame(animation);
