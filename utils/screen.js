'use strict';

const EventEmitter = require('events');

const core = require('../core');


class Screen extends EventEmitter {
	
	get three()    { return core.three;     }
	get canvas()   { return core.canvas;    }
	get camera()   { return this._camera;   }
	get scene()    { return this._scene;    }
	get renderer() { return this._renderer; }
	get context()  { return core.gl;  }
	get document() { return core.doc; }
	
	
	get width()  { return core.canvas.width;  }
	get height() { return core.canvas.height; }
	get w()      { return this.width;  }
	get h()      { return this.height; }
	get size()   { return new this.three.Vector2(this.width, this.height); }
	
	
	get title()  { return this._title; }
	set title(v) {
		this._title = v || 'Untitled';
		this.document.setTitle(this._title);
	}
	
	get fov()  { return this.camera.fov; }
	set fov(v) {
		this.camera.fov = v;
		this.camera.updateProjectionMatrix();
	}
	
	
	constructor(opts) {
		
		opts = opts || {};
		
		super();
		
		const pathMatch2 = process.mainModule.filename.replace(/\\/g, '/').match(/(\/(.*))*\/(.*?)\/[^\/]*$/);
		const appDir = opts.dir || (pathMatch2 ? pathMatch2[pathMatch2.length - 1] : '');
		
		this._title = opts.title || appDir;
		
		if ( ! opts.camera ) {
			this._camera = new this.three.PerspectiveCamera(27, this.width / this.height, 5, 100000000);
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
			this._renderer = opts.renderer;
		}
		
		this.renderer.setSize(this.width, this.height, false);
		this.renderer.gammaInput  = true;
		
		this.document.on('resize', () => {
			
			this.camera.aspect = this.width / this.height;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize(this.width, this.height, false);
			
			this.emit('resize', { w: this.width, h: this.height });
			
		});
		
		['mousedown', 'mouseup', 'mousemove'].forEach(
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
