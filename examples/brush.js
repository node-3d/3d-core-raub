'use strict';

const { Screen, Brush, loop } = require('../index');


const F_KEY = 70;


const screen = new Screen();
loop(() => screen.draw());

const brush = new Brush({ screen, color: 0x00FF00 });

screen.on('mousemove', e => brush.pos = [e.x, e.y]);

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
