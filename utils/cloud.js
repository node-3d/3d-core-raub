'use strict';

const Drawable = require('./drawable');


class Cloud extends Drawable {
	
	/**
	 * Create an instance of Cloud.
	 *
	 * @param opts.screen {Screen} the surface to draw to
	 * @param opts.attrs {Object} input VBO buffers
	 * @param opts.attrs.position {VBO} position buffer
	 * @param opts.attrs.color {VBO} color buffer
	 * @param opts.attrs.EXTRA {VBO} your extra buffers
	 * @param opts.count {Number} number of points to draw
	 *
	 */
	constructor(opts) {
		
		super(opts);
		
		
		
		this._el = opts.data.el;
		
		this._attrs = Object.assign({
			position: 'pos' ,
			color   : 'rgb' ,
		}, opts.attrs || {});
		
		Object.keys(this._attrs).forEach(key => {
			if ( ! this._el.arrs[this._attrs[key]] ) {
				delete this._attrs[key];
			}
		});
		
		this._arrs = Object.keys(this._attrs).map(key => this._el.arrs[this._attrs[key]]);
		
		
	}
	
	
	get color() { return null; }
	set color(v) { v = v; }
	
	
	buildAttr(arr) {
		const ba = new this._screen.three.BufferAttribute(Cloud._dummyArray, arr.size);
		ba.count = this._el.max * arr.size;
		return ba;
	}
	
	
	_geo() {
		
		const geo = new this._screen.three.BufferGeometry();
		geo.computeBoundingSphere = (() => {
			geo.boundingSphere = new this._screen.three.Sphere(undefined, Infinity);
		});
		geo.computeBoundingSphere();
		geo.setDrawRange( 0, 0 );
		
		Object.keys(this._attrs).forEach(key => {
			geo.addAttribute(key, this.buildAttr(this._el.arrs[this._attrs[key]]));
		});
		
		this.unregVbo = this._unregVbo0;
		
		return geo;
		
	}
	
	
	_mat(opts) {
		
		const uniforms = (opts.uniforms || {}, {
			winh: { type: 'f' , value: this._screen.height },
		});
		this._screen.on('resize', wh => uniforms.winh.value = wh.h);
		
		return new this._screen.three.ShaderMaterial({
			
			blending   : 'additive',
			depthTest  : false,
			transparent: true,
			uniforms,
			
			vertexShader  : this.buildVert(opts),
			fragmentShader: this.buildFrag(opts),
			
		});
		
	}
	
	
	buildVert(opts) {
		return opts.vert || `
			attribute vec3  color;
			varying   vec3  varColor;
			
			${opts.inject && opts.inject.vert && opts.inject.vert.vars ? opts.inject.vert.vars : ''}
			
			void main() {
				
				${opts.inject && opts.inject.vert && opts.inject.vert.before ? opts.inject.vert.before : ''}
				
				varColor        = color;
				vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
				gl_Position     = projectionMatrix * mvPosition;
				
				${opts.inject && opts.inject.vert && opts.inject.vert.after ? opts.inject.vert.after : ''}
				
			}
		`;
	}
	
	
	buildFrag(opts) {
		return opts.frag || `
			varying vec3  varColor;
			
			${opts.inject && opts.inject.frag && opts.inject.frag.vars ? opts.inject.frag.vars : ''}
			
			void main() {
				
				${opts.inject && opts.inject.frag && opts.inject.frag.before ? opts.inject.frag.before : ''}
				
				gl_FragColor = vec4(varColor, 1.0);
				
				${opts.inject && opts.inject.frag && opts.inject.frag.after ? opts.inject.frag.after : ''}
				
			}
		`;
	}
	
	
	_build(opts) {
		return new this.three.Mesh(this._geo(opts), this._mat(opts));
	}
	
}

Cloud._dummyArray = new Float32Array(10);

module.exports = Cloud;
