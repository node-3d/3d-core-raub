'use strict';

/**
 * @typedef {object} Vec
 * A placeholder class for vector types. Not an actual class. For docs only.
 * When you see this type, you refer to the context and common sence
 * to understand which vector type is it: Vec2, Vec3, etc...
 */


/**
 * Two-dimensional vector
 * @note All 'ed() methods modify **INPLACE**, no-'ed methods - **MAKE A COPY**
 * @author Luis Blanco
 */
class Vec2 extends Array {
	/**
	 * @constructs Vec2
	 * @desc Takes two numbers, or single array, or an object with `.x` and `.y` properties.
	 * - If no arguments passed, constructs `Vec2(0, 0)`.
	 * - If only one number is given, constructs `Vec2(x, x)`.
	 * @arg {number|number[]|object} [x=0]
	 * @arg {Number} [y=0]
	 * @return {Vec}
	 */
	constructor() {
		super();
		
		const args = arguments;
		
		this.x = 0;
		this.y = 0;
		
		if (!args.length) {
			return;
		}
		
		if (typeof args[0] === 'object') {
			if (args[0] === null) {
				return;
			}
			
			// [] or {} or Vec2
			if (args[0].constructor === Array || args[0].constructor === Vec2) {
				this.x = args[0][0];
				this.y = args[0][1];
			} else if (typeof args[0].x === 'number' && typeof args[0].y === 'number') {
				this.x = args[0].x;
				this.y = args[0].y;
			}
			
		} else if (typeof args[0] === 'number') {
			if (isNaN(args[0])) {
				return;
			}
			
			// a,b or a,a
			this.x = args[0];
			this.y = (typeof args[1] === 'number') ? args[1] : args[0];
		}
	}
	
	/**
	 * The value of vector's x-component
	 * @return {Number}
	 */
	get x() { return this[0]; }
	set x(_x) { this[0] = _x; }
	
	/**
	 * The value of vector's y-component
	 * @return {Number}
	 */
	get y() { return this[1]; }
	set y(_y) { this[1] = _y; }
	
	/**
	 * The **new** vector of the same type, constructed after this one's current data
	 * @return {Vec}
	 */
	get clone() { return new this.constructor(this); }
	
	/**
	 * The **new** vector, constructed as `Vec2(this.x, this.y)`
	 * @return {Vec}
	 */
	get xy() { return new Vec2(this); }
	set xy(_xy) { this[0] = _xy[0]; this[1] = _xy[1]; }
	
	/**
	 * The **new** vector, constructed as `Vec2(this.y, this.x)`
	 * @return {Vec}
	 */
	get yx() { return new Vec2([this[1], this[0]]); }
	set yx(_yx) { this[0] = _yx[1]; this[1] = _yx[0]; }
	
	
	/**
	 * Adds the components of `other` to those of `this`, and then chains self
	 * @arg {Vec} other
	 * @return {Vec} this
	 */
	plused(other) { this[0] += other[0]; this[1] += other[1]; return this; }
	/**
	 * Adds the components of `other` to those of `this.clone`, and then chains it
	 * @arg {Vec} other
	 * @return {Vec} this.clone
	 */
	plus(other) { return this.clone.plused(other); }
	/**
	 * Same as `.plused()`
	 * @see plused
	 * @return {Vec} this
	 */
	added(other) { return this.plused(other); }
	/**
	 * Same as `.plus()`
	 * @see plus
	 * @return {Vec} this.clone
	 */
	add(other) { return this.clone.plused(other); }
	
	/**
	 * Subtracts the components of `other` from those of `this`, and then chains self
	 * @arg {Vec} other
	 * @return {Vec} this
	 */
	minused(other) { this[0] -= other[0]; this[1] -= other[1]; return this; }
	/**
	 * Subtracts the components of `other` from those of `this.clone`, and then chains it
	 * @arg {Vec} other
	 * @return {Vec} this.clone
	 */
	minus(other) { return this.clone.minused(other); }
	/**
	 * Same as `.minused()`
	 * @see minused
	 * @return {Vec} this
	 */
	subed(other) { return this.minused(other); }
	/**
	 * Same as `.minus()`
	 * @see minus
	 * @return {Vec} this.clone
	 */
	sub(other) { return this.clone.minused(other); }
	/**
	 * Same as `.minused()`
	 * @see minused
	 * @return {Vec} this
	 */
	subtracted(other) { return this.minused(other); }
	/**
	 * Same as `.minus()`
	 * @see minus
	 * @return {Vec} this.clone
	 */
	subtract(other) { return this.clone.minused(other); }
	/**
	 * This is for the people who **sub-S-tract**
	 * @see minused
	 */
	substracted() { throw 'Use subtract instead of sub-S-tract.'; }
	/**
	 * This is for the people who **sub-S-tract**
	 * @see minus
	 */
	substract() { throw 'Use subtract instead of sub-S-tract.'; }
	
