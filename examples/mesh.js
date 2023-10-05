'use strict';

const three = require('three');
const { init } = require('..');


const { Screen, loop, Image } = init();

const screen = new Screen({ three });

const F_KEY = 70;

screen.on('keydown', (e) => {
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


const icon = new Image();
icon.src = __dirname + '/crate.jpg';
icon.on('load', () => { screen.icon = icon; });

screen.title = 'Mesh';


const geometry = new three.IcosahedronGeometry(2, 1);
const material =  new three.MeshLambertMaterial({
	color: 0x888888 + Math.round((0xFFFFFF - 0x888888) * Math.random()),
	emissive: 0x333333,
});

const mesh = new three.Mesh(geometry, material);
screen.scene.add( mesh );

const pointLight = new three.PointLight(0xFFFFFF, 1, 100);
screen.scene.add(pointLight);
pointLight.position.x = 2;
pointLight.position.y = 20;
pointLight.position.z = 5;


loop(() => {
	mesh.rotation.x = Date.now() * 0.0005;
	mesh.rotation.y = Date.now() * 0.001;
	mesh.rotation.z = Date.now() * 0.0007;
	screen.draw();
});

module.exports = { screen };