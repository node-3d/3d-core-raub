const createColorQuads = (THREE, scenePost, palette, isSwap) => {
	const colorQuads = [];
	
	palette.forEach((color, i) => {
		const materialColor = new THREE.ShaderMaterial({
			side: THREE.CullFaceFront,
			depthTest: false,
			depthWrite: false,
			transparent: false,
			lights: false,
			uniforms: {
				color: { value: color },
			},
			vertexShader: `
				void main() {
					gl_Position = vec4(position, 1.0);
				}
			`,
			fragmentShader: `
				uniform vec3 color;
				void main() {
					gl_FragColor = vec4(color, 1.0);
				}
			`,
		});
		const quadColor = new THREE.Mesh(
			new THREE.PlaneGeometry(0.1, 2 / palette.length), materialColor,
		);
		quadColor.geometry.translate(-0.95, -1 + 2 * (i + 0.5) / palette.length, 1);
		quadColor.visible = isSwap;
		scenePost.add(quadColor);
		colorQuads.push(quadColor);
	});
	
	return colorQuads;
};

module.exports = { createColorQuads };
