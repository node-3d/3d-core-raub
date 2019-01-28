'use strict';

const Vec2 = require('../math/vec2');
const Drawable = require('./drawable');


class Brush extends Drawable {
	
	constructor(opts) {
		
		super({ screen: opts.screen, color: opts.color });
		
		this._size = opts.size || 100;
		this._pos = opts.pos || new Vec2();
		
		if (opts.visible !== undefined && ! opts.visible) {
			this.visible = false;
		}
		
		this.screen.on('resize', () => {
			this._mesh.material.uniforms.aspect.value = this.screen.w / this.screen.h;
			this._mesh.material.uniforms.size.value = this._size / this.screen.h;
		});
		
	}
	
	
	get size() { return this._size; }
	set size(v) {
		this._size = v;
		if (this.visible) {
			this._mesh.material.uniforms.size.value = this._size;
		}
	}
	
	
	get pos() { return this._pos; }
	set pos(v) {
		this._pos.copy(v);
		if (this.visible) {
			this._mesh.material.uniforms.pos.value = new this.three.Vector2(
				(this._pos.x / this.screen.w - 0.5) * 2,
				(-this._pos.y / this.screen.h + 0.5) * 2
			);
		}
	}
	
	
	get visible() { return super.visible; }
	set visible(v) {
		
		super.visible = v;
		
		if (this.visible) {
			
			this._mesh.material.uniforms.pos.value =
				new this.three.Vector2(this._pos.x, this._pos.y);
				
			this._mesh.material.uniforms.size.value = this._size / this.screen.h;
			
			this._mesh.material.uniforms.color.value =
				new this.three.Vector3(this._color.r, this._color.g, this._color.b);
			
		}
		
	}
	
	
	get color() { return this._color; }
	set color(v) {
		this._color = v;
		if (this.visible) {
			this.mat.uniforms.color.value =
				new this.three.Vector3(this._color.r, this._color.g, this._color.b);
		}
	}
	
	
	_geo() {
		
		const geo = new this.three.PlaneBufferGeometry(2, 2);
		geo.computeBoundingSphere = () => geo.boundingSphere = new this.three.Sphere(
			undefined, Infinity
		);
		geo.computeBoundingSphere();
		geo.computeBoundingBox = () => geo.boundingBox = new this.three.Box3();
		geo.computeBoundingBox();
		return geo;
		
	}
	
	
	_mat() {
		return new this.three.ShaderMaterial({
			
			side: this.three.DoubleSide,
			
			uniforms: {
				aspect : { type: 'f', value: this.screen.w / this.screen.h },
				size   : { type: 'f', value: 100 / this.screen.h },
				pos    : { type: 'v2', value: new this.three.Vector2(0, 0) },
				color  : { type: 'v3', value: new this.three.Vector3(0, 1, 1) },
			},
			
			vertexShader: `
				varying vec3 projPos;
				
				void main() {
					projPos  = position.xyz;
					
					gl_Position = vec4(position.xyz, 1.0);
				}
			`,
			
			fragmentShader: `
				varying vec3 projPos;
				
				uniform vec2  pos;
				uniform float size;
				uniform vec3  color;
				uniform float aspect;
				
				void main() {
					vec2 diff = projPos.xy - pos;
					diff.x *= aspect;
					float dist = length(diff);
					
					float opacity = pow(1.0 - min(1.0, abs(dist - size)), 100.0);
					gl_FragColor = vec4(color, opacity);
				}
			`,
			
			blending   : this.three.AdditiveBlending,
			depthTest  : false,
			transparent: true,
			
		});
	}
	
	
	_build(opts) {
		return new this.three.Mesh(this._geo(opts), this._mat(opts));
	}
	
}

module.exports = Brush;
