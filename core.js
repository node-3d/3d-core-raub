'use strict';

const webgl = require('webgl-raub');
const Image = require('image-raub');

const glfw = require('glfw-raub');
const { Document, Window } = glfw;


Document.setWebgl(webgl);
Document.setImage(Image);

const doc = new Document();
const canvas = doc;
const gl = webgl;

global.document = doc;
global.window = doc;
global.cwrap = null;
global.requestAnimationFrame = doc.requestAnimationFrame;


// Hack for three.js, remove precision from shaders
const _shaderSource = gl.shaderSource;
gl.shaderSource = (shader, string) => _shaderSource(
	shader,
	string.replace(
		/^\s*?(#version|precision).*?$/gm, ''
	).replace(
		/^/, '#version 120\n'
	).replace(
		/\bhighp\b/g, ''
	)
);


gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.enable(gl.DEPTH_TEST);


global.navigator = {
	appCodeName: 'Mozilla',
	appName: 'Netscape',
	appVersion: 'Node3D',
	bluetooth: {},
	clipboard: {},
	connection: {
		onchange: null, effectiveType: '4g', rtt: 50, downlink: 3.3, saveData: false
	},
	cookieEnabled: false,
	credentials: {},
	deviceMemory: 8,
	doNotTrack: null,
	geolocation: {},
	hardwareConcurrency: 4,
	keyboard: {},
	language: 'en',
	languages: ['en', 'en-US'],
	locks: {},
	maxTouchPoints: 0,
	mediaCapabilities: {},
	mediaDevices: { ondevicechange: null },
	mimeTypes: { length: 0 },
	onLine: false,
	permissions: {},
	platform: 'Any',
	plugins: { length: 0 },
	presentation: { defaultRequest: null, receiver: null },
	product: 'Node3D',
	productSub: '1',
	serviceWorker: {
		ready: Promise.resolve(false),
		controller: null,
		oncontrollerchange: null,
		onmessage: null
	},
	storage: {},
	usb: { onconnect: null, ondisconnect: null },
	userAgent: 'Mozilla/Node3D',
	vendor: 'Node3D',
	vendorSub: '',
	webkitPersistentStorage: {},
	webkitTemporaryStorage: {},
};

class WebVRManager {
	
	get enabled() { return false; }
	
	constructor() {}
	
	isPresenting() { return false; }
	dispose() {}
	setAnimationLoop() {}
	getCamera() { return {}; }
	submitFrame() {}
	isPresenting() { return false; }
	
}

global.WebVRManager = WebVRManager;


// Require THREE after Document and GL are ready
const three = require('threejs-raub');
global.THREE = three;


three.FileLoader.prototype.load = (url, onLoad, onProgress, onError) => {
	require('fs').readFile(url, (err, data) => {
		if (err) {
			if (typeof onError === 'function') {
				onError(err);
			} else {
				console.error(err);
			}
			return;
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
