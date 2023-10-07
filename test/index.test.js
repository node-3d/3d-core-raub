'use strict';

const assert = require('node:assert').strict;
const { describe, it } = require('node:test');

const three = require('three');
const { init } = require('..');

const inited = init();
const {
	gl, Document, Window, Image,
	Brush, Cloud, Drawable, Lines, Points, Rect, Screen, Surface, Tris,
} = inited;


const staticClasses = {
	Brush: {
		create({ screen }) {
			return new Brush({ screen });
		},
		props: ['size', 'pos', 'visible', 'color'],
		methods: [],
	},
	Cloud: {
		create({ screen }) {
			const vertices = [];
			for (let i = 30; i > 0; i--) {
				vertices.push( Math.random() * 2000 - 1000 );
			}
			const pos = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, pos);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
			
			return new Cloud({ screen, count: 10, attrs: { position: { vbo: pos, items: 3 } } });
		},
		props: ['three', 'screen', 'mat', 'geo', 'mesh', 'visible'],
		methods: [],
	},
	Drawable: {
		create({ screen }) {
			return new Drawable({ screen });
		},
		props: ['three', 'screen', 'mat', 'geo', 'mesh', 'z', 'visible', 'pos', 'color'],
		methods: [],
	},
	Points: {
		create({ screen }) {
			const vertices = [];
			for (let i = 30; i > 0; i--) {
				vertices.push( Math.random() * 2000 - 1000 );
			}
			const pos = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, pos);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
			
			return new Points({ screen, count: 10, attrs: { position: { vbo: pos, items: 3 } } });
		},
		props: ['three', 'screen', 'mat', 'geo', 'mesh', 'visible'],
		methods: [],
	},
	Lines: {
		create({ screen }) {
			const vertices = [];
			for (let i = 30; i > 0; i--) {
				vertices.push( Math.random() * 2000 - 1000 );
			}
			const pos = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, pos);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
			
			return new Lines({ screen, count: 10, attrs: { position: { vbo: pos, items: 3 } } });
		},
		props: ['three', 'screen', 'mat', 'geo', 'mesh', 'visible'],
		methods: [],
	},
	Tris: {
		create({ screen }) {
			const vertices = [];
			for (let i = 30; i > 0; i--) {
				vertices.push( Math.random() * 2000 - 1000 );
			}
			const pos = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, pos);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
			
			return new Tris({ screen, count: 10, attrs: { position: { vbo: pos, items: 3 } } });
		},
		props: ['three', 'screen', 'mat', 'geo', 'mesh', 'visible'],
		methods: [],
	},
	Rect: {
		create({ screen }) {
			return new Rect({ screen });
		},
		props: ['three', 'screen', 'mat', 'geo', 'mesh', 'visible'],
		methods: [],
	},
	Screen: {
		create() {
			return new Screen({ three });
		},
		props: [
			'three', 'canvas', 'camera', 'scene', 'renderer', 'context',
			'document', 'width', 'height', 'w', 'h', 'size', 'title', 'fov',
		],
		methods: [],
	},
	Surface: {
		create({ screen }) {
			return new Surface({ screen });
		},
		props: [
			'canvas', 'camera', 'scene', 'renderer', 'context',
			'document', 'title', 'fov', 'size', 'texture'
		],
		methods: [],
	},
};


const initedClasses = {
	Image: {
		create() {
			return new Image();
		},
		props: ['src'],
		methods: ['on'],
	},
	
	Window: {
		create() {
			return new Window();
		},
		props: ['size'],
		methods: ['show'],
	},
	
	Document: {
		create() {
			return new Document();
		},
		props: ['body'],
		methods: ['createElement'],
	},
};

describe('Node.js 3D Core', () => {
	it('exports an object', () => {
		assert.strictEqual(typeof inited, 'object');
	});
	
	describe('Static classes', () => {
		Object.keys(staticClasses).forEach(
			(c) => {
				it(`${c} is exported`, () => {
					assert.strictEqual(typeof inited[c], 'function');
				});
			}
		);
		
		const screen = new Screen({ three });
		
		Object.keys(staticClasses).forEach((c) => describe(c, () => {
			const current = staticClasses[c];
			const instance = current.create({ screen });
			
			it('can be created', () => {
				assert.strictEqual(instance instanceof inited[c], true);
			});
			
			current.props.forEach((prop) => {
				it(`#${prop} property exposed`, () => {
					assert.strictEqual(instance[prop] !== undefined, true);
				});
			});
			
			current.methods.forEach((method) => {
				it(`#${method}() method exposed`, () => {
					assert.strictEqual(typeof instance[method], 'function');
				});
			});
		}));
	});
	
	describe('Inited classes', () => {
		Object.keys(initedClasses).forEach(
			(c) => {
				it(`${c} is exported`, () => {
					assert.strictEqual(typeof inited[c], 'function');
				});
			}
		);
		
		Object.keys(initedClasses).forEach((c) => describe(c, () => {
			const current = initedClasses[c];
			const instance = current.create();
			
			it('can be created', () => {
				assert.strictEqual(instance instanceof inited[c], true);
			});
		}));
	});
});
