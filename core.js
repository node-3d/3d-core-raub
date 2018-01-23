'use strict';

const webgl = require('node-webgl-raub');
const Image = require('node-image-raub');

const { Document } = require('node-glfw-raub');


Document.setWebgl(webgl);
Document.setImage(Image);

const doc = new Document();
const canvas = doc;
const gl = webgl;

global.document = doc;
global.window = doc;
global.cwrap = null;
global.requestAnimationFrame = doc.requestAnimationFrame;

doc.appendChild = () => {};

// Hack for three.js, remove precision from shaders
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


three.Texture.fromId = (id, renderer) => {
	
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


const loop = cb => {
	
	let i = 0;
	
	const animation = () => {
		
		cb(i++);
		doc.requestAnimationFrame(animation);
		
	};
	
	doc.requestAnimationFrame(animation);
	
};


module.exports = {
	
	Image,
	Document,
	
	gl,
	webgl,
	context: gl,
	
	doc,
	document: doc,
	canvas,
	
	three,
	THREE: three,
	
	requestAnimationFrame: doc.requestAnimationFrame,
	frame: doc.requestAnimationFrame,
	loop,
	
};
