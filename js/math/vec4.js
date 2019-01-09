'use strict';

const Vec3 = require('./vec3');
const Vec2 = require('./vec2');

/**
 * Four-dimensional vector.
 * @note All 'ed() methods modify **INPLACE**, no-'ed methods - **MAKE A COPY**
 * @author Luis Blanco
 * @extends Vec3
 */
class Vec4 extends Vec3 {
	
	/**
	 * @constructs Vec4
	 * @desc Takes four numbers, or single array, or an object with `.x`, `.y`, `.z`, and `.w` properties.
	 * - If no arguments passed, constructs `Vec4(0, 0, 0, 0)`.
	 * - If only one number is given, constructs `Vec4(x, x, x, x)`.
	 * - If only two numbers are given, constructs `Vec4(x, x, x, y)`.
	 * @arg {number|number[]|object} [x=0]
	 * @arg {Number} [y=0]
	 * @arg {Number} [z=0]
	 * @arg {Number} [w=0]
	 */
	constructor(x, y, z, w) {
		
		const args = arguments;
		
		super(x, y, z);
		
		this.w = 1;
		
		if ( ! args.length ) {
			return;
		}
		
		if (typeof args[0] === 'object') {
			
			if (args[0] === null) {
				return;
			}
			
			// [] or {} or Vec2
			if (args[0].constructor === Array || args[0].constructor === Vec4) {
				this.w = args[0][3];
			} else if (typeof args[0].w === 'number') {
				this.w = args[0].w;
			} else if (args[0].constructor === Vec3) {
				this.w = args[1];
			} else if (args[0].constructor === Vec2) {
				if (
					args[1].constructor === Array ||
					args[1].constructor === Vec2 ||
					args[1].constructor === Vec3
				) {
					this.w = args[1][1];
				} else if (typeof args[1] === 'number') {
					this.w = args[1];
				}
			}
			
		} else if (typeof args[0] === 'number') {
			
			if (isNaN(args[0])) {
				return;
			}
			
			this.w = (typeof args[3] === 'number') ? args[3] : args[0];
			
		}
		
		
	}
	
	/**
	 * The value of vector's w-component
	 * @return {Number}
	 */
	get w() { return this[3]; }
	set w(_w) { this[3] = _w; }
	
	/**
	 * The **new** vector, constructed as `Vec4(this.x, this.y, this.z, this.w)`
	 * @return {Vec} xyzw
	 */
	get xyzw() { return new Vec4(this); }
	set xyzw(_xyzw) { this[0] = _xyzw[0]; this[1] = _xyzw[1]; this[2] = _xyzw[2]; this[3] = _xyzw[3]; }
	
	/**
	 * The **new** vector, constructed as `Vec4(this.y, this.x, this.z, this.w)`
	 * @return {Vec} yxzw
	 */
	get yxzw() { return new Vec4([this[1], this[0], this[2], this[3]]); }
	set yxzw(_xyzw) { this[1] = _xyzw[0]; this[0] = _xyzw[1]; this[2] = _xyzw[2]; this[3] = _xyzw[3]; }
	
	/**
	 * The **new** vector, constructed as `Vec4(this.z, this.y, this.x, this.w)`
	 * @return {Vec} zyxw
	 */
	get zyxw() { return new Vec4([this[2], this[1], this[0], this[3]]); }
	set zyxw(_xyzw) { this[2] = _xyzw[0]; this[1] = _xyzw[1]; this[0] = _xyzw[2]; this[3] = _xyzw[3]; }
	
	/**
	 * The **new** vector, constructed as `Vec4(this.y, this.z, this.x, this.w)`
	 * @return {Vec} yzxw
	 */
	get yzxw() { return new Vec4([this[1], this[2], this[0], this[3]]); }
	set yzxw(_xyzw) { this[0] = _xyzw[0]; this[1] = _xyzw[1]; this[2] = _xyzw[2]; this[3] = _xyzw[3]; }
	
	/**
	 * The **new** vector, constructed as `Vec4(this.x, this.z, this.y, this.w)`
	 * @return {Vec} xzyw
	 */
	get xzyw() { return new Vec4([this[0], this[2], this[1], this[3]]); }
	set xzyw(_xyzw) { this[0] = _xyzw[0]; this[2] = _xyzw[1]; this[1] = _xyzw[2]; this[3] = _xyzw[3]; }
	
	
	/** @override */
	plused(other) { super.plused(other); this[3] += other[3]; return this; }
	/** @override */
	minused(other) { super.minused(other); this[3] -= other[3]; return this; }
	/** @override */
	muled(other) { super.muled(other); this[3] *= other[3]; return this; }
	/** @override */
	dived(other) { super.dived(other); this[3] /= other[3]; return this; }
	/** @override */
	maxed(other) { super.maxed(other); this[3] = Math.max(this[3], other[3]); return this; }
	/** @override */
	mined(other) { super.mined(other); this[3] = Math.min(this[3], other[3]); return this; }
	
	
	/** @override */
	get neged() { super.neged(); this[3] = -this[3]; return this; }
	
	
	/** @override */
	scaled(scalar) { super.scaled(scalar); this[3] *= scalar; return this; }
	/** @override */
	fracted(scalar) { super.fracted(scalar); this[3] /= scalar; return this; }
	
	
	/** @override */
	get rounded() { this[3] = Math.round(this[3]); return super.rounded; }
	/** @override */
	get floored() { this[3] = Math.floor(this[3]); return super.floored; }
	/** @override */
	get ceiled() { this[3] = Math.ceil(this[3]); return super.ceiled; }
	
	
	/** @override */
	get isZero() { return super.isZero() && this[3] === 0; }
	
	/** @override */
	cmp(cb) { return super.cmp(cb) && cb(this[3], 2); }
	
	
	/** @override */
	dot(other) { return super.dot(other) + this[3] * other[3]; }
	
	
	/** @override */
	toString() { return 'Vec4(' + this[0] + ', ' + this[1] + ', ' + this[2] + ', ' + this[3] + ')'; }
	
	
}

module.exports = Vec4;
