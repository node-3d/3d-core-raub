
import sharp from 'sharp';
import {
    DataTexture, LinearSRGBColorSpace, NoToneMapping, SRGBColorSpace, Uniform, WebGLRenderer,
} from 'three';

import { init } from '../../js';
import { SimpleTextureProcessor } from './simple_texture_processor';

(init as (opts: unknown) => void)({
    isGles3: true,
    isWebGL2: true,
    isVisible: false,
});

const renderer = new WebGLRenderer({
    antialias: false,
    alpha: false,
    depth: false,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: false,
});
renderer.shadowMap.autoUpdate = false;
renderer.outputColorSpace = LinearSRGBColorSpace;
renderer.toneMapping = NoToneMapping;

renderer.debug.checkShaderErrors = true;
renderer.debug.onShaderError  = (gl, _program, vs, fs) => {
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
    }
    
    parseForErrors(vs, 'Vertex Shader');
    parseForErrors(fs, 'Fragment Shader');
};

const processor = new SimpleTextureProcessor(512, renderer);

// A simple shader that passes through the texture
const shader = `
    uniform sampler2D tex;
    
    void main() {
      vec2 vUv = gl_FragCoord.xy / resolution.xy;
      gl_FragColor = texture2D( tex, vUv );
    }
`;

/** Create a datatexture of size 512x512 filled with constant value */
function createDataTexture() {
    const texture = new DataTexture();
    texture.image = {
        data: new Uint8ClampedArray(512 * 512 * 4).fill(100, 0, 512 * 512 * 2).fill(200, 512 * 512 * 2),
        width: 512,
        height: 512,
    };
    return texture;
}

function processAndSave(savePath: string, texture: DataTexture) {
    const res = processor.process(shader, {
        tex: new Uniform(texture),
    });
    console.log(res.slice(0, 4));
    
    sharp(Buffer.from(res), {
        raw: { width: 512, height: 512, channels: 4 },
    }).toFile(savePath, function (err: any) {
        if (err) throw err;
    });
}

console.log('LinearSRGBColorSpace');
const texture2 = createDataTexture();
texture2.colorSpace = LinearSRGBColorSpace;
texture2.needsUpdate = true;
processAndSave('screenshot-linear.png', texture2);

console.log('SRGBColorSpace');
const texture3 = createDataTexture();
texture3.colorSpace = SRGBColorSpace;
texture3.needsUpdate = true;
processAndSave('screenshot-srgb.png', texture3);
