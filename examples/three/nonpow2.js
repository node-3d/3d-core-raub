const { init, addThreeHelpers } = require('../..');
const { window, document, gl, requestAnimationFrame } = init();

const three = require('three');
addThreeHelpers(three, gl);


var camera, scene, renderer;
var mesh;
let prevTime = Date.now();

initExample();
animate();
function initExample() {
	camera = new three.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );
	camera.position.z = 400;
	scene = new three.Scene();
	
	var texture = new three.TextureLoader().load( __dirname + '/textures/freeimage.jpg' );
	var geometry = new three.PlaneGeometry( 200, 200 );
	var material = new three.MeshBasicMaterial({ map: texture });
	mesh = new three.Mesh( geometry, material );
	scene.add( mesh );
	
	renderer = new three.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	//
	window.addEventListener( 'resize', onWindowResize, false );
}
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
	requestAnimationFrame( animate );
	const time = Date.now();
	const dt = time - prevTime;
	prevTime = time;
	mesh.rotation.x += dt * 0.00005;
	mesh.rotation.y += dt * 0.0001;
	renderer.render( scene, camera );
}
