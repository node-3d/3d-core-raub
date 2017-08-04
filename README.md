# node-3d-ready

Launch node.js in WebGL mode. Shipped together with three.js for convenience.

## Exports

### Image

Almost the same as Image in browser. This constructor can be used to create one.
Also `document.createElement('img')` does the same thing as `new Image()`.


### doc, document, canvas

Something in between what is known as `document` and a `<canvas>` element.
For example you can call `createElement` on it, but also it has `width, height, style` of
a `<canvas>`.


### gl, context

A WebGL context instance. This is almost the real WebGL stuff, well, except it isn't.
Actually as of now we seem to use OpenGL 2.1, GLSL 1.20. So there is a hack for
three.js prepending `#version 100` to all of its shaders. And if you write pure WebGL
shaders that is WebGL 1.0, GLSL 1.0, you might hit a trouble because of sintax shift in
GLSL 1.2 which is default here (`#version 120`). Hence either write more modern GLSL
under this environment or specify `#version 100` and write the old code, it's up to you.


### three

An instance of three.js, usually known as `THREE`. If you want to go conservative
about it, you might also put it there: `global.THREE = node3d.three;`. I won't judge.


### loadTexture

A convenience method for three.js to give a hand with texture loading. It has four
parameters:

* url - where to get an image

* onLoad(tex) - gives you a three.js texture, after image is loaded

* onProgress - seems to be somewhat useless here

* onError - error handling callback

It internally uses THREE.TextureLoader.load which, as you might have noticed has the
same parameter layout.


### renderer

An instance of three.js renderer. It has rather simplistic setup, but knows what to do.


### frame

Convenience shortcut for `document.requestAnimationFrame`.

