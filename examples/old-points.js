'use strict';

console.log('https://threejs.org/examples/#webgl_points_random');

const node3d  = require('../index');


var container, stats;
var camera, scene, renderer, particles, geometry, materials = [], parameters, i, h, color, size;
var mouseX = 0, mouseY = 0;
var windowHalfX = node3d.canvas.width / 2;
var windowHalfY = node3d.canvas.height / 2;
init();
animate();

function init() {
	
	camera = new node3d.three.PerspectiveCamera( 75, node3d.canvas.width / node3d.canvas.height, 1, 3000 );
	camera.position.z = 1000;
	scene = new node3d.three.Scene();
	scene.fog = new node3d.three.FogExp2( 0x000000, 0.0007 );
	geometry = new node3d.three.Geometry();
	for ( i = 0; i < 20000; i ++ ) {
		var vertex = new node3d.three.Vector3();
		vertex.x = Math.random() * 2000 - 1000;
		vertex.y = Math.random() * 2000 - 1000;
		vertex.z = Math.random() * 2000 - 1000;
		geometry.vertices.push( vertex );
	}
	parameters = [
		[ [1, 1, 0.5], 5 ],
		[ [0.95, 1, 0.5], 4 ],
		[ [0.90, 1, 0.5], 3 ],
		[ [0.85, 1, 0.5], 2 ],
		[ [0.80, 1, 0.5], 1 ]
	];
	for ( i = 0; i < parameters.length; i ++ ) {
		color = parameters[i][0];
		size  = parameters[i][1];
		materials[i] = new node3d.three.PointsMaterial( { size: size } );
		particles = new node3d.three.Points( geometry, materials[i] );
		particles.rotation.x = Math.random() * 6;
		particles.rotation.y = Math.random() * 6;
		particles.rotation.z = Math.random() * 6;
		scene.add( particles );
	}
	renderer = node3d.renderer;
	
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );
	//
	document.addEventListener( 'resize', onWindowResize, false );
}
function onWindowResize() {
	windowHalfX = node3d.canvas.width / 2;
	windowHalfY = node3d.canvas.height / 2;
	camera.aspect = node3d.canvas.width / node3d.canvas.height;
	camera.updateProjectionMatrix();
}
function onDocumentMouseMove( event ) {
	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - windowHalfY;
}
function onDocumentTouchStart( event ) {
	if ( event.touches.length === 1 ) {
		event.preventDefault();
		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;
	}
}
function onDocumentTouchMove( event ) {
	if ( event.touches.length === 1 ) {
		event.preventDefault();
		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;
	}
}
//
function animate() {
	node3d.frame( animate );
	render();
}
function render() {
	var time = Date.now() * 0.00005;
	camera.position.x += ( mouseX - camera.position.x ) * 0.05;
	camera.position.y += ( - mouseY - camera.position.y ) * 0.05;
	camera.lookAt( scene.position );
	for ( i = 0; i < scene.children.length; i ++ ) {
		var object = scene.children[ i ];
		if ( object instanceof node3d.three.Points ) {
			object.rotation.y = time * ( i < 4 ? i + 1 : - ( i + 1 ) );
		}
	}
	for ( i = 0; i < materials.length; i ++ ) {
		color = parameters[i][0];
		h = ( 360 * ( color[0] + time ) % 360 ) / 360;
		materials[i].color.setHSL( h, color[1], color[2] );
	}
	renderer.render( scene, camera );
}
