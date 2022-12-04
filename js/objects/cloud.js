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
	}
	
	
	get color() { return null; }
	set color(v) { v = null; }
	
	
	buildAttr(source, count) {
		return new this.screen.three.GLBufferAttribute(
			source.vbo,
			this.screen.context.FLOAT,
			source.items,
			4,
			count
		);
	}
	
	
	_geo(opts) {
		const geo = new this.screen.three.BufferGeometry();
		
		Object.keys(opts.attrs).forEach((key) => {
			geo.setAttribute(key, this.buildAttr(opts.attrs[key], opts.count));
		});
		
		return geo;
	}
	
	
	_mat(opts) {
		const uniforms = {
			...(opts.uniforms || null),
			winh : { type: 'f' , value: this.screen.height },
		};
		
		this.screen.on('resize', ({ height }) => uniforms.winh.value = height);
		
		return new this.screen.three.ShaderMaterial({
			
			blending    : this.screen.three.NormalBlending,
			depthTest   : opts.depthTest === true,
			transparent : true,
			uniforms,
			
			vertexShader   : this.buildVert(opts),
			fragmentShader : this.buildFrag(opts),
			
		});
	}
	
	
	buildVert(opts) {
		return opts.vert || `
			attribute vec3  color;
			varying   vec3  varColor;
			
			${
	opts.inject && opts.inject.vert && opts.inject.vert.vars
		? opts.inject.vert.vars
		: ''
}
			
			void main() {
				
				${
	opts.inject && opts.inject.vert && opts.inject.vert.before
		? opts.inject.vert.before
		: ''
}
				
				varColor        = color;
				vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
				gl_Position     = projectionMatrix * mvPosition;
				
				${
	opts.inject && opts.inject.vert && opts.inject.vert.after
		? opts.inject.vert.after
		: ''
}
				
			}
		`;
	}
	
	
	buildFrag(opts) {
		return opts.frag || `
			varying vec3  varColor;
			
			${
	opts.inject && opts.inject.frag && opts.inject.frag.vars
		? opts.inject.frag.vars
		: ''
}
			
			void main() {
				
				${
	opts.inject && opts.inject.frag && opts.inject.frag.before
		? opts.inject.frag.before
		: ''
}
				
				// gl_FragColor = vec4(varColor, 1.0);
				gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
				
				${
	opts.inject && opts.inject.frag && opts.inject.frag.after
		? opts.inject.frag.after
		: ''
}
				
			}
		`;
	}
	
	
	_build(opts) {
		const points = new this.screen.three.Points(this._geo(opts), this._mat(opts));
		points.frustumCulled = false;
		return points;
	}
}


module.exports = Cloud;
