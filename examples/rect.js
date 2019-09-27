'use strict';

const init = require('..');


const { Screen, Rect, loop } = init();

const screen = new Screen();
loop(() => screen.draw());

const F_KEY = 70;

screen.on('keydown', e => {
	
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


const rect = new Rect({ screen });

const mouse = { x: screen.w / 2, y: screen.h / 2 };

const paint = () => {
	rect.mat.color.r = mouse.x / screen.w;
	rect.mat.color.g = mouse.y / screen.h;
	rect.mat.color.b = 1 - rect.mat.color.r * rect.mat.color.g;
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
