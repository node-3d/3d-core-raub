'use strict';

const node3d  = require('./index');


const camera = new node3d.three.PerspectiveCamera( 75, node3d.canvas.width / node3d.canvas.height, 1, 1000 );
camera.position.z = 500;

const scene = new node3d.three.Scene();

const geometry = new node3d.three.IcosahedronGeometry(200, 1);
const material =  new node3d.three.MeshLambertMaterial({
	color: 0xffffff,
});
const mesh = new node3d.three.Mesh(geometry, material);
scene.add( mesh );

const pointLight = new node3d.three.PointLight(0xFFFFFF, 1, 100000);
scene.add( pointLight );
pointLight.position.x = 200;
pointLight.position.y = 2000;
pointLight.position.z = 500;


function animation() {
	
	mesh.rotation.x = Date.now() * 0.00005;
	mesh.rotation.y = Date.now() * 0.0001;
	
	node3d.renderer.render(scene, camera);
	
	node3d.frame(animation);
	
}

node3d.frame(animation);
