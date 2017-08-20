'use strict';


class Overlay2 {
	
	
	get scene()  { return this._scene; }
	get screen() { return this._screen; }
	
	
	// get scene()  { return this._scene; }
	// get screen() { return this._screen; }
	
	
	get width()  { return this._screen.width;  }
	get height() { return this._screen.height; }
	
	
	get three() { return this._three; };
	
	
	_newTarget() {
		this._camera = new this._screen.three.PerspectiveCamera( 5, this.width / this.height, 1, 100000000 );
		this._camera.position.x = 400;
		this._camera.position.y = 550;
		this._camera.position.z = 9000;
		
		this._camera.rotation.x = -Math.PI / 180;
		
		// this._scene.add(this._camera);
		

		return new this._screen.three.WebGLRenderTarget(
			this.width * 2,
			this.height * 2,
			{
				minFilter: this._screen.three.LinearFilter,
				magFilter: this._screen.three.NearestFilter,
				format   : this._screen.three.RGBAFormat,
			}
		);
	}
	
	
	reset() {
		this._target = this._newTarget();
		this.draw();
		this._quad.material.uniforms.t.value = this._target.texture;
	}
	
	
	constructor(opts) {
		
		this._screen = opts.screen;
		this._three  = this._screen.three;
		
		// Create a different scene to hold our buffer objects
		this._scene = new this._screen.three.Scene();
		
		// 
		this._target = this._newTarget();
		this.draw();
		
		this._quad = new this._screen.three.Mesh(
			new this._screen.three.PlaneBufferGeometry(2, 2),
			new this._screen.three.ShaderMaterial({
				
				side: this._screen.three.DoubleSide,
				
				uniforms      : { type: 't', t: { value: this._target.texture } },
				
				vertexShader  : `
					varying vec2 tc;
					void main() {
						tc = uv;
						gl_Position = vec4(position.xyz, 1.0);
						gl_Position.y = -gl_Position.y;
					}
				`,
				
				fragmentShader: `
					varying vec2 tc;
					uniform sampler2D t;
					void main() {
						gl_FragColor = texture2D(t, tc);
					}
				`,
				
				depthWrite    : false,
				depthTest     : false,
				transparent   : true,
				
			})
		);
		this._screen.scene.add(this._quad);
	}
	
	
	draw() {
		this._screen.renderer.render(this._scene, this._camera, this._target);
	}
	
	
}

module.exports = Overlay2;
