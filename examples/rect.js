'use strict';

const node3d  = require('../index');
const THREE  = node3d.three;


const screen = new node3d.Screen();
const rect = new node3d.Rect({ screen });
const scene = screen.scene;

const mouse = { x: screen.w / 2, y: screen.h / 2 };

const paint = () => {
	const r = mouse.x / screen.w;
	const g = mouse.y / screen.h;
	const b = 1 - r * g;
	rect.mat.color = [r, g, b];
};
paint();

let isMoving = false;

document.on('mousedown', e => isMoving = true);
document.on('mouseup', e => isMoving = false);

document.on('mousemove', e => {
	
	const dx = mouse.x - e.x;
	const dy = mouse.y - e.y;
	
	mouse.x = e.x;
	mouse.y = e.y;
	
	paint();
	
	if ( ! isMoving ) {
		return;
	}
	
	rect.pos = rect.pos.plused([-dx, dy]);
	
});


function animation() {
	
	screen.draw();
	node3d.frame(animation);
	
}

node3d.frame(animation);
