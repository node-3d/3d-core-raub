'use strict';

const Rect = require('./rect');


class Surface extends Rect {
	
	
	constructor(opts) {
		
		super(opts);
		
		// Create a different scene to hold our buffer objects
		this._scene = new this.three.Scene();
		
		// 
		this._target = this._newTarget();
		this.draw();
		
		this.mesh.material = new this.three.ShaderMaterial({
			
			side: this.three.DoubleSide,
			
			uniforms      : { type: 't', t: { value: this._target.texture } },
			
			vertexShader  : `
				varying vec2 tc;
				void main() {
					tc = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
				}
			`,
			
			fragmentShader: `
				varying vec2 tc;
				uniform sampler2D t;
				void main() {
					gl_FragColor = (vec4(1.0, 0.0, 1.0, 1.0) + texture2D(t, tc)) * 0.5;
				}
			`,
			
			depthWrite    : true,
			depthTest     : true,
			transparent   : true,
			
		});
		
		this.mesh.geometry.computeBoundingSphere = () => {
			this.mesh.geometry.boundingSphere = new this.three.Sphere(undefined, Infinity);
		};
		this.mesh.geometry.computeBoundingSphere();
		
		this.mesh.geometry.computeBoundingBox = () => {
			this.mesh.geometry.boundingBox = new this.three.Box3();
		};
		this.mesh.geometry.computeBoundingBox();
		
		this.mesh.material.needsUpdate = true;
		
	}
	
	
	get scene()  { return this._scene; }
	
	
	get size() { return super.size; }
	set size(v) {
		super.size = v;
		this.reset();
	}
	
	
	reset() {
		this._target = this._newTarget();
		this.draw();
		// this.mesh.material.map = this._target.texture;
		// this.mesh.material.map.needsUpdate = true;
		this.mesh.material.uniforms.t.value = this._target.texture;
	}
	
	
	draw() {
		this._screen.renderer.render(this._scene, this._camera, this._target);
	}
	
	
	_newTarget() {
		this._camera = new this.three.OrthographicCamera(0, this.w, this.h, 0, -100000, 100000 );
		
		return new this.three.WebGLRenderTarget(
			this.w * 2,
			this.h * 2,
			{
				minFilter: this.three.LinearFilter,
				magFilter: this.three.NearestFilter,
				format   : this.three.RGBAFormat,
			}
		);
	}
	
	
}

module.exports = Surface;
