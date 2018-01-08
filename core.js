'use strict';

const { Image, Document, webgl } = require('node-webgl-raub');


const doc = new Document();
const canvas = doc;
const gl = webgl;

global.document = doc;
global.window = doc;
global.cwrap = null;
global.requestAnimationFrame = doc.requestAnimationFrame;

doc.appendChild = () => {};

// Hack for three.js, remove precision from shader
const _shaderSource = gl.shaderSource;
gl.shaderSource = (shader, string) => _shaderSource(
	shader,
	string.replace(
		/^\s*?(\#version|precision).*?$/gm, ''
	).replace(
		/^/, '#version 120\n'
	).replace(
		/\bhighp\b/g, ''
	)
);


gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.enable(gl.DEPTH_TEST);


// Require THREE after Document and GL are ready
const three = require('node-threejs-raub');
global.THREE = three;


three.FileLoader.prototype.load = ( url, onLoad, onProgress, onError ) => {
	require('fs').readFile(url, (err, data) => {
		if (err) {
			return onError(err);
		}
		onLoad(data);
	});
};

Image.prototype.addEventListener = function (cb) {
	this.on('load', cb.bind(this));
};

const _load = three.TextureLoader.prototype.load;
three.TextureLoader.prototype.load = function (url, onLoad, onProgress, onError) {
	const cb = tex => {
		tex.format = three.RGBAFormat;
		if (onLoad) {
			onLoad(tex);
		}
	};
	return _load.call(this, url, cb, onProgress, onError);
};



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
	THREE: three,
	textureFromId,
	
	get renderer() { return fetchRenderer(); },
	
	requestAnimationFrame: doc.requestAnimationFrame,
	frame: doc.requestAnimationFrame,
	loop,
	
};
