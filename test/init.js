const three = require('three');

const { init, addThreeHelpers } = require('..');

const inited = init({
	isGles3: true,
	isWebGL2: true,
});
addThreeHelpers(three, inited.gl);

module.exports = inited;
