'use strict';

const Drawable = require('./drawable');
const Vec2     = require('./math/vec2');


class Rect extends Drawable {
	
	
	constructor(opts) {
		
		super(opts);
		
		this._size   = opts.size || new Vec2(100, 100);
		this._radius = opts.radius || 0;
		
	}
	
	
	_build(opts) {
		return new this.three[opts.wire ? 'Line' : 'Mesh'](this._geo(opts), this._mat(opts));
	}
	
	
	_mat(opts) {
		
		const matName = opts.wire ? 'LineBasicMaterial' : 'MeshBasicMaterial';
		const matOpts = {
			transparent: true,
			side       : this.three.DoubleSide,
			depthWrite : false,
			depthTest  : false,
		};
		
		if (opts.wire) {
			matOpts.linewidth = 1;
		}
		
		return new this.three[matName](matOpts);
		
	}
	
	
	get size() { return this._size.xy; }
	set size(p) {
		this._size.xy = p;
		this.updateGeo();
	}
	
	
	get width()  { return this._size.x; }
	get height() { return this._size.y; }
	
	
	get w()  { return this._size.x; }
	get h() { return this._size.y; }
	
	
	get radius() { return this._radius; }
	set radius(v) {
		this._radius = v;
		this.updateGeo();
	}
	
	
	_geo(opts) {
		var geometry = null;
		
		const size = opts.size || new Vec2(100, 100);
		
		const
			r = opts.radius || 0,
			w = size.x,
			h = size.y;
		
		if (r) {
			
			// Rounded rectangle
			const shape = new this.three.Shape();
			
			shape.moveTo( 0, r );
			shape.lineTo( 0, h - r );
			shape.quadraticCurveTo( 0, h, r, h );
			
			shape.lineTo( w - r, h) ;
			shape.quadraticCurveTo( w, h, w, h - r );
			
			shape.lineTo( w, r );
			shape.quadraticCurveTo( w, 0, w - r, 0 );
			
			shape.lineTo( r, 0 );
			shape.quadraticCurveTo( 0, 0, 0, r );
			
			geometry =  new this.three.ShapeGeometry(shape);
			
			geometry.translate(-w * 0.5, -h * 0.5, 0);
			geometry.rotateX(Math.PI);
			geometry.translate(w * 0.5, h * 0.5, 0);
			
		} else {
			geometry = new this.three.PlaneBufferGeometry(w, h);
			geometry.rotateX(Math.PI);
			geometry.translate(w * 0.5, h * 0.5, 0);
		}
		geometry.computeBoundingBox();
		
		return geometry;
	}
	
	
}

module.exports = Rect;
