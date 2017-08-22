'use strict';

const Cloud = require('./cloud');


class Points extends Cloud {
	
	
	constructor(opts) {
		
		super(opts);
		
	}
	
	
	buildVert(opts) {
		return opts.vert || `
			${opts.attrs.size ? 'attribute float size' : 'float size = 10.0'};
			attribute vec3  color;
			varying   vec3  varColor;
			varying   vec2  varTcoord;
			varying   float varSize;
			
			uniform   float winh;
			
			${opts.inject && opts.inject.vert && opts.inject.vert.vars ? opts.inject.vert.vars : ''}
			
			void main() {
				
				${opts.inject && opts.inject.vert && opts.inject.vert.before ? opts.inject.vert.before : ''}
				
				varColor        = color;
				vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
				gl_Position     = projectionMatrix * mvPosition;
				varSize         = size;
				gl_PointSize    = max(2.0, 2.0 * winh * varSize / length( mvPosition.xyz ));
				varTcoord       = position.xy;
				
				${opts.inject && opts.inject.vert && opts.inject.vert.after ? opts.inject.vert.after : ''}
				
			}
		`;
	}
	
	
	buildFrag(opts) {
		return opts.frag || `
			varying vec3  varColor;
			varying vec2  varTcoord;
			varying float varSize;
			
			${opts.inject && opts.inject.frag && opts.inject.frag.vars ? opts.inject.frag.vars : ''}
			
			void main() {
				
				${opts.inject && opts.inject.frag && opts.inject.frag.before ? opts.inject.frag.before : ''}
				
				float dist = max(0.0, 0.99 - 2.0 * length(gl_PointCoord.xy - vec2(0.5, 0.5)));
				float dist2 = abs(0.3-dist);
				dist = dist*dist;
				dist = max(0.0, min(1.0, dist*100.0) - min(0.3, 0.3-dist2));
				gl_FragColor = vec4(varColor, dist);
				
				// gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
				
				${opts.inject && opts.inject.frag && opts.inject.frag.after ? opts.inject.frag.after : ''}
				
			}
		`;
	}
	
	
}


module.exports = Points;
