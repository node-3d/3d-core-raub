'use strict';


const Vec4 = require('./vec4');
const Vec3 = require('./vec3');

/**
 * Four-component color
 * @author Luis Blanco
 * @extends Vec4
 */
class Color extends Vec4 {
	
	/**
	 * @constructs Color
	 * @desc Takes four numbers, or single array, or an object with `.r`, `.g`, `.b`, and `.a` properties.
	 * - If no arguments passed, constructs `Color(0, 0, 0, 1)`.
	 * - If only one number is given, constructs `Color(r, r, r, 1)`.
	 * - If only two numbers are given, constructs `Color(r, r, r, g)`.
	 * - If three numbers are given, constructs `Color(r, g, b, 1)`.
	 * @arg {number|number[]|object} [x=0]
	 * @arg {Number} [y=0]
	 * @arg {Number} [z=0]
	 * @arg {Number} [w=0]
	 */
	constructor() {
		
		let r = 0, g = 0, b = 0, a = 1;
		
		const args = arguments;
		
		let method = 'rgbaFromEmpty';
		
		if (args.length) {
			if (typeof args[0] === 'object') {
				method = 'rgbaFromObject';
			} else if (typeof args[0] === 'number' && args[0] < 256) {
				method = 'rgbaFromFloats';
			} else if (typeof args[0] === 'number' || typeof args[0] === 'string') {
				method = 'rgbaFromString';
			}
		}
		
		const { r, g, b, a } = Color[method](args);
		
		super(r, g, b, a);
		
	}
	
	
	static clampTo1(x) {
		return x > 1 ? x / 255 : x;
	}
	
	
	static rgbaFromEmpty(obj) {
		let r = 0, g = 0, b = 0, a = 1;
		return { r, g, b, a };
	}
	
	
	static rgbaFromObject(args) {
		
		let r = 0, g = 0, b = 0, a = 1;
		
		if (args[0] === null) {
			return { r, g, b, a };
		}
		
		// [] or {} or Vec2
		if (args[0].constructor === Array || args[0].constructor === Color) {
			r = args[0][0];
			g = args[0][1];
			b = args[0][2];
			a = typeof args[0][3] === 'number' ? args[0][3] : 1;
		} else if (
				typeof args[0].r === 'number' && typeof args[0].g === 'number' &&
				typeof args[0].b === 'number'
			) {
			r = args[0].r;
			g = args[0].g;
			b = args[0].b;
			a = typeof args[0].a === 'number' ? args[0].a : 1;
		} else if (args[0].constructor === Vec3) {
			r = args[0].x;
			g = args[0].y;
			b = args[0].z;
			a = typeof args[1] === 'number' ? args[1] : 1;
		}
		
		r = clampTo1(r);
		g = clampTo1(g);
		b = clampTo1(b);
		a = clampTo1(a);
		
		return { r, g, b, a };
		
	}
	
	
	static rgbaFromFloats(args) {
		
		let r = 0, g = 0, b = 0, a = 1;
		
		if (isNaN(args[0])) {
			return { r, g, b, a };
		}
		
		r = args[0];
		g = (typeof args[1] === 'number' && typeof args[2] === 'number') ? args[1] : args[0];
		b = (typeof args[2] === 'number') ? args[2] : args[0];
		
		if (typeof args[3] === 'number') {
			a = args[3];
		} else if (typeof args[2] === 'number') {
			a = 1;
		} else if (typeof args[1] === 'number') {
			a = args[1];
		} else {
			a = 1;
		}
		
		r = clampTo1(r);
		g = clampTo1(g);
		b = clampTo1(b);
		a = clampTo1(a);
		
		return { r, g, b, a };
		
	}
	
	
	static rgbaFromString(args) {
		
		let r = 0, g = 0, b = 0, a = 1;
		
		let rest = 0;
		
		if (typeof args[0] === 'string') {
			rest = parseInt(args[0], 16);
		} else {
			rest = args[0];
		}
		
		if (isNaN(rest)) {
			return { r, g, b, a };
		}
		
		if (args[0] > 256 * 256 * 256) {
			a = rest % 256;
			rest = Math.floor(rest / 256);
		}
		
		b = rest % 256; rest = Math.floor(rest / 256);
		g = rest % 256; rest = Math.floor(rest / 256);
		r = rest % 256;
		
		r = clampTo1(r);
		g = clampTo1(g);
		b = clampTo1(b);
		a = clampTo1(a);
		
		return { r, g, b, a };
		
	}
	
	
	/**
	 * The value of colors' red component
	 * @return {Number}
	 */
	get r() { return this.x; }
	set r(_r) { this.x = _r; }
	
	
	/**
	 * The value of colors' green component
	 * @return {Number}
	 */
	get g() { return this.y; }
	set g(_g) { this.y = _g; }
	
	
	/**
	 * The value of colors' blue component
	 * @return {Number}
	 */
	get b() { return this.z; }
	set b(_b) { this.z = _b; }
	
	
	/**
	 * The value of colors' alpha component
	 * @return {Number}
	 */
	get a() { return this.w; }
	set a(_a) { this.w = _a; }
	
	
	/**
	 * The **new** color, constructed as `Color(this.r, this.g, this.b)`
	 * @return {Color} rgb
	 */
	get rgb() { return new Color(this.r, this.g, this.b); }
	set rgb(_rgb) { this.xyz = _rgb; }
	
	
	/**
	 * The **new** color, constructed as `Color(this.r, this.g, this.b, this.a)`
	 * @return {Color} rgb
	 */
	get rgba() { return new Color(this.r, this.g, this.b, this.a); }
	set rgba(_rgba) { this.xyzw = _rgba; }
	
	
	/**
	 * The value of colors' alpha component
	 * @return {Number}
	 */
	get opacity() { return this.a; }
	
	
	/**
	 * Integer representation of the color (without alpha)
	 * @return {Number} color
	 */
	get hex() {
		const scaled = this.scale(255).rounded;
		return scaled.b + 256 * scaled.g + 256 * 256 * scaled.r;
	}
	
	/**
	 * Integer representation of the color (without alpha)
	 * @return {Number} color
	 */
	toHex() {
		return this.hex;
	}
	
	/**
	 * Integer representation of the color (including alpha)
	 * @return {Number} color
	 */
	get hexA() {
		return Math.round(255 * this.a) + 256 * this.toHex;
	}
	
	/**
	 * Integer representation of the color (including alpha)
	 * @return {Number} color
	 */
	toHexA() {
		return this.hexA;
	}
	
	
	/**
	 * String representation of the color (without alpha)
	 * @return {String} color
	 */
	toString() {
		const r = Math.round(255 * this.r);
		return (r > 15 ? '' : '0') + this.hex;
	}
	
	/**
	 * String representation of the color (including alpha)
	 * @return {String} color
	 */
	toStringA() {
		const r = Math.round(255 * this.r);
		return (r > 15 ? '' : '0') + this.hexA;
	}
	
	
}

module.exports = Color;