	/**
	 * Multiplies the components of `this` by those of `other`, and then chains self
	 * @arg {Vec} other
	 * @return {Vec} this
	 */
	muled(other) { this[0] *= other[0]; this[1] *= other[1]; return this; }
	/**
	 * Multiplies the components of `this.clone` by those of `other`, and then chains it
	 * @arg {Vec} other
	 * @return {Vec} this.clone
	 */
	mul(other) { return this.clone.muled(other); }
	/**
	 * Same as `.muled()`
	 * @see muled
	 * @return {Vec} this
	 */
	multiplied(other) { return this.muled(other); }
	/**
	 * Same as `.mul()`
	 * @see mul
	 * @return {Vec} this.clone
	 */
	multiply(other) { return this.clone.muled(other); }
	/**
	 * Same as `.muled()`
	 * @see muled
	 * @return {Vec} this
	 */
	crossed(other) { this[0] *= other[0]; this[1] *= other[1]; return this; }
	/**
	 * Same as `.mul()`
	 * @see mul
	 * @return {Vec} this.clone
	 */
	cross(other) { return this.clone.crossed(other); }
	
	/**
	 * Divides the components of `this` by those of `other`, and then chains self
	 * @arg {Vec} other
	 * @return {Vec} this
	 */
	dived(other) { this[0] /= other[0]; this[1] /= other[1]; return this; }
	/**
	 * Divides the components of `this.clone` by those of `other`, and then chains it
	 * @arg {Vec} other
	 * @return {Vec} this.clone
	 */
	div(other) { return this.clone.dived(other); }
	/**
	 * Same as `.dived()`
	 * @see dived
	 * @return {Vec} this
	 */
	divided(other) { return this.dived(other); }
	/**
	 * Same as `.div()`
	 * @see div
	 * @return {Vec} this.clone
	 */
	divide(other) { return this.clone.dived(other); }
	
	/**
	 * Stores per-component maximum between `other` and `this`, and then chains self
	 * @arg {Vec} other
	 * @return {Vec} this
	 */
	maxed(other) {
		this[0] = Math.max(this[0], other[0]);
		this[1] = Math.max(this[1], other[1]);
		return this;
	}
	
	/**
	 * Stores in `this.clone` per-component maximum between `other` and `this.clone`, and then chains self
	 * @arg {Vec} other
	 * @return {Vec} this.clone
	 */
	max(other) { return this.clone.maxed(other); }
	
	/**
	 * Stores per-component minimum between `other` and `this`, and then chains self
	 * @arg {Vec} other
	 * @return {Vec} this
	 */
	mined(other) {
		this[0] = Math.min(this[0], other[0]);
		this[1] = Math.min(this[1], other[1]);
		return this;
	}
	
	/**
	 * Stores in `this.clone` per-component minimum between `other` and `this.clone`, and then chains self
	 * @arg {Vec} other
	 * @return {Vec} this.clone
	 */
	min(other) { return this.clone.mined(other); }
	
	
	/**
	 * Negates the components of `this`, and then chains self
	 * @return {Vec} this
	 */
	get neged() { this[0] = -this[0]; this[1] = -this[1]; return this; }
	/**
	* Negates the components of `this.clone`, and then chains it
	* @return {Vec} this.clone
	*/
	get neg() { return this.clone.neged; }
	
	/**
	 * Scales (multiplies) the components of `this`, and then chains self
	 * @arg {Number} scalar
	 * @return {Vec} this
	 */
	scaled(scalar) { this[0] *= scalar; this[1] *= scalar; return this; }
	/**
	 * Scales (multiplies) the components of `this.clone`, and then chains it
	 * @arg {Number} scalar
	 * @return {Vec} this.clone
	 */
	scale(scalar) { return this.clone.scaled(scalar); }
	
	
	/**
	 * Rounds the components of `this`, and then chains self
	 * @return {Vec} this
	 */
	get rounded() { this[0] = Math.round(this[0]); this[1] = Math.round(this[1]); return this; }
	/**
	 * Rounds the components of `this.clone`, and then chains it
	 * @return {Vec} this.clone
	 */
	get round() { return this.clone.rounded; }
	
	
	/**
	 * Floors the components of `this`, and then chains self
	 * @return {Vec} this
	 */
	get floored() { this[0] = Math.floor(this[0]); this[1] = Math.floor(this[1]); return this; }
	/**
	 * Floors the components of `this.clone`, and then chains it
	 * @return {Vec} this.clone
	 */
	get floor() { return this.clone.floored; }
	
	
	/**
	 * Ceils the components of `this`, and then chains self
	 * @return {Vec} this
	 */
	get ceiled() { this[0] = Math.ceil(this[0]); this[1] = Math.ceil(this[1]); return this; }
	/**
	 * Ceils the components of `this.clone`, and then chains it
	 * @return {Vec} this.clone
	 */
	get ceil() { return this.clone.ceiled; }
	
	
	/**
	 * Divides the components of `this`, and then chains self
	 * @arg {Number} scalar
	 * @return {Vec} this
	 */
	fracted(scalar) { this[0] /= scalar; this[1] /= scalar; return this; }
	/**
	 * Divides the components of `this.clone`, and then chains it
	 * @arg {Number} scalar
	 * @return {Vec} this.clone
	 */
	fract(scalar) { return this.clone.fracted(scalar); }
	
	
	/**
	 * Tells if `this` is a zero-vector
	 * @return {boolean} true if both `.x` and `.y` are 0.
	 */
	get isZero() { return this[0] === 0 && this[1] === 0; }
	
