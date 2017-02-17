'use strict';

const webgl  = require('node-webgl-raub');
const doc    = webgl.document();

const canvas = doc.createElement('canvas', 800, 600, false);
Object.defineProperty(canvas, 'clientWidth' , { get () { return this.width;  } });
Object.defineProperty(canvas, 'clientHeight', { get () { return this.height; } });

const gl = canvas.getContext('webgl');
if ( ! gl ) {
	throw new Error("Could not initialise WebGL, sorry :-(");
}

// Hack for three.js, force precision
gl.getShaderPrecisionFormat = function() {
	return { precision: 'mediump' };
};

// Hack for three.js, remove precision from shader
var parentShaderSource = gl.shaderSource;
gl.shaderSource = function( shader, string ) {
	string = string.split('\n').filter(function(line){
		return ! line.startsWith("precision");
	}).join('\n');
	
	string = string.replace(/highp\s/g, '');
	string = '#version 120\n' + string.replace(/^.*?\#version.*?$/m, '');
	
	return parentShaderSource(shader, string);
};

gl.viewportWidth = canvas.width;
gl.viewportHeight = canvas.height;

gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.enable(gl.DEPTH_TEST);

global.document = doc;
global.window   = doc;
global.cwrap    = null;

const three = require('node-threejs-raub');


const renderer = new three.WebGLRenderer({
	
	antialias: true,
	canvas   : canvas,
	alpha    : true,
	precision: 'lowp',
	
	premultipliedAlpha    : true,
	preserveDrawingBuffer : true,
	logarithmicDepthBuffer: true,
	
});
renderer.setSize(canvas.width, canvas.height, false);

doc.on('resize', () => {
	gl.viewportWidth = canvas.width;
	gl.viewportHeight = canvas.height;
	renderer.setSize(canvas.width, canvas.height) ;
});

module.exports = {
	webgl,
	doc,
	document: doc,
	canvas,
	gl,
	context: gl,
	three,
	renderer,
	frame: doc.requestAnimationFrame,
	requestAnimationFrame: doc.requestAnimationFrame,
};
