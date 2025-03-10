'use strict';

const assert = require('node:assert').strict;
const { describe, it } = require('node:test');
const three = require('three');

const inited = require('./init');
const {
	gl, Brush, Cloud, Drawable, Lines, Points, Rect, Screen, Surface, Tris,
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
				assert.ok(instance instanceof inited[c]);
			});
			
			current.props.forEach((prop) => {
				it(`#${prop} property exposed`, () => {
					assert.ok(instance[prop] !== undefined);
				});
			});
			
			current.methods.forEach((method) => {
				it(`#${method}() method exposed`, () => {
					assert.strictEqual(typeof instance[method], 'function');
				});
			});
		}));
	});
});
