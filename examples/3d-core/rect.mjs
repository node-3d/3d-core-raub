import * as three from 'three';

import node3d from '../../index.js';
const { init } = node3d;


const { Screen, Rect, loop } = init({
	isGles3: true,
	isWebGL2: true,
	autoEsc: true,
	autoFullscreen: true,
	vsync: true,
	title: 'Rect',
});

const screen = new Screen({ three });
loop(() => screen.draw());

screen.camera.position.z = 500;

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

screen.on('mousemove', (e) => {
	const dx = mouse.x - e.x;
	const dy = mouse.y - e.y;
	
	mouse.x = e.x;
	mouse.y = e.y;
	
	paint();
	
	if (!isMoving) {
		return;
	}
	
	rect.pos = rect.pos.plused([-dx, dy]);
});
