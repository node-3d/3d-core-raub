'use strict';

const { Image, Document } = require('node-webgl-raub');


const doc = new Document();

const canvas = doc;

const gl = canvas.getContext();
if ( ! gl ) {
	throw new Error('Could not initialise WebGL, sorry :-(');
}


// Hack for three.js, remove precision from shader
const parentShaderSource = gl.shaderSource;
gl.shaderSource = (shader, string) => {
	if ( ! /^\s*?\#version.*?$/m.test(string) ) {
		string = '#version 100\n' + string;
	}
	return parentShaderSource(shader, string);
};


gl.viewportWidth = canvas.width;
gl.viewportHeight = canvas.height;

gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.enable(gl.DEPTH_TEST);

global.document = doc;
global.window   = doc;
global.cwrap    = null;


// Require THREE after GL is prepaired
const three = require('node-threejs-raub');

let renderer = null;

const fetchRenderer = () => {
	
	if ( renderer ) {
		return renderer;
	}
	
	renderer = new three.WebGLRenderer({
		
		antialias : true,
		canvas    : canvas,
		alpha     : true,
		
		premultipliedAlpha     : true,
		preserveDrawingBuffer  : true,
		logarithmicDepthBuffer : true,
		
	});
	renderer.setSize(canvas.width, canvas.height, false);
	
	doc.on('resize', () => renderer.setSize(canvas.width, canvas.height));
	
	return renderer;
	
};


doc.on('resize', () => {
	gl.viewportWidth = canvas.width;
	gl.viewportHeight = canvas.height;
});


const loadTexture = (url, onLoad, onProgress, onError) => {
	const cb = tex => {
		tex.format = three.RGBAFormat;
		if (onLoad) {
			onLoad(tex);
		}
	};
	return (new three.TextureLoader()).load(url, cb, onProgress, onError);
};


const textureFromId = (id, renderer) => {
	
	const rawTexture = gl.createTexture();
	rawTexture._ = id;
	
	const texture = new three.Texture();
	
	let properties = null;
	if ( ! renderer.properties ) {
		properties = texture;
	} else {
		properties = renderer.properties.get(texture); // !!!!
	}
	
	properties.__webglTexture = rawTexture;
	properties.__webglInit    = true;
	
	return texture;
	
};


const loop = screen => {
	
	const animation = () => {
		
		screen.draw();
		doc.requestAnimationFrame(animation);
		
	};
	
	doc.requestAnimationFrame(animation);
	
};


module.exports = {
	
	Image: Image,
	
	doc,
	document: doc,
	canvas,
	gl,
	context: gl,
	
	three,
	loadTexture,
	textureFromId,
	
	get renderer() { return fetchRenderer(); },
	
	frame: doc.requestAnimationFrame,
	loop,
	
};
