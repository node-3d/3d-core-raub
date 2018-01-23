'use strict';

const { Screen, loop } = require('../index');


const screen = new Screen();

const geometry = new THREE.IcosahedronGeometry(200, 1);
const material =  new THREE.MeshLambertMaterial({
	color: 0xFFFFFF,
});

const mesh = new THREE.Mesh(geometry, material);
screen.scene.add( mesh );

const pointLight = new THREE.PointLight(0xFFFFFF, 1, 100000);
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
