'use strict';


const _init = (_opts = {}) => {
	const opts = {
		mode: 'windowed',
		vsync: true,
		webgl: _opts.webgl || require('webgl-raub'),
		Image: _opts.Image || require('image-raub'),
		glfw: _opts.glfw || require('glfw-raub'),
		location: _opts.location || require('./core/location'),
		navigator: _opts.navigator || require('./core/navigator'),
		WebVRManager: _opts.WebVRManager || require('./core/vr-manager'),
		..._opts,
	};
	
	const {
		webgl,
		Image,
		glfw,
		location,
		navigator,
		WebVRManager,
		isWebGL2,
		isGles3,
		isVisible,
		...optsDoc
	} = opts;
	
	const { Document, Window } = glfw;
	
	Document.setWebgl(webgl);
	Document.setImage(Image);
	if (!Image.prototype.fillRect) {
		Image.prototype.fillRect = () => {};
	}
	
	if (isWebGL2) {
		webgl.useWebGL2();
	}
	
	const onBeforeWindow = (window, glfw) => {
		if (isGles3) {
			glfw.windowHint(glfw.OPENGL_PROFILE, glfw.OPENGL_ANY_PROFILE);
			glfw.windowHint(glfw.CONTEXT_VERSION_MAJOR, 3);
			glfw.windowHint(glfw.CONTEXT_VERSION_MINOR, 2);
			glfw.windowHint(glfw.CLIENT_API, glfw.OPENGL_ES_API);
		}
		
		if (isVisible === false) {
			glfw.windowHint(glfw.VISIBLE, glfw.FALSE);
		}
		
		if (optsDoc.onBeforeWindow) {
			optsDoc.onBeforeWindow(window, glfw);
		}
	};
	
	if (!isGles3) {
		const shaderSource = webgl.shaderSource;
		webgl.shaderSource = (shader, code) => shaderSource(
			shader,
			code.replace(
				/^\s*?(#version|precision).*?($|;)/gm, ''
			).replace(
				/^/, '#version 120\n'
			).replace(
				/gl_FragDepthEXT/g, 'gl_FragDepth'
			).replace(
				'#extension GL_EXT_frag_depth : enable', ''
			).replace(
				/\bhighp\s+/g, ''
			)
		);
	}
	
	const doc = new Document({ ...optsDoc, onBeforeWindow });
	
	if (!global.self) {
		global.self = global;
	}
	
	if (!global.globalThis) {
		global.globalThis = global;
	}
	
	global.document = doc;
	global.window = doc;
	global.body = doc;
	global.cwrap = null;
	global.addEventListener = doc.addEventListener.bind(doc);
	global.removeEventListener = doc.removeEventListener.bind(doc);
	global.requestAnimationFrame = doc.requestAnimationFrame;
	global.cancelAnimationFrame = doc.cancelAnimationFrame;
	
	if (!global.location) {
		global.location = location;
	}
	doc.location = global.location;
	
	if (!global.navigator) {
		global.navigator = navigator;
	}
	
	global.WebVRManager = WebVRManager;
	global.Image = Image;
	global._gl = webgl;
	
	webgl.canvas = doc;
	
	const core3d = {
		Image,
		Document,
		Window,
		gl: webgl,
		glfw,
		doc,
		canvas: doc,
		document: doc,
		window: doc,
		loop: doc.loop,
		requestAnimationFrame : doc.requestAnimationFrame,
		addThreeHelpers,
		...require('./math'),
		...require('./objects'),
	};
	
	return core3d;
};


let inited = null;
const init = (opts) => {
	if (inited) {
		return inited;
	}
	inited = _init(opts);
	return inited;
};

const addThreeHelpers = (three, webgl) => {
	require('./core/threejs-helpers')(three, webgl);
};

module.exports = {
	init,
	addThreeHelpers,
};
