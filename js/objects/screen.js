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
				this._camera = new this._three.OrthographicCamera(
					-this.w * 0.5, this.w * 0.5,
					this.h * 0.5, -this.h * 0.5,
					near ?? -10, far ?? 10,
				);
				this._camera.position.z = z ?? 5;
			} else {
				this._camera = new this._three.PerspectiveCamera(
					fov ?? 90, this.w / this.h, near ?? 0.1, far ?? 200,
				);
				this._camera.position.z = z ?? 10;
			}
		} else {
			this._camera = opts.camera;
		}
		
		if (!opts.scene) {
			this._scene = new this._three.Scene();
		} else {
			this._scene = opts.scene;
		}
		
		if (opts.renderer) {
			this._autoRenderer = false;
			this._renderer = opts.renderer;
		}
		this._reinitRenderer();
		
		this._renderer.setSize(this._doc.width, this._doc.height, false);
		
		this._doc.on('mode', (e) => {
			this._reinitRenderer();
			this.emit('mode', e);
		});
		
		this._doc.on('resize', ({ width, height }) => {
			width = width || 16;
			height = height || 16;
			
			this._camera.aspect = width / height;
			this._camera.updateProjectionMatrix();
			this._renderer.setSize(width, height, false);
			
			this.emit('resize', { width, height });
		});
		
		['keydown', 'keyup', 'mousedown', 'mouseup', 'mousemove','mousewheel'].forEach(
			(type) => this._doc.on(type, (e) => this.emit(type, e))
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
	get w() { return this._doc.width; }
	get h() { return this._doc.height; }
	get size() { return new this._three.Vector2(this.w, this.h); }
	
	get title() { return this._doc.title; }
	set title(v) { this._doc.title = v || 'Untitled'; }
	
	get icon() { return this._doc.icon; }
	set icon(v) { this._doc.icon = v || null; }
	
	get fov() { return this._camera.fov; }
	set fov(v) {
		this._camera.fov = v;
		this._camera.updateProjectionMatrix();
	}
	
	get mode() { return this._doc.mode; }
	set mode(v) { this._doc.mode = v; }
	
	draw() {
		this._renderer.render(this._scene, this._camera);
	}
	
	
	snapshot(name = `${Date.now()}.jpg`) {
		const memSize = this.w * this.h * 4; // estimated number of bytes
		const storage = { data: Buffer.allocUnsafeSlow(memSize) };
		
		this._gl.readPixels(
			0, 0, this.w, this.h, this._gl.RGBA, this._gl.UNSIGNED_BYTE, storage,
		);
		
		const img = this._Image.fromPixels(this.w, this.h, 32, storage.data);
		img.save(name);
	}
	
	static _deepAssign(src, dest) {
		Object.entries(src).forEach(([k, v]) => {
			if (v && typeof v === 'object') {
				Screen._deepAssign(v, dest[k]);
				return;
			}
			dest[k] = v;
		});
	}
	
	// When switching from fullscreen and back, reset renderer to update VAO/FBO objects
	_reinitRenderer() {
		const old = this._renderer;
		
		// Migrate renderer props
		const renderProps = !old ? null : {
			shadowMap: {
				enabled: old.shadowMap.enabled,
				type: old.shadowMap.type,
			},
			debug: {
				checkShaderErrors: old.debug_checkShaderErrors,
				onShaderError: old.debug_onShaderError,
			},
			autoClear: old.autoClear,
			autoClearColor: old.autoClearColor,
			autoClearDepth: old.autoClearDepth,
			autoClearStencil: old.autoClearStencil,
			clippingPlanes: old.clippingPlanes,
			outputColorSpace: old.outputColorSpace,
			sortObjects: old.sortObjects,
			toneMapping: old.toneMapping,
			toneMappingExposure: old.toneMappingExposure,
			transmissionResolutionScale: old.transmissionResolutionScale,
		};
		if (this._autoRenderer) {
			old.dispose();
		}
		
		this._autoRenderer = true;
		this._renderer = new this._three.WebGLRenderer({
			context: this._gl,
			canvas: this.canvas,
		});
		
		this._camera.aspect = this.w / this.h;
		this._camera.updateProjectionMatrix();
		this._renderer.setSize(this.w, this.h, false);
		
		if (renderProps) {
			Screen._deepAssign(renderProps, this._renderer);
		}
		
		this._gl.enable(0x8861); // GL_POINT_SPRITE 0x8861
		this._gl.enable(0x8642); // GL_VERTEX_PROGRAM_POINT_SIZE
		this._gl.enable(0x8862); // GL_COORD_REPLACE
	}
}

module.exports = Screen;
