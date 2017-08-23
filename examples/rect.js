'use strict';

const node3d  = require('../index');


const screen = new node3d.Screen();
const rect = new node3d.Rect({ screen });


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
	
	rect.pos = rect.pos.plused([-dx, dy]);
	
});


function animation() {
	
	screen.draw();
	node3d.frame(animation);
	
}

node3d.frame(animation);
