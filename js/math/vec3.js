'use strict';

const Vec2 = require('./vec2');


/**
 * Three-dimensional vector
 * @note All 'ed() methods modify **INPLACE**, no-'ed methods - **MAKE A COPY**
 * @author Luis Blanco
 * @extends Vec2
 */
class Vec3 extends Vec2 {
	/**
	 * @constructs Vec3
	 * @desc Takes three numbers, or single array, or an object with `.x`, `.y`, and `.z` properties.
	 * - If no arguments passed, constructs `Vec3(0, 0, 0)`.
	 * - If only one number is given, constructs `Vec3(x, x, x)`.
	 * @arg {number|number[]|object} [x=0]
	 * @arg {Number} [y=0]
	 * @arg {Number} [z=0]
	 */
	constructor(x, y, z) {
		const args = arguments;
		
		super(x, y, z);
		
		this.z = 0;
		
		if (!args.length) {
			return;
		}
		
		if (typeof args[0] === 'object') {
			
			if (args[0] === null) {
				return;
			}
			
			// [] or {} or Vec2
			if (args[0].constructor === Array || args[0].constructor === Vec3) {
				this.z = args[0][2];
			} else if (typeof args[0].z === 'number') {
				this.z = args[0].z;
			} else if (args[0].constructor === Vec2) {
				if (args[1].constructor === Array || args[1].constructor === Vec2) {
					this.z = args[1][0];
				} else if (typeof args[1] === 'number') {
					this.z = args[1];
				}
			}
			
		} else if (typeof args[0] === 'number') {
			
			if (isNaN(args[0])) {
				return;
			}
			
			this.z = (typeof args[2] === 'number') ? args[2] : args[0];
			
		}
	}
	
	/**
	 * The value of vector's z-component
	 * @return {Number} z
	 */
	get z() { return this[2]; }
	set z(_z) { this[2] = _z; }
	
	/**
	 * The **new** vector, constructed as `Vec3(this.x, this.y, this.z)`
	 * @return {Vec} xyz
	 */
	get xyz() { return new Vec3(this); }
	set xyz(_xyz) { this[0] = _xyz[0]; this[1] = _xyz[1]; this[2] = _xyz[2]; }
	
	/**
	 * The **new** vector, constructed as `Vec3(this.x, this.y, this.z)`
	 * @return {Vec} yxz
	 */
	get yxz() { return new Vec3([this[1], this[0], this[2]]); }
	set yxz(_xyz) { this[1] = _xyz[0]; this[0] = _xyz[1]; this[2] = _xyz[2]; }
	
	/**
	 * The **new** vector, constructed as `Vec3(this.z, this.y, this.x)`
	 * @return {Vec} zyx
	 */
	get zyx() { return new Vec3([this[2], this[1], this[0]]); }
	set zyx(_xyz) { this[2] = _xyz[0]; this[1] = _xyz[1]; this[0] = _xyz[2]; }
	
	/**
	 * The **new** vector, constructed as `Vec3(this.y, this.z, this.x)`
	 * @return {Vec} yzx
	 */
	get yzx() { return new Vec3([this[1], this[2], this[0]]); }
	set yzx(_xyz) { this[0] = _xyz[0]; this[1] = _xyz[1]; this[2] = _xyz[2]; }
	
	/**
	 * The **new** vector, constructed as `Vec3(this.x, this.z, this.y)`
	 * @return {Vec} xzy
	 */
	get xzy() { return new Vec3([this[0], this[2], this[1]]); }
	set xzy(_xyz) { this[0] = _xyz[0]; this[2] = _xyz[1]; this[1] = _xyz[2]; }
	
	/** @override */
	plused(other) { super.plused(other); this[2] += other[2]; return this; }
	/** @override */
	minused(other) { super.minused(other); this[2] -= other[2]; return this; }
	/** @override */
	muled(other) { super.muled(other); this[2] *= other[2]; return this; }
	/** @override */
	dived(other) { super.dived(other); this[2] /= other[2]; return this; }
	/** @override */
	maxed(other) { super.maxed(other); this[2] = Math.max(this[2], other[2]); return this; }
	/** @override */
	mined(other) { super.mined(other); this[2] = Math.min(this[2], other[2]); return this; }
	
	/** @override */
	get neged() { super.neged(); this[2] = -this[2]; return this; }
	
	/** @override */
	scaled(scalar) { super.scaled(scalar); this[2] *= scalar; return this; }
	/** @override */
	fracted(scalar) { super.fracted(scalar); this[2] /= scalar; return this; }
	
	/** @override */
	get rounded() { this[2] = Math.round(this[2]); return super.rounded; }
	/** @override */
	get floored() { this[2] = Math.floor(this[2]); return super.floored; }
	/** @override */
	get ceiled() { this[2] = Math.ceil(this[2]); return super.ceiled; }
	
	
	/** @override */
	get isZero() { return super.isZero() && this[2] === 0; }
	
	/** @override */
	cmp(cb) { return super.cmp(cb) && cb(this[2], 2); }
	
	
	/** @override */
	dot(other) { return super.dot(other) + this[2] * other[2]; }
	
	
	/** @override */
	toString() { return 'Vec3(' + this[0] + ', ' + this[1] + ', ' + this[2] + ')'; }
}

module.exports = Vec3;
