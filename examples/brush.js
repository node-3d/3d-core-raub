'use strict';

const node3d  = require('../index');


const screen = new node3d.Screen();
const brush = new node3d.Brush({ screen, color: 0x00FF00 });

screen.on('mousemove', e => brush.pos = [e.x, e.y]);


function animation() {
	
	screen.draw();
	node3d.frame(animation);
	
}

node3d.frame(animation);
