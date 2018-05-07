'use strict';

const { expect } = require('chai');

const node3d = require('3d-core-raub');

const { gl } = node3d;


const classes = {
	
	Image: {
		create() {
			return new node3d.Image();
		},
		props: ['src'],
		methods: ['on'],
	},
	
	Window: {
		create() {
			return new node3d.Window();
		},
		props: ['size'],
		methods: ['show'],
	},
	
	Document: {
		create() {
			return new node3d.Document();
		},
		props: ['body'],
		methods: ['createElement'],
	},
	
	Brush: {
		create() {
			const screen = new node3d.Screen();
			return new node3d.Brush({ screen });
		},
		props: ['size', 'pos', 'visible', 'color'],
		methods: [],
	},
	
	Cloud: {
		create() {
			const screen = new node3d.Screen();
			
			const vertices = [];
			for (let i = 30; i > 0; i--) {
				vertices.push( Math.random() * 2000 - 1000 );
			}
			const pos = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, pos);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
			
			return new node3d.Cloud({ screen, count: 10, attrs: { position: { vbo: pos, items: 3 } } });
		},
		props: ['three', 'screen', 'mat', 'geo', 'mesh', 'visible'],
		methods: [],
	},
	
	Drawable: {
		create() {
			const screen = new node3d.Screen();
			return new node3d.Drawable({ screen });
		},
		props: ['three', 'screen', 'mat', 'geo', 'mesh', 'z', 'visible', 'pos', 'color'],
		methods: [],
	},
	
	Points: {
		create() {
			const screen = new node3d.Screen();
			
			const vertices = [];
			for (let i = 30; i > 0; i--) {
				vertices.push( Math.random() * 2000 - 1000 );
			}
			const pos = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, pos);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
			
			return new node3d.Points({ screen, count: 10, attrs: { position: { vbo: pos, items: 3 } } });
		},
		props: ['three', 'screen', 'mat', 'geo', 'mesh', 'visible'],
		methods: [],
	},
	
	Lines: {
		create() {
			const screen = new node3d.Screen();
			
			const vertices = [];
			for (let i = 30; i > 0; i--) {
				vertices.push( Math.random() * 2000 - 1000 );
			}
			const pos = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, pos);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
			
			return new node3d.Lines({ screen, count: 10, attrs: { position: { vbo: pos, items: 3 } } });
		},
		props: ['three', 'screen', 'mat', 'geo', 'mesh', 'visible'],
		methods: [],
	},
	
	Tris: {
		create() {
			const screen = new node3d.Screen();
			
			const vertices = [];
			for (let i = 30; i > 0; i--) {
				vertices.push( Math.random() * 2000 - 1000 );
			}
			const pos = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, pos);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
			
			return new node3d.Tris({ screen, count: 10, attrs: { position: { vbo: pos, items: 3 } } });
		},
		props: ['three', 'screen', 'mat', 'geo', 'mesh', 'visible'],
		methods: [],
	},
	
	Rect: {
		create() {
			const screen = new node3d.Screen();
			return new node3d.Rect({ screen });
		},
		props: ['three', 'screen', 'mat', 'geo', 'mesh', 'visible'],
		methods: [],
	},
	
	Screen: {
		create() {
			return new node3d.Screen();
		},
		props: [
			'three', 'canvas', 'camera', 'scene', 'renderer', 'context',
			'document', 'width', 'height', 'w', 'h', 'size', 'title', 'fov',
		],
		methods: [],
	},
	
	Surface: {
		create() {
			const screen = new node3d.Screen();
			return new node3d.Surface({ screen });
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
		expect(node3d).to.be.an('object');
	});
	
	
	Object.keys(classes).forEach(
		c => {
			it(`${c} is exported`, () => {
				expect(node3d).to.respondTo(c);
			});
		}
	);
	
	Object.keys(classes).forEach(c => describe(c, () => {
		
		const current = classes[c];
		
		it('can be created', () => {
			expect(current.create()).to.be.an('object');
		});
		
		
		current.props.forEach(prop => {
			it(`#${prop} property exposed`, () => {
				expect(current.create()).to.have.property(prop);
			});
		});
		
		current.methods.forEach(method => {
			it(`#${method}() method exposed`, () => {
				expect(current.create()).to.respondTo(method);
			});
		});
		
	}));
	
});
