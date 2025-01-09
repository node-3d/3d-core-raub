'use strict';

const EventEmitter = require('events');


class Screen extends EventEmitter {
	constructor(opts = {}) {
		super();
		
		this._three = opts.three || opts.THREE || global.THREE;
		this._gl = opts.gl || global._gl;
		this._doc = opts.doc || opts.document || global.document;
		this._Image = opts.Image || global.Image;
		
		if (opts.title) {
			this.title = opts.title;
		}
		
		if (!opts.camera) {
			const { fov, near, far, z } = opts;
			if (fov === 0) {
				this._camera = new this.three.OrthographicCamera(
					-this.width * 0.5, this.width * 0.5,
					this.height * 0.5, -this.height * 0.5,
					near ?? -10, far ?? 10,
				);
				this._camera.position.z = z ?? 5;
			} else {
				this._camera = new this.three.PerspectiveCamera(
					fov ?? 90, this.width / this.height, near ?? 0.1, far ?? 200,
				);
				this._camera.position.z = z ?? 10;
			}
		} else {
			this._camera = opts.camera;
		}
		
		if (!opts.scene) {
			this._scene = new this.three.Scene();
		} else {
			this._scene = opts.scene;
		}
		
		if (!opts.renderer) {
			this._reinitRenderer();
		} else {
			this._autoRenderer = false;
			this._renderer = opts.renderer;
			this.context.enable(0x8861); // GL_POINT_SPRITE 0x8861
			this.context.enable(0x8642); // GL_VERTEX_PROGRAM_POINT_SIZE
			this.context.enable(0x8862); // GL_COORD_REPLACE
		}
		
		this.renderer.setSize(this._doc.width, this._doc.height, false);
		
		this.document.on('mode', () => {
			this._reinitRenderer();
		});
		
		this.document.on('resize', ({ width, height }) => {
			width = width || 16;
			height = height || 16;
			
			this.camera.aspect = width / height;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize(width, height, false);
			
			this.emit('resize', { width, height });
		});
		
		['keydown', 'keyup', 'mousedown', 'mouseup', 'mousemove','mousewheel'].forEach(
			(type) => this.document.on(type, (e) => this.emit(type, e))
		);
		
		this.draw();
	}
	
	get context() { return this._gl; }
	get three() { return this._three; }
	
	get renderer() { return this._renderer; }
	get scene() { return this._scene; }
	get camera() { return this._camera; }
	
	get document() { return this._doc; }
	get canvas() { return this._doc; }
	
	get width() { return this._doc.width; }
	get height() { return this._doc.height; }
	get w() { return this.width; }
	get h() { return this.height; }
	get size() { return new this.three.Vector2(this.width, this.height); }
	
	get title() { return this._doc.title; }
	set title(v) { this._doc.title = v || 'Untitled'; }
	
	get icon() { return this._doc.icon; }
	set icon(v) { this._doc.icon = v || null; }
	
	get fov() { return this._camera.fov; }
	set fov(v) {
		this._camera.fov = v;
		this._camera.updateProjectionMatrix();
	}
	
	get mode() { return this._doc._mode; }
	set mode(v) { this._doc.mode = v; }
	
	draw() {
		this._renderer.render(this.scene, this.camera);
	}
	
	
	snapshot(name = `${Date.now()}.jpg`) {
		const memSize = this.w * this.h * 4; // estimated number of bytes
		const storage = { data: Buffer.allocUnsafeSlow(memSize) };
		
		this.context.readPixels(
			0, 0, this.w, this.h, this.context.RGBA, this.context.UNSIGNED_BYTE, storage,
		);
		
		const img = this._Image.fromPixels(this.w, this.h, 32, storage.data);
		img.save(name);
	}
	
	// When switching from fullscreen and back, reset renderer to update VAO/FBO objects
	_reinitRenderer() {
		if (this._autoRenderer) {
			this._renderer.dispose();
		}
		
		this._autoRenderer = true;
		this._renderer = new this.three.WebGLRenderer({
			context: this.context,
			antialias: true,
			canvas: this.canvas,
			alpha: true,
			
			premultipliedAlpha: true,
			preserveDrawingBuffer: true,
			logarithmicDepthBuffer: true,
		});
		
		this._camera.aspect = this.width / this.height;
		this._camera.updateProjectionMatrix();
		this._renderer.setSize(this.width, this.height, false);
		this.context.enable(0x8861); // GL_POINT_SPRITE 0x8861
		this.context.enable(0x8642); // GL_VERTEX_PROGRAM_POINT_SIZE
		this.context.enable(0x8862); // GL_COORD_REPLACE
	}
}

module.exports = Screen;
