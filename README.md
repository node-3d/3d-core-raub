# Node.js 3D Core

This is a part of [Node3D](https://github.com/node-3d) project.


## Synopsis

Launch **Node.js** in **WebGL** mode.

* Shipped together with [three.js](https://github.com/mrdoob/three.js) for convenience.
* Multiple windows are supported, with the help of [GLFW](http://www.glfw.org/).
* WebGL implementation is also using [GLEW](http://glew.sourceforge.net/).
* Image loading uses [FreeImage](http://freeimage.sourceforge.net/) encoder/decoder.
* Window icons are supported and both JS- and Image-friendly.


## Install

```
npm i -s 3d-core-raub
```

> Note: compilation tools must be in place on your system.
For Windows, use **ADMIN PRIVELEGED** command line:
\`npm i -g windows-build-tools\`.
Also **Windows** needs **vcredist 2013** to be installed.


## Exports


### class Image

Almost the same as `Image` in a browser. This constructor can be used to create one.
Also `document.createElement('img')` does the same thing as `new Image()`.
For more info see
[the respective docs of image-raub](https://github.com/node-3d/image-raub#image-for-nodejs).


### class Window

This constructor spawns a new platform window.
For more info see
[the respective docs of glfw-raub](https://github.com/node-3d/glfw-raub#class-window).


### class Document extends Window

This constructor spawns a new platform window **with a web-document like interface**.
For more info see
[the respective docs of glfw-raub](https://github.com/node-3d/glfw-raub#class-document).


### doc, document, canvas

The default instance of Document. It is used to immediately initialize three.js.
This implies, that (the first occurance of) `require('node-3d-core-raub')`
results in a new platform window being immediately created.


### gl, webgl, context

A WebGL context instance. This is almost the same as real WebGL stuff.
Actually we seem to use **OpenGL 2.1**, **GLSL 1.20**. If you use pure-WebGL-specific
shaders, that is **WebGL 1.0 GLSL 1.0**, you might hit a trouble because of sintax shift in
**GLSL 1.2** (`#version 120`). For more info see
[the respective docs of webgl-raub](https://github.com/node-3d/webgl-raub#webgl-for-nodejs).


### glfw

Low level GLFW interface. For more info see
[the respective docs of glfw-raub](https://github.com/node-3d/glfw-raub#glfw-for-nodejs).


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


### class Brush

Creates a screen-sized overlay, where a circle is drawn around the specified position.


### class Cloud

Base class for custom-VBO based geometries.


### class Drawable

Base class for all drawable classes exported by this module.


### class Points

A custom-VBO based point-cloud.


### class Lines

A custom-VBO based line-cloud.


### class Tris

A custom-VBO based triangle-cloud.


### class Rect

A single rectangle. Probably supports corner-radius


### class Screen

A further abstraction of Document, encapsulating some three.js-specific logics.


### class Surface

A Rect that mimics a Screen for drawable objects.
