# Node.js 3D Core

This is a part of [Node3D](https://github.com/node-3d) project.

[![NPM](https://badge.fury.io/js/3d-core-raub.svg)](https://badge.fury.io/js/3d-core-raub)
[![ESLint](https://github.com/node-3d/3d-core-raub/actions/workflows/eslint.yml/badge.svg)](https://github.com/node-3d/3d-core-raub/actions/workflows/eslint.yml)
[![Test](https://github.com/node-3d/3d-core-raub/actions/workflows/test.yml/badge.svg)](https://github.com/node-3d/3d-core-raub/actions/workflows/test.yml)

```console
npm i -s 3d-core-raub
```

Run **WebGL** code on **Node.js**.

![Example](examples/screenshot.png)

> Note: Since version 4.0.0, [three.js](https://github.com/mrdoob/three.js) is a peer dependency.
Please install your version of choise and call `addThreeHelpers` before drawing frames.

* Multiple windows are supported, using [GLFW](http://www.glfw.org/) for window management.
* WebGL implementation is not 100% accurate, but good enough to run three.js examples.
* The C++ bindings use [GLEW](http://glew.sourceforge.net/) to access all the OpenGL functions.
* Image loading uses [FreeImage](http://freeimage.sourceforge.net/) encoder/decoder.
* Window icons are supported and both JS- and Image-friendly.

> Note: this package uses a bunch of **N-API addons**, which are ABI-compatible across
different Node.js versions. Addon binaries are precompiled and **there is no compilation**
step during the `npm i` command.


This module exports 2 methods:
1. `export const init: (opts?: TInitOpts) => TCore3D;`
    
    Initialize Node3D. Creates the first window/document and sets up the global environment.
    This function can be called repeatedly, but will ignore further calls.
    The return value is cached and will be returned immediately for repeating calls.
2. `export const addThreeHelpers: (three: TUnknownObject, gl: typeof webgl) => void;`
    
    Teaches `three.FileLoader.load` to work with Node `fs`. Additionally implements
    `three.Texture.fromId` static method to create THREE textures from known GL resource IDs.


See [TypeScript defenitions](/index.d.ts) for more details.

Example (as in [crate-lean.mjs](/examples/crate-lean.mjs)):

```javascript
import * as THREE from 'three';
import node3d from '../index.js';
const { init, addThreeHelpers } = node3d;

const { gl, loop, Screen } = init({
	isGles3: true, vsync: true, autoEsc: true, autoFullscreen: true, title: 'Crate',
});
addThreeHelpers(THREE, gl);
const screen = new Screen({ three: THREE, fov: 70, z: 2 });

const texture = new THREE.TextureLoader().load('three/textures/crate.gif');
texture.colorSpace = THREE.SRGBColorSpace;
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ map: texture });
const mesh = new THREE.Mesh(geometry, material);
screen.scene.add(mesh);

loop(() => {
	const time = Date.now();
	mesh.rotation.x = time * 0.0005;
	mesh.rotation.y = time * 0.001;
	screen.draw();
});
```

Example Notes:

1. You can use **mjs**, **tsx** or commonjs with `require()`.
1. `loop` is a convenience method, you can use `requestAnimationFrame` too.
1. `autoFullscreen` option enables "CTRL+F", "CTRL+SHIFT+F", "CTRL+ALT+F" to switch
	window modes.
1. `Screen` helps with **three.js**-oriented resource management, but is not required.
1. **three.js** uses VAO, so if not using `Screen`, handling the window mode changes
	(creates a separate OpenGL context) is up to you. Basically, `doc.on('mode', () => {...})` -
	here you should [re-create THREE.WebGLRenderer](/js/objects/screen.js#L127).
