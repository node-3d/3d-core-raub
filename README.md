# Node.js 3D Core

This is a part of [Node3D](https://github.com/node-3d) project.

[![NPM](https://badge.fury.io/js/3d-core-raub.svg)](https://badge.fury.io/js/3d-core-raub)
[![ESLint](https://github.com/node-3d/3d-core-raub/actions/workflows/eslint.yml/badge.svg)](https://github.com/node-3d/3d-core-raub/actions/workflows/eslint.yml)
[![Test](https://github.com/node-3d/3d-core-raub/actions/workflows/test.yml/badge.svg)](https://github.com/node-3d/3d-core-raub/actions/workflows/test.yml)

```console
npm i -s 3d-core-raub
```

> This package uses pre-compiled Node.js addons. **There is no compilation** during `npm i`.
The addons are compiled for: Win64, Linux64, Linux ARM64, MacOS ARM64.

![Example](examples/screenshot.png)

* WebGL/OpenGL on **Node.js** with support for web libs, such as **three.js**.
* Multi-window apps, low-level window control with [glfw-raub](https://github.com/node-3d/glfw-raub).
* Modern OpenGL functions also available, see [webgl-raub](https://github.com/node-3d/webgl-raub).
* Image loading/saving in popular formats with [image-raub](https://github.com/node-3d/image-raub).

This module exports 2 methods:
1. `export const init: (opts?: TInitOpts) => TCore3D;`
    
    Initialize Node3D. Creates the first window/document and sets up the global environment.
    This function can be called repeatedly, but will ignore further calls.
    The return value is cached and will be returned immediately for repeating calls.
2. `export const addThreeHelpers: (three: TUnknownObject, gl: typeof webgl) => void;`
    
    Teaches `three.FileLoader.load` to work with Node `fs`. Additionally implements
    `three.Texture.fromId` static method to create THREE textures from known GL resource IDs.


See [TS declarations](/index.d.ts) for more details.

## Example

(As in [crate-lean.mjs](/examples/crate-lean.mjs)):

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

loop((now) => {
	mesh.rotation.x = now * 0.0005;
	mesh.rotation.y = now * 0.001;
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
	(which creates a separate OpenGL context) is up to you.
	Basically, `doc.on('mode', () => {...})` -
	here you should [re-create THREE.WebGLRenderer](/js/objects/screen.js#L127).


## OpenGL Features

1. This is real **native OpenGL**, and you have direct access to GL resource IDs. This may be
	useful for resource sharing and compute interop (such as
	[CUDA-GL interop](https://docs.nvidia.com/cuda/cuda-runtime-api/group__CUDART__OPENGL.html)).
1. The flag `isGles3` lets you use a **GL ES 3** preset, which is closest to "real" WebGL.
	If set to `false`, WebGL stuff (such as three.js) will still work, but now with some hacks.
	However, if you are planning to use non-WebGL features (e.g. **OpenGL 4.5** features),
	you might want it off, and then select a specific context version manually.
1. The flag `isWebGL2` impacts how web libraries recognize the WebGL version.
	But it doesn't really change the capabilities of the engine.
1. **Offscreen rendering** is possible on Windows and Linux, as demonstrated by the tests
	running in GitHub Actions. There are test cases that generate and compare screenshots,
	and they do work in headless mode.
1. OpenGL **context sharing** is enabled. You can obtain `HDC, HWND, CTX` for Windows and whatever
	those are called on Linux and MacOS. See [glfw-raub](https://github.com/node-3d/glfw-raub).


## License

**You get this for free. Have fun!**

Some of the components have their separate licenses, but all of them may be used
commercially, without royalty.
