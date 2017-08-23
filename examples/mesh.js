'use strict';

const node3d = require('../index');
const THREE  = node3d.three;

const camera = new THREE.PerspectiveCamera( 75, node3d.canvas.width / node3d.canvas.height, 1, 1000 );
camera.position.z = 500;

const scene = new THREE.Scene();

const geometry = new THREE.IcosahedronGeometry(200, 1);
const material =  new THREE.MeshLambertMaterial({
	color: 0xFFFFFF,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add( mesh );

const pointLight = new THREE.PointLight(0xFFFFFF, 1, 100000);
scene.add( pointLight );
pointLight.position.x = 200;
pointLight.position.y = 2000;
pointLight.position.z = 500;


function animation() {
	
	mesh.rotation.x = Date.now() * 0.0005;
	mesh.rotation.y = Date.now() * 0.001;
	mesh.rotation.z = Date.now() * 0.0007;
	
	node3d.renderer.render(scene, camera);
	
	node3d.frame(animation);
	
}

node3d.frame(animation);
