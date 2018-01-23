'use strict';

const { Screen, Brush, loop } = require('../index');


const screen = new Screen();
loop(() => screen.draw());

const brush = new Brush({ screen, color: 0x00FF00 });

screen.on('mousemove', e => brush.pos = [e.x, e.y]);