	/**
	 * Tells if `cb()` returned true for every component of `this`
	 * @arg {function} cb
	 * @return {boolean} true when all `cb(component, i)` are true.
	 */
	cmp(cb) { return cb(this[0], 0) && cb(this[1], 1); }
	
	
	/**
	 * Calculates the dot product with other vector
	 * @arg {Vec} other
	 * @return {Number} dot product
	 */
	dot(other) { return this[0] * other[0] + this[1] * other[1]; }
	
	
	/**
	 * The squared length of this vector, works well for length comparisons, where sqrting is pointles
	 * @return {Number} squared length
	 */
	get sqLen() { return this.dot(this); }
	/**
	 * Same as `.sqLen`
	 * @see sqLen
	 * @return {Number} squared length
	 */
	get sqLength() { return this.sqLen; }
	/**
	 * Same as `.sqLen`
	 * @see sqLen
	 * @return {Number} squared length
	 */
	get squareLength() { return this.sqLen; }
	
	
	/**
	 * The length of this vector
	 * @return {Number} length
	 */
	get len() { return Math.sqrt(this.sqLen); }
	/**
	 * Same as `.len`
	 * @see len
	 * @return {Number} length
	 */
	get length() { return this.len; }
	/**
	 * Same as `.len`
	 * @see len
	 * @return {Number} length
	 */
	get size() { return this.len; }
	
	
	/**
	 * Calculates the euclidian distance to other Vec2
	 * @arg {Vec} other
	 * @return {Number} distance
	 */
	dist(other) { return other.clone.minused(this).len; }
	/**
	 * Same as `.dist`
	 * @see dist
	 * @return {Number} distance
	 */
	distance(other) { return this.dist(other); }
	
	
	/**
	 * Calculates the square of euclidian distance to other Vec2
	 * Works well for length comparisons, where sqrting is pointles.
	 * @arg {Vec} other
	 * @return {Number} squared distance
	 */
	sqDist(other) { return other.clone.minused(this).sqLen; }
	/**
	 * Same as `.sqDist`
	 * @see sqDist
	 * @return {Number} squared distance
	 */
	sqDistance(other) { return this.sqDist(other); }
	/**
	 * Same as `.sqDist`
	 * @see sqDist
	 * @return {Number} squared distance
	 */
	squareDistance(other) { return this.sqDist(other); }
	
	
	/**
	 * Copies the component values from `other` into `this`
	 * @arg {Vec} other
	 * @return {Vec} this
	 */
	copy(other) { this[0] = other[0]; this[1] = other[1]; return this; }
	
	
	/**
	 * Returns a string representation of the vector
	 * @return {String} string representation of the vector
	 */
	toString() { return 'Vec2(' + this[0] + ', ' + this[1] + ')'; }
	
	
	/**
	 * Makes clockwise 90 degree rotated copy of `this`
	 * @return {Vec} clockwise perpendicular
	 */
	get ortho() { return new Vec2(this[1], -this[0]); }
	/**
	 * Same as `.ortho`
	 * @see ortho
	 * @return {Vec} clockwise perpendicular
	 */
	get orthoCw() { return this.ortho; }
	/**
	 * Same as `.ortho`
	 * @see ortho
	 * @return {Vec} clockwise perpendicular
	 */
	get orthoClockwise() { return this.ortho; }
	
