'use strict';

const Rect = require('./rect');

class Overlay extends Rect {
	
	get width()  { return this._screen.width;  }
	get height() { return this._screen.height; }
	
	
	get size() { return this._size.xy.copy([this.width, this.height]); }
	set size(p) { p = p; }
	
	constructor(opts) {
		
		super(opts);
		
	}
	
	_geo() {
		return new this._screen.three.PlaneBufferGeometry(2, 2);
	}
	
	_mat(opts) {
		
		return new this._screen.three.ShaderMaterial({
			
			side: this._screen.three.DoubleSide,
			
			uniforms      : { type: 't', t: { value: opts.texture } },
			
			vertexShader  : `
				varying vec2 tc;
				void main() {
					tc = uv;
					gl_Position = vec4(position.xyz, 1.0);
				}
			`,
			
			fragmentShader: `
				varying vec2 tc;
				uniform sampler2D t;
				void main() {
					gl_FragColor = texture2D(t, tc);
				}
			`,
			
			blending   : 'additive',
			depthTest  : false,
			transparent: true,
			
		});
	}
	
	// _build(opts) {
	// 	return new this._screen.three.Mesh(this._geo(opts), this._mat(opts));
	// }
	
}

module.exports = Overlay;
