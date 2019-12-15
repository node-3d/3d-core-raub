const initCore = require('../..');
const { THREE, window, document, requestAnimationFrame } = initCore();


var camera, scene, renderer;
var mesh;
let prevTime = Date.now();

init();
animate();
function init() {
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.z = 400;
	scene = new THREE.Scene();
	var texture = new THREE.TextureLoader().load( __dirname + '/textures/freeimage.jpg' );
	var geometry = new THREE.PlaneBufferGeometry( 200, 200 );
	var material = new THREE.MeshBasicMaterial( { map: texture } );
	mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );
	renderer = new THREE.WebGLRenderer();
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
