const init = require('../..');
global.self = global;

const { canvas, Image, webgl, doc, window } = init();

global.self.WebGLRenderingContext = webgl.WebGLRenderingContext;
global.self.addEventListener = doc.addEventListener.bind(doc);
global.self.removeEventListener = doc.removeEventListener.bind(doc);
webgl.getContextAttributes = () => ({ stencil: true });
webgl.isContextLost = () => false;
webgl.getInternalformatParameter = () => 1;

Image.prototype.fillRect = () => {};

const createOld = doc.createElement.bind(doc);
doc.createElement = (name) => {
	if (name === 'div' || name === 'a') {
		return { style: {} };
	}
	return createOld(name);
};

Object.defineProperty(Image.prototype, 'onerror', {
	get() { return this.listeners('error'); },
	set(cb) { cb ? this.on('error', cb) : this.removeAllListeners('error'); },
});
Object.defineProperty(Image.prototype, 'onload', {
	get() { return this.listeners('load'); },
	set(cb) { cb ? this.on('load', cb) : this.removeAllListeners('load'); },
});

const enforceF32 = (v) => v instanceof Array ? new Float32Array(v) : v;
const _bufferSubData = webgl.bufferSubData;
webgl.bufferSubData = (target, offset, v) => {
	if (v instanceof ArrayBuffer) {
		v = new Float32Array(v);
	}
	return _bufferSubData(target, offset, enforceF32(v));
};


// based on https://pixijs.io/examples/#/demos-basic/container.js

const PIXI = require('pixi.js');
const app = new PIXI.Application({
	width: 800,
	height: 600,
	backgroundColor: 0x1099bb,
	resolution: window.devicePixelRatio || 1,
	view: canvas,
});

const container = new PIXI.Container();

app.stage.addChild(container);

// Create a new texture
const texture = PIXI.Texture.from('https://pixijs.io/examples/examples/assets/bunny.png');

// Create a 5x5 grid of bunnies
for (let i = 0; i < 25; i++) {
	const bunny = new PIXI.Sprite(texture);
	bunny.anchor.set(0.5);
	bunny.x = (i % 5) * 40;
	bunny.y = Math.floor(i / 5) * 40;
	container.addChild(bunny);
}

// Move container to the center
container.x = app.screen.width / 2;
container.y = app.screen.height / 2;

// Center bunny sprite in local container coordinates
container.pivot.x = container.width / 2;
container.pivot.y = container.height / 2;

// Listen for animate update
app.ticker.add((delta) => {
	// rotate the container!
	// use delta to create frame-independent transform
	container.rotation -= 0.01 * delta;
});
