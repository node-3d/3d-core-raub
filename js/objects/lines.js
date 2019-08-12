'use strict';

const Cloud = require('./cloud');


class Lines extends Cloud {
	
	
	constructor(opts) {
		
		super(opts);
		
	}
	
	
	buildFrag(opts) {
		return opts.frag || `
			varying vec3  varColor;
			varying vec2  varTcoord;
			varying float varSize;
			
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
				
				gl_FragColor = vec4(varColor, 1.0);
				
				${
					opts.inject && opts.inject.frag && opts.inject.frag.after
						? opts.inject.frag.after
						: ''
				}
				
			}
		`;
	}
	
	
	_build(opts) {
		const Ctor = (() => {
			switch (opts.mode) {
				case 'segments' : return this.screen.three.LineSegments;
				case 'loop' : return this.screen.three.LineLoop;
				default : return this.screen.three.Line;
			}
		})();
		const lines = new Ctor(this._geo(opts), this._mat(opts));
		lines.frustumCulled = false;
		return lines;
	}
	
}


module.exports = Lines;
