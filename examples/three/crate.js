const three = require('three');
const { init, addThreeHelpers } = require('../..');

const { window, document, gl, requestAnimationFrame } = init({
	isGles3: true,
	isWebGL2: true,
	autoEsc: true,
	autoFullscreen: true,
});
addThreeHelpers(three, gl);

var camera, scene, renderer, mesh;

initExample();
animate();

function initExample() {
	camera = new three.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.z = 2;
	scene = new three.Scene();
	
	var texture = new three.TextureLoader().load( __dirname + '/textures/crate.gif' );
	texture.colorSpace = three.SRGBColorSpace;
	var geometry = new three.BoxGeometry();
	var material = new three.MeshBasicMaterial( { map: texture } );
	mesh = new three.Mesh( geometry, material );
	scene.add( mesh );
	
	renderer = new three.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	
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
	mesh.rotation.x = time * 0.0005;
	mesh.rotation.y = time * 0.001;
	renderer.render( scene, camera );
}
