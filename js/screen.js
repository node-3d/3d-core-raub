'use strict';

const EventEmitter = require('events');

const { three, gl, doc } = require('../core');


class Screen extends EventEmitter {
	
	get context() { return gl; }
	get three() { return three; }
	
	get renderer() { return this._renderer; }
	get scene() { return this._scene; }
	get camera() { return this._camera; }
	
	get document() { return this._doc; }
	get canvas() { return this._doc; }
	
	get width() { return this._doc.width; }
	get height() { return this._doc.height; }
	get w() { return this.width; }
	get h() { return this.height; }
	get size() { return new three.Vector2(this.width, this.height); }
	
	
	get title() { return this._doc._title; }
	set title(v) {
		this._doc.title = v || 'Untitled';
	}
	
	get icon() { return this._doc._icon; }
	set icon(v) {
		this._doc.icon = v || null;
	}
	
	get fov() { return this._camera.fov; }
	set fov(v) {
		this._camera.fov = v;
		this._camera.updateProjectionMatrix();
	}
	
	get mode() { return this._doc._mode; }
	set mode(v) {
		
		if (this._doc.mode === v) {
			return;
		}
		
		this._doc.mode = v;
		
		if (this._autoRenderer) {
			this._renderer.dispose();
		}
		
		this._autoRenderer = true;
		this._renderer = new three.WebGLRenderer({
			
			context   : gl,
			antialias : true,
			canvas    : this._doc,
			alpha     : true,
			
			premultipliedAlpha     : true,
			preserveDrawingBuffer  : true,
			logarithmicDepthBuffer : true,
			
		});
		
	}
	
	
	constructor(opts = {}) {
		
		super();
		
		this._doc = opts.doc || doc;
		
		const pathMatch2 = process.mainModule.filename.replace(/\\/g, '/').match(/(\/(.*))*\/(.*?)\/[^/]*$/);
		const appDir = opts.dir || (pathMatch2 ? pathMatch2[pathMatch2.length - 1] : '');
		
		this.title = opts.title || appDir;
		
		if ( ! opts.camera ) {
			this._camera = new this.three.PerspectiveCamera(45, this.width / this.height, 5, 100000000);
			this._camera.position.z = 1000;
		} else {
			this._camera = opts.camera;
		}
		
		if ( ! opts.scene ) {
			this._scene = new this.three.Scene();
		} else {
			this._scene = opts.scene;
		}
		
		
		if ( ! opts.renderer ) {
			this._autoRenderer = true;
			this._renderer = new this.three.WebGLRenderer({
				
				context   : this.context,
				antialias : true,
				canvas    : this.canvas,
				alpha     : true,
				
				premultipliedAlpha     : true,
				preserveDrawingBuffer  : true,
				logarithmicDepthBuffer : true,
				
			});
		} else {
			this._autoRenderer = false;
			this._renderer = opts.renderer;
		}
		
		this.renderer.setSize(this._doc.width, this._doc.height, false);
		this.renderer.gammaInput = true;
		
		this.document.on('resize', ({ width, height }) => {
			
			width = width || 1;
			height = height || 1;
			
			this.camera.aspect = width / height;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize(width, height, false);
			
			this.emit('resize', { width, height });
			
		});
		
		['keydown', 'keyup', 'mousedown', 'mouseup', 'mousemove','mousewheel'].forEach(
			type => this.document.on(type, e => this.emit(type, e))
		);
		
		this.context.enable(0x8861); // GL_POINT_SPRITE 0x8861
		this.context.enable(0x8642); // GL_VERTEX_PROGRAM_POINT_SIZE
		//gl.enable(0x8862);
		
		this.draw();
		
	}
	
	
	draw() {
		this.renderer.render(this.scene, this.camera);
	}
	
}

module.exports = Screen;
