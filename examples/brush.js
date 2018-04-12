'use strict';

const { Screen, Brush, loop } = require('../index');


const F_KEY = 70;


const screen = new Screen();
loop(() => screen.draw());

const brush = new Brush({ screen, color: 0x00FF00 });

screen.on('mousemove', e => brush.pos = [e.x, e.y]);

screen.document.on('keydown', e => {
	// if (e.keyCode === F_KEY && e.ctrlKey && e.shiftKey) {
	// 	screen.document.mode = 'windowed';
	// } else if (e.keyCode === F_KEY && e.ctrlKey && e.altKey) {
	// 	screen.document.mode = 'fullscreen';
	// } else if (e.keyCode === F_KEY && e.ctrlKey) {
	// 	screen.document.mode = 'borderless';
	// } else {
	// 	return;
	// }
	screen._renderer = new screen.three.WebGLRenderer({
		
		context   : screen.document.context,
		antialias : true,
		canvas    : screen.document,
		alpha     : true,
		
		premultipliedAlpha     : true,
		preserveDrawingBuffer  : true,
		logarithmicDepthBuffer : true,
		
	});
	// screen.renderer.setSize(screen.width, screen.height, false);
	// screen.renderer.gammaInput = true;
	// screen.camera.aspect = screen.width / screen.height;
	// screen.camera.updateProjectionMatrix();
});
