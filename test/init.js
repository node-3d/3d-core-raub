const { platform } = require('node:process');
const three = require('three');
const glfw = require('glfw-raub');

const { init, addThreeHelpers } = require('..');

const initOpts = {
	isGles3: true,
	isWebGL2: true,
};
const initOptsMac = {
	...initOpts,
	isGles3: false,
	isWebGL2: false,
	major: 2,
	minor: 1,
};

if (platform === 'darwin') {
	glfw.windowHint(glfw.STENCIL_BITS, 8);
	// this would be nice... - https://github.com/glfw/glfw/pull/2571
	// glfw.windowHint(glfw.CONTEXT_RENDERER, glfw.SOFTWARE_RENDERER);
}

const inited = init(platform === 'darwin' ? initOptsMac : initOpts);
addThreeHelpers(three, inited.gl);

module.exports = inited;
