const createRenderTarget = (THREE, materialPost, w, h) => {
	const newRt = new THREE.WebGLRenderTarget(
		w,
		h,
		{
			minFilter: THREE.LinearFilter,
			magFilter: THREE.NearestFilter,
			format: THREE.RGBAFormat,
		}
	);
	
	materialPost.uniforms.t.value = newRt.texture;
	
	return newRt;
};

module.exports = { createRenderTarget };
