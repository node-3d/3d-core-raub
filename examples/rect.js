'use strict';

const { Screen, Rect, loop }  = require('../index');


const screen = new Screen();
loop(() => screen.draw());

const rect = new Rect({ screen });

const mouse = { x: screen.w / 2, y: screen.h / 2 };

const paint = () => {
	const r = mouse.x / screen.w;
	const g = mouse.y / screen.h;
	const b = 1 - r * g;
	rect.mat.color = [r, g, b];
};
paint();

let isMoving = false;

screen.on('mousedown', () => isMoving = true);
screen.on('mouseup', () => isMoving = false);

screen.on('mousemove', e => {
	
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
