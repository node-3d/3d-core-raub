# Node.js 3D Core


Launch Node.js in WebGL mode.

* Shipped together with [three.js](https://github.com/mrdoob/three.js) for convenience.
* Multiple windows are supported, with help of [GLFW](http://www.glfw.org/).
* WebGL implementation is also using [GLEW](http://glew.sourceforge.net/).
* Image loading uses [FreeImage](http://freeimage.sourceforge.net/) encoder/decoder.
* Window icons are supported and both JS- and Image-friendly.


## Install

```
npm i -s 3d-core-raub
```

NOTE: The module depends on multiple compiled addons. It requires compilation tools
on your system. E.g. MSVS13 for Windows, where **ADMIN PRIVELEGED**
`npm i -g windows-build-tools` most likely helps. On Unix systems this is
usually not a problem at all.


## Exports


### class Image

Almost the same as Image in browser. This constructor can be used to create one.
Also `document.createElement('img')` does the same thing as `new Image()`.
For more info see
[the respective docs of node-image](https://github.com/raub/node-image#image-for-nodejs).


### class Window

This constructor spawns a new platform window.
For more info see
[the respective docs of node-glfw](https://github.com/raub/node-glfw#class-window).


### class Document extends Window

This constructor spawns a new platform window **with a web-document like interface**.
For more info see
[the respective docs of node-glfw](https://github.com/raub/node-glfw#class-document).


### doc, document, canvas

The default instance of Document. It is used to immediately initialize three.js.
This implies, that (the first occurance of) `require('node-3d-core-raub')`
results in a new platform window being immediately created.


### gl, webgl, context

A WebGL context instance. This is almost the same as real WebGL stuff.
Actually we seem to use OpenGL 2.1, GLSL 1.20. If you use pure-WebGL-specific
shaders, that is WebGL 1.0 GLSL 1.0, you might hit a trouble because of sintax shift in
GLSL 1.2 (`#version 120`). For more info see
[the respective docs of node-webgl](https://github.com/raub/node-webgl#webgl-for-nodejs).


### glfw

Low level GLFW interface. For more info see
[the respective docs of node-glfw](https://github.com/raub/node-glfw#glfw-for-nodejs).


### three, THREE

An instance of three.js. For more info see
[the respective docs of three.js](https://github.com/mrdoob/three.js/#threejs).


### frame(cb), requestAnimationFrame(cb)

What is known as `window.requestAnimationFrame`.
Function `cb` is called, whenever the default document is ready to produce a new
frame. The function is **BOUND** to the default document instance.


### loop(cb)

A convenience shortcut to induce `requestAnimationFrame`-driven render loop.
Function `cb` is called, whenever the default document is ready to produce a new
frame. The function is **BOUND** to the default document instance.
