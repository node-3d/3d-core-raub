const debugShaders = (renderer) => {
	renderer.debug.checkShaderErrors = true;
	renderer.debug.onShaderError  = (gl, _program, vs, fs) => {
		const parseForErrors = (shader, name) => {
			const errors = (gl.getShaderInfoLog(shader) || '').trim();
			const prefix = 'Errors in ' + name + ':' + '\n\n' + errors;
			
			if (errors !== '') {
				const code = (gl.getShaderSource(shader) || '').replace(/\t/g, '  ');
				const lines = code.split('\n');
				var linedCode = '';
				var i = 1;
				for (var line of lines) {
					linedCode += (i < 10 ? ' ' : '') + i + ':\t\t' + line + '\n';
					i++;
				}
				
				console.error(prefix + '\n' + linedCode);
			}
		};
		
		parseForErrors(vs, 'Vertex Shader');
		parseForErrors(fs, 'Fragment Shader');
	};
};

module.exports = { debugShaders };
