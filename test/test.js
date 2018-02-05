'use strict';

const { expect } = require('chai');

const node3d = require('3d-core-raub');


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
			return new node3d.Brush();
		},
		props: ['gravity'],
		methods: ['update', 'hit', 'trace', 'destroy'],
	},
	
	Cloud: {
		create() {
			return new node3d.Cloud();
		},
		props: ['size', 'pos', 'visible', 'color'],
		methods: [],
	},
	
	Drawable: {
		create() {
			return new node3d.Drawable();
		},
		props: ['three', 'screen', 'mat', 'geo', 'mesh', 'z', 'visible', 'pos', 'color'],
		methods: [],
	},
	
	Points: {
		create() {
			return new node3d.Points();
		},
		props: ['gravity'],
		methods: ['three', 'screen', 'mat', 'geo', 'mesh', 'visible'],
	},
	
	Lines: {
		create() {
			return new node3d.Lines();
		},
		props: ['gravity'],
		methods: ['three', 'screen', 'mat', 'geo', 'mesh', 'visible'],
	},
	
	Tris: {
		create() {
			return new node3d.Tris();
		},
		props: ['gravity'],
		methods: ['three', 'screen', 'mat', 'geo', 'mesh', 'visible'],
	},
	
	Rect: {
		create() {
			return new node3d.Rect();
		},
		props: ['gravity'],
		methods: ['three', 'screen', 'mat', 'geo', 'mesh', 'visible'],
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
			return new node3d.Surface();
		},
		props: [
			'canvas', 'camera', 'scene', 'renderer', 'context',
			'document', 'title', 'fov', 'size', 'texture'
		],
		methods: [],
	},
	

};


describe('Node.js 3D Core', () => {
	
	it(`exports an object`, () => {
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
		
		it(`can be created`, () => {
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
