'use strict';

const node3d  = require('./index');


const camera = new node3d.three.PerspectiveCamera( 75, node3d.canvas.width / node3d.canvas.height, 1, 1000 );
camera.position.z = 500;

const scene = new node3d.three.Scene();

const geometry = new node3d.three.IcosahedronGeometry(200, 1);
const material =  new node3d.three.MeshBasicMaterial({
	color             : 0xfff999fff,
});
const mesh = new node3d.three.Mesh(geometry, material);
scene.add( mesh );

function animation() {
	
	node3d.frame( animation );
	
	mesh.rotation.x = Date.now() * 0.00005;
	mesh.rotation.y = Date.now() * 0.0001; 
	mesh.position.y += 0.0005;
	mesh.position.z += 0.05;  
	
	node3d.renderer.render( scene, camera);
	
}

animation();
