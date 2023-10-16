const createPostMaterial = (THREE, numColors, isSwap, modeGrayscale, palette, fragmentShader) => {
	return new THREE.ShaderMaterial({
		side: THREE.CullFaceFront,
		uniforms: {
			isSwap: { value: isSwap },
			modeGrayscale: { value: modeGrayscale },
			t: { value: null },
			colors: { value: palette },
		},
		defines: {
			NUM_COLORS: numColors,
		},
		depthWrite: false,
		depthTest: false,
		transparent: false,
		lights: false,
		vertexShader: `
			out vec2 tc;
			void main() {
				tc = uv;
				gl_Position = vec4(position, 1.0);
			}
		`,
		fragmentShader,
		glslVersion: '300 es',
	});
};

module.exports = { createPostMaterial };
