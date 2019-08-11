'use strict';

const Vec2  = require('../math/vec2');
const Color = require('../math/color');


class Drawable {
	
	constructor(opts) {
		
		this._screen = opts.screen;
		this._three = this._screen.three;
		
		this._pos = new Vec2(opts.pos || [0, 0]);
		this._z = 0;
		
		this._visible = true;
		
		this._mesh = this._build(opts);
		
		this.screen.scene.add(this._mesh);
		
		if (opts.color) {
			if (opts.color instanceof Color) {
				this.color = opts.color;
			} else {
				this.color = new Color(opts.color);
			}
		} else {
			this.color = new Color(0xFFFFFF);
		}
		
		this.pos = this._pos;
		this.z = opts.z || 0;
		
	}
	
	
	get three() { return this._three; }
	
	
	get screen() { return this._screen; }
	set screen(v) { v = null; } // dummy setter, for convinience of passing Drawable as opts
	
	
	get mat() { return this._mesh.material; }
	get geo() { return this._mesh.geometry; }
	get mesh() { return this._mesh; }
	
	
	get z() { return this._z; }
	set z(v) {
		this._z = v;
		this._mesh.position.z = this._z;
	}
	
	
	get visible() { return this._visible; }
	set visible(v) {
		this._visible = v;
		this._mesh.visible = this._visible;
	}
	
	
	get pos() { return this._pos.xy; }
	set pos(p) {
		
		this._pos.copy(p);
		
		this._mesh.position.x = this._pos.x;
		this._mesh.position.y = this._pos.y;
	}
	
	
	get color() { return this._color; }
	set color(v) {
		this._color = v;
		
		if (this.mat) {
			if (this.mat.color) {
				this.mat.color.setHex( this._color.toHex() );
			}
			if (this.mat.opacity) {
				this.mat.opacity = this._color.a;
			}
		}
	}
	
	
	_build(opts) {
		return new THREE.Mesh(this._geo(opts), this._mat(opts));
	}
	
	
	_geo() {
		return new THREE.PlaneBufferGeometry(2,2);
	}
	
	
	updateGeo() {
		this._mesh.geometry = this._geo(this);
		this._mesh.geometry.needsUpdate = true;
	}
	
	
	_mat() {
		return new THREE.MeshBasicMaterial({
			transparent: true,
			side       : THREE.DoubleSide,
			depthWrite : true,
			depthTest  : true,
		});
	}
	
	
	remove() {
		this.screen.scene.remove(this._mesh);
	}
	
}

module.exports = Drawable;
