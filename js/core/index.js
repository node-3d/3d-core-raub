'use strict';

const webgl = require('webgl-raub');
const Image = require('image-raub');
const glfw  = require('glfw-raub');

const location     = require('./location');
const navigator    = require('./navigator');
const WebVRManager = require('./vr-manager');


const { Document, Window } = glfw;

Document.setWebgl(webgl);
Document.setImage(Image);


let mode = 'windowed';

if (process.argv.includes('--fullscreen')) {
	mode = 'fullscreen';
} else if (process.argv.includes('--borderless')) {
	mode = 'borderless';
}

const doc = new Document({ mode });
const canvas = doc;
const gl = webgl;

global.document = doc;
global.window = doc;
global.cwrap = null;
global.requestAnimationFrame = doc.requestAnimationFrame;
global.location = location;
global.navigator = navigator;
global.WebVRManager = WebVRManager;


// Hack for three.js, adjust shaders
const _shaderSource = gl.shaderSource;
gl.shaderSource = (shader, string) => _shaderSource(
	shader,
	string.replace(
		/^\s*?(#version|precision).*?$/gm, ''
	).replace(
		/^/, '#version 120\n'
	).replace(
		/gl_FragDepthEXT/g, 'gl_FragDepth'
	).replace(
		'#extension GL_EXT_frag_depth : enable', ''
	).replace(
		/\bhighp\b/g, ''
	)
);


// Require THREE after Document and GL are ready
const three = require('threejs-raub');
global.THREE = three;


three.FileLoader.prototype.load = (url, onLoad, onProgress, onError) => {
	
	// Data URI
	if (/^data:/.test(url)) {
		
		const [head, body] = url.split(',');
		const isBase64 = head.indexOf('base64') > -1;
		const data = isBase64 ? Buffer.from(body, 'base64') : Buffer.from(unescape(body));
		onLoad(data);
		return;
		
	}
	
	// Remote URI
	if (/^https?:\/\//i.test(url)) {
		
		const download = require('addon-tools-raub/download');
		
		download(url).then(
			data => onLoad(data),
			err => typeof onError === 'function' ? onError(err) : console.error(err)
		);
		
		return;
		
	}
	
	// Filesystem URI
	require('fs').readFile(url, (err, data) => {
		if (err) {
			return typeof onError === 'function' ? onError(err) : console.error(err);
		}
		onLoad(data);
	});
	
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
	properties.__webglInit = true;
	
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
	Window,
	
	gl,
	webgl,
	context : gl,
	
	glfw,
	
	doc,
	canvas,
	document : doc,
	window   : doc,
	
	three,
	THREE : three,
	
	loop,
	requestAnimationFrame : doc.requestAnimationFrame,
	frame                 : doc.requestAnimationFrame,
	
};
