'use strict';

const init = require('..');


const inited = init();
// const {
// 	gl, // three, Document, Window, Image,
// 	Brush, Cloud, Drawable, Lines, Points, Rect, Screen, Surface, Tris,
// } = inited;


// const staticClasses = {
	
// 	Brush: {
// 		create({ screen }) {
// 			return new Brush({ screen });
// 		},
// 		props: ['size', 'pos', 'visible', 'color'],
// 		methods: [],
// 	},
	
// 	Cloud: {
// 		create({ screen }) {
			
// 			const vertices = [];
// 			for (let i = 30; i > 0; i--) {
// 				vertices.push( Math.random() * 2000 - 1000 );
// 			}
// 			const pos = gl.createBuffer();
// 			gl.bindBuffer(gl.ARRAY_BUFFER, pos);
// 			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
			
// 			return new Cloud({ screen, count: 10, attrs: { position: { vbo: pos, items: 3 } } });
// 		},
// 		props: ['three', 'screen', 'mat', 'geo', 'mesh', 'visible'],
// 		methods: [],
// 	},
	
// 	Drawable: {
// 		create({ screen }) {
// 			return new Drawable({ screen });
// 		},
// 		props: ['three', 'screen', 'mat', 'geo', 'mesh', 'z', 'visible', 'pos', 'color'],
// 		methods: [],
// 	},
	
// 	Points: {
// 		create({ screen }) {
			
// 			const vertices = [];
// 			for (let i = 30; i > 0; i--) {
// 				vertices.push( Math.random() * 2000 - 1000 );
// 			}
// 			const pos = gl.createBuffer();
// 			gl.bindBuffer(gl.ARRAY_BUFFER, pos);
// 			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
			
// 			return new Points({ screen, count: 10, attrs: { position: { vbo: pos, items: 3 } } });
// 		},
// 		props: ['three', 'screen', 'mat', 'geo', 'mesh', 'visible'],
// 		methods: [],
// 	},
	
// 	Lines: {
// 		create({ screen }) {
			
// 			const vertices = [];
// 			for (let i = 30; i > 0; i--) {
// 				vertices.push( Math.random() * 2000 - 1000 );
// 			}
// 			const pos = gl.createBuffer();
// 			gl.bindBuffer(gl.ARRAY_BUFFER, pos);
// 			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
			
// 			return new Lines({ screen, count: 10, attrs: { position: { vbo: pos, items: 3 } } });
// 		},
// 		props: ['three', 'screen', 'mat', 'geo', 'mesh', 'visible'],
// 		methods: [],
// 	},
	
// 	Tris: {
// 		create({ screen }) {
			
// 			const vertices = [];
// 			for (let i = 30; i > 0; i--) {
// 				vertices.push( Math.random() * 2000 - 1000 );
// 			}
// 			const pos = gl.createBuffer();
// 			gl.bindBuffer(gl.ARRAY_BUFFER, pos);
// 			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
			
// 			return new Tris({ screen, count: 10, attrs: { position: { vbo: pos, items: 3 } } });
// 		},
// 		props: ['three', 'screen', 'mat', 'geo', 'mesh', 'visible'],
// 		methods: [],
// 	},
	
// 	Rect: {
// 		create({ screen }) {
// 			return new Rect({ screen });
// 		},
// 		props: ['three', 'screen', 'mat', 'geo', 'mesh', 'visible'],
// 		methods: [],
// 	},
	
// 	Screen: {
// 		create() {
// 			return new Screen();
// 		},
// 		props: [
// 			'three', 'canvas', 'camera', 'scene', 'renderer', 'context',
// 			'document', 'width', 'height', 'w', 'h', 'size', 'title', 'fov',
// 		],
// 		methods: [],
// 	},
	
// 	Surface: {
// 		create({ screen }) {
// 			return new Surface({ screen });
// 		},
// 		props: [
// 			'canvas', 'camera', 'scene', 'renderer', 'context',
// 			'document', 'title', 'fov', 'size', 'texture'
// 		],
// 		methods: [],
// 	},
	

// };


// const initedClasses = {
	
// 	Image: {
// 		create() {
// 			return new Image();
// 		},
// 		props: ['src'],
// 		methods: ['on'],
// 	},
	
// 	Window: {
// 		create() {
// 			return new Window();
// 		},
// 		props: ['size'],
// 		methods: ['show'],
// 	},
	
// 	Document: {
// 		create() {
// 			return new Document();
// 		},
// 		props: ['body'],
// 		methods: ['createElement'],
// 	},
	
// };


describe('Node.js 3D Core', () => {
	
	it('exports an object', () => {
		expect(typeof inited).toBe('object');
	});
	
	
	// describe('Static classes', () => {
		
	// 	Object.keys(staticClasses).forEach(
	// 		c => {
	// 			it(`${c} is exported`, () => {
	// 				expect(typeof inited[c]).toBe('function');
	// 			});
	// 		}
	// 	);
		
	// 	const screen = new Screen();
		
	// 	Object.keys(staticClasses).forEach(c => describe(c, () => {
			
	// 		const current = staticClasses[c];
	// 		const instance = current.create({ screen });
			
	// 		it('can be created', () => {
	// 			expect(instance).toBeInstanceOf(inited[c]);
	// 		});
			
			
	// 		current.props.forEach(prop => {
	// 			it(`#${prop} property exposed`, () => {
	// 				expect(instance).toHaveProperty(prop);
	// 			});
	// 		});
			
	// 		current.methods.forEach(method => {
	// 			it(`#${method}() method exposed`, () => {
	// 				expect(typeof instance[method]).toBe('function');
	// 			});
	// 		});
			
	// 	}));
		
	// });
	
	
	// describe('Inited classes', () => {
		
	// 	Object.keys(initedClasses).forEach(
	// 		c => {
	// 			it(`${c} is exported`, () => {
	// 				expect(typeof inited[c]).toBe('function');
	// 			});
	// 		}
	// 	);
		
	// 	Object.keys(initedClasses).forEach(c => describe(c, () => {
			
	// 		const current = initedClasses[c];
	// 		const instance = current.create();
			
	// 		it('can be created', () => {
	// 			expect(instance).toBeInstanceOf(inited[c]);
	// 		});
			
	// 	}));
		
	// });
	
	// it('converts a non-pow2 texture', () => {
	// 	const screen = new Screen();
	// 	const texture = new three.TextureLoader().load( __dirname + '/freeimage.jpg' );
	// 	const geometry = new three.BoxBufferGeometry(200, 200, 200);
	// 	const material = new three.MeshBasicMaterial({ map: texture });
	// 	const mesh = new three.Mesh(geometry, material);
	// 	screen.scene.add(mesh);
	// 	screen.draw();
	// 	expect(typeof mesh).toBe('object');
	// });
	
});
