'use strict';


const _init = (_opts = {}) => {
	
	const opts = {
		
		mode        : 'windowed',
		shaderHacks : [],
		plugins     : [],
		
		webgl        : _opts.webgl || require('webgl-raub'),
		Image        : _opts.Image || require('image-raub'),
		glfw         : _opts.glfw || require('glfw-raub'),
		location     : _opts.location || require('./core/location'),
		navigator    : _opts.navigator || require('./core/navigator'),
		WebVRManager : _opts.WebVRManager || require('./core/vr-manager'),
		
		..._opts,
		
	};
	
	const {
		webgl,
		Image,
		glfw,
		location,
		navigator,
		WebVRManager,
		width,
		height,
		display,
		vsync,
		autoIconify,
		fullscreen,
		mode,
		decorated,
		msaa,
		icon,
		title,
	} = opts;
	
	const { Document, Window } = glfw;
	
	const shaderHacks = [
		...opts.shaderHacks,
	];
	
	Document.setWebgl(webgl);
	Document.setImage(Image);
	
	const doc = new Document({
		width,
		height,
		display,
		vsync,
		autoIconify,
		fullscreen,
		mode,
		decorated,
		msaa,
		icon,
		title,
	});
	const canvas = doc;
	const gl = webgl;
	
	global.document = doc;
	global.window = doc;
	global.cwrap = null;
	global.requestAnimationFrame = doc.requestAnimationFrame;
	global.location = location;
	global.navigator = navigator;
	global.WebVRManager = WebVRManager;
	global.Image = Image;
	global._gl = gl;
	
	
	// Hack for three.js, adjust shaders
	const _shaderSource = gl.shaderSource;
	gl.shaderSource = (shader, string) => _shaderSource(
		shader,
		shaderHacks.reduce((accum, hack) => {
			if (typeof regex === 'object') {
				regex.lastIndex = 0;
			}
			return accum.replace(hack.search, hack.replace);
		}, string)
	);
	
	
	// Require THREE after Document and GL are ready
	const three = opts.three || opts.THREE || require('three');
	global.THREE = three;
	
	require('./core/threejs-helpers')(three, gl);
	
	
	const loop = cb => {
		
		let i = 0;
		
		const animation = () => {
			
			cb(i++);
			doc.requestAnimationFrame(animation);
			
		};
		
		doc.requestAnimationFrame(animation);
		
	};
	
	gl.canvas = canvas;
	
	const core3d = {
		
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
		
		...require('./math'),
		...require('./objects'),
		
		...(opts.extend || null),
		
	};
	
	opts.plugins.forEach(plugin => {
		if (typeof plugin === 'object' && plugin.name) {
			const initPlugin = require(plugin.name);
			initPlugin(core3d, plugin.opts || {});
		} else if (typeof plugin === 'string') {
			const initPlugin = require(plugin);
			initPlugin(core3d, {});
		} else if (typeof plugin === 'function') {
			plugin(core3d);
		}
	});
	
	return core3d;
	
};


let inited = null;
const init = opts => {
	if (inited) {
		return inited;
	}
	inited = _init(opts);
	return inited;
}

module.exports = init;
