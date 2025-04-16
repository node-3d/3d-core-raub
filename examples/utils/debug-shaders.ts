import * as THREE from 'three';


export const debugShaders = (renderer: THREE.WebGLRenderer, isEnabled: boolean): void => {
	renderer.debug.checkShaderErrors = isEnabled;
	
	if (!isEnabled) {
		renderer.debug.onShaderError = null;
		return;
	}
	
	renderer.debug.onShaderError = (
		gl: WebGLRenderingContext,
		_program: WebGLProgram,
		vs: WebGLShader,
		fs: WebGLShader,
	) => {
		const parseForErrors = (shader: WebGLShader, name: string) => {
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
