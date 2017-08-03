'use strict';

console.log('https://threejs.org/examples/#webgl_points_random');

const node3d  = require('../index');

const THREE = node3d.three;

const _dummyArray = new Float32Array(10);
const REAL_SIZE = 20000;

var container, stats;
var camera, scene, renderer, particles, materials = [], parameters, i, h, color, size;
var mouseX = 0, mouseY = 0;
var windowHalfX = node3d.canvas.width / 2;
var windowHalfY = node3d.canvas.height / 2;
var mesh, line;

let cloud = null;

init();
animate();

function init() {
	
	camera = new node3d.three.PerspectiveCamera( 75, node3d.canvas.width / node3d.canvas.height, 1, 3000 );
	camera.position.z = 1000;
	scene = new node3d.three.Scene();
	scene.fog = new node3d.three.FogExp2( 0x000000, 0.0007 );
	renderer = node3d.renderer;
	
	cloud = addCloud();
	
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );
	
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

function animate() {
	node3d.frame( animate );
	render();
}


function render() {
	
	var time = Date.now() * 0.00005;
	camera.position.x += ( mouseX - camera.position.x ) * 0.05;
	camera.position.y += ( - mouseY - camera.position.y ) * 0.05;
	camera.lookAt( scene.position );
	
	for ( i = 0; i < materials.length; i ++ ) {
		color = [1, 1, 0.5];
		h = ( 360 * ( color[0] + time ) % 360 ) / 360;
		materials[i].color.setHSL( h, color[1], color[2] );
	}
	
	cloud.rotation.y = time * ( i < 4 ? i + 1 : - ( i + 1 ) );
	
	renderer.render( scene, camera );
	
}


function addCloud() {
	
	const geo = new node3d.three.BufferGeometry();
	geo.computeBoundingSphere = (() => {
		geo.boundingSphere = new node3d.three.Sphere(undefined, Infinity);
	});
	geo.computeBoundingSphere();
	geo.setDrawRange( 0, 0 );
	
	const ba = new node3d.three.BufferAttribute(_dummyArray, 3);
	ba.count = REAL_SIZE * 3; // max * sizeof
	
	ba.onCreateCallback = function () {
		const vertices = [];
		// const vertices = new Float32Array(10);
		for ( i = 0; i < REAL_SIZE; i ++ ) {
			vertices.push( Math.random() * 2000 - 1000 );
			vertices.push( Math.random() * 2000 - 1000 );
			vertices.push( Math.random() * 2000 - 1000 );
		}
		const vbo = node3d.gl.createBuffer();
		node3d.gl.bindBuffer(node3d.gl.ARRAY_BUFFER, vbo);
		node3d.gl.bufferData(node3d.gl.ARRAY_BUFFER, new Float32Array(vertices), node3d.gl.STATIC_DRAW);
		
		geo.setDrawRange( 0, REAL_SIZE );
		return vbo;
	};
	
	geo.addAttribute('position', ba);
	
	color = [1, 1, 0.5];
	size  = 5;
	materials[0] = new node3d.three.PointsMaterial( { size: size } );
	materials[0].color.setHSL( color[0], color[1], color[2] );
	particles = new node3d.three.Points( geo, materials[0] );
	scene.add( particles );
	
	return particles;
	
}
