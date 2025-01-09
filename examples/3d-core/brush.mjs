import * as three from 'three';

import node3d from '../../index.js';
const { init } = node3d;


const { Screen, Brush, loop } = init({
	isGles3: true,
	isWebGL2: true,
	autoEsc: true,
	autoFullscreen: true,
	vsync: true,
	title: 'Brush',
});

const screen = new Screen({ three });
loop(() => screen.draw());

const brush = new Brush({ screen, color: 0x00FF00 });

screen.on('mousemove', (e) => brush.pos = [e.x, e.y]);
