'use strict';

const { Screen, loop, three } = require('../index');


const screen = new Screen();

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


const geometry = new three.IcosahedronGeometry(200, 1);
const material =  new three.MeshLambertMaterial({
	color: 0x888888 + Math.round((0xFFFFFF - 0x888888) * Math.random()),
	emissive: 0x333333,
});

const mesh = new three.Mesh(geometry, material);
screen.scene.add( mesh );

const pointLight = new three.PointLight(0xFFFFFF, 1, 100000);
screen.scene.add( pointLight );
pointLight.position.x = 200;
pointLight.position.y = 2000;
pointLight.position.z = 500;


loop(() => {
	mesh.rotation.x = Date.now() * 0.0005;
	mesh.rotation.y = Date.now() * 0.001;
	mesh.rotation.z = Date.now() * 0.0007;
	screen.draw();
});