	/**
	 * Makes **counter**-clockwise 90 degree rotated copy of `this`
	 * @return {Vec} counter-clockwise perpendicular
	 */
	get orthoCcw() { return new Vec2(-this[1], this[0]); }
	/**
	 * Same as `.orthoCcw`
	 * @see orthoCcw
	 * @return {Vec} counter-clockwise perpendicular
	 */
	get orthoCounterClockwise() { return this.orthoCcw; }
	
	
	/**
	 * Make a cross product and only return `.z` component
	 * @arg  {Vec} other
	 * @return {Number} cross length
	 */
	crossLen(other) { return this[0] * other[1] - this[1] * other[0]; }
	/**
	 * Same as `.crossLen()`
	 * @see crossLen
	 * @return {Number} cross length
	 */
	crossLength(other) { return this.crossLen(other); }
	
	
	/**
	 * Rotate `this` by an angle
	 * @arg {Number} angle
	 * @return {Vec} this
	 */
	rotated(angle) {
		if (angle === 0) {
			return this;
		}
		
		const c = Math.cos(angle);
		const s = Math.sin(angle);
		this[0] = c * this[0] - s * this[1];
		this[1] = s * this[0] + c * this[1];
		return this;
	}
	/**
	 * Rotate `this.clone` by an angle
	 * @arg {Number} angle
	 * @return {Vec} this.clone
	 */
	rotate(angle) { return this.clone.rotated(angle); }
	
	
	/**
	 * Compute centroid of a triangle spanned by vectors `this`, `b`, `c`
	 * See http://easycalculation.com/analytical/learn-centroid.php
	 * @arg {Vec} b
	 * @arg {Vec} c
	 * @return {Vec} this.clone
	 */
	centroid(b, c) { return this.clone.plused(b).plused(c).scaled(1 / 3); }
	
	
	/**
	 * Normalizes `this`: makes it's length equal to 1. If current length is 0, does nothing
	 * @return {Vec} this
	 */
	get normed() {
		const sqLen = this.sqLen;
		return sqLen > 0 ? this.scaled(1 / Math.sqrt(sqLen)) : this;
	}
	/**
	 * Normalizes `this.clone`: makes it's length equal to 1. If current length is 0, does nothing
	 * @return {Vec} this.clone
	 */
	get norm() { return this.clone.normed; }
	
	/**
	 * Same as `.normed`
	 * @see normed
	 * @return {Vec} this
	 */
	get normalized() { return this.normed; }
	/**
	 * Same as `.norm`
	 * @see norm
	 * @return {Vec} this.clone
	 */
	get normalize() { return this.clone.normed; }
	
	
	/**
	 * Linearly interpolate/mix `this` against the `other`
	 * @arg {Vec} other
	 * @arg {Number} t Lerp factor
	 * @return {Vec} this
	 */
	lerped(other, t) { return this.plused(other.minused(this).scaled(t)); }
	/**
	 * Linearly interpolate/mix `this.clone` against the `other`
	 * @arg {Vec} other
	 * @arg {Number} t Lerp factor
	 * @return {Vec} this.clone
	 */
	lerp(other, t) { return this.clone.lerped(other, t); }
	
	
	/**
	 * Reflect `this` along the given normal
	 * @arg {Vec} normal
	 * @return {Vec} this
	 */
	reflected(normal) { return this.minused(normal.sceled(2 * this.dot(normal))); }
	/**
	 * Reflect `this.clone` along the given normal
	 * @arg {Vec} normal
	 * @return {Vec} this.clone
	 */
	reflect(normal) { return this.clone.reflected(normal); }
	
	/**
	 * Get the intersection point between two line segments
	 * @static
	 * @arg {Vec} p0
	 * @arg {Vec} p1
	 * @arg {Vec} p2
	 * @arg {Vec} p3
	 * @return {Vec} null if no intersection.
	 */
	getLineSegmentsIntersection(p0, p1, p2, p3) {
		var t = Vec2.getLineSegmentsIntersectionFraction(p0, p1, p2, p3);
		
		if (t < 0) {
			return null;
		}
		
		return new Vec2(p0[0] + (t * (p1[0] - p0[0])), p0[1] + (t * (p1[1] - p0[1])));
	}
	
	/**
	 * Get the intersection fraction between two line segments.
	 * If successful, the intersection is at p0 + t * (p1 - p0).
	 * @arg {Vec} p0
	 * @arg {Vec} p1
	 * @arg {Vec} p2
	 * @arg {Vec} p3
	 * @return {Number} A number between 0 and 1 if there was an intersection, otherwise -1
	 */
	getLineSegmentsIntersectionFraction(p0, p1, p2, p3) {
		const s1X = p1[0] - p0[0];
		const s1Y = p1[1] - p0[1];
		const s2X = p3[0] - p2[0];
		const s2Y = p3[1] - p2[1];
		
		const s = (-s1Y * (p0[0] - p2[0]) + s1X * (p0[1] - p2[1])) / (-s2X * s1Y + s1X * s2Y);
		const t = ( s2X * (p0[1] - p2[1]) - s2Y * (p0[0] - p2[0])) / (-s2X * s1Y + s1X * s2Y);
		
		if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
			return t; // Collision detected
		}
		
		return -1; // No collision
	}
	
	
}

module.exports = Vec2;
