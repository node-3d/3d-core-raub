import glfw, { Document, Window } from 'glfw-raub';
import webgl from 'webgl-raub';
import { Image } from 'image-raub';

import WebVRManager from './js/core/vr-manager';


declare module "3d-core-raub" {
	type TUnknownObject = Readonly<{ [id: string]: unknown }>;
	
	type TLocation = Readonly<{
		href: string,
		ancestorOrigins: TUnknownObject,
		origin: string,
		protocol: string,
		host: string,
		hostname: string,
		port: string,
		pathname: string,
		search: string,
		hash: string,
	}>;
	
	type TNavigator = Readonly<{
		appCodeName: string,
		appName: string,
		appVersion: string,
		bluetooth: TUnknownObject,
		clipboard: TUnknownObject,
		connection: {
			onchange: null,
			effectiveType: string,
			rtt: number,
			downlink: number,
			saveData: boolean,
		},
		cookieEnabled: boolean,
		credentials: TUnknownObject,
		deviceMemory: number,
		doNotTrack: null,
		geolocation: TUnknownObject,
		hardwareConcurrency: number,
		keyboard: TUnknownObject,
		language: string,
		languages: string[],
		locks: TUnknownObject,
		maxTouchPoints: number,
		mediaCapabilities: TUnknownObject,
		mediaDevices: { ondevicechange: null },
		mimeTypes: { length: number },
		onLine: boolean,
		permissions: TUnknownObject,
		platform: string,
		plugins: { length: number },
		presentation: { defaultRequest: null, receiver: null },
		product: string,
		productSub: string,
		serviceWorker: {
			ready: Promise<boolean>,
			controller: null,
			oncontrollerchange: null,
			onmessage: null
		},
		storage: TUnknownObject,
		usb: {
			onconnect: null,
			ondisconnect: null,
		},
		userAgent: string,
		vendor: string,
		vendorSub: string,
		webkitPersistentStorage: TUnknownObject,
		webkitTemporaryStorage: TUnknownObject,
	}>;
	
	type TLoop = (cb: (i: number) => void) => void;
	
	type TCore3D = {
		/**
		 * Almost the same as `Image` in a browser. Also `document.createElement('img')`
		 * does the same thing as `new Image()`. For more info see
		 * [image-raub](https://github.com/node-3d/image-raub#image-for-nodejs).
		 */
		Image: typeof Image,
		
		/**
		 * This constructor spawns a new platform window **with a web-document like interface**.
		 * For more info see [glfw-raub](https://github.com/node-3d/glfw-raub#class-document).
		 */
		Document: typeof Document,
		
		/**
		 * This constructor spawns a new OS window.
		 * For more info see [glfw-raub](https://github.com/node-3d/glfw-raub#class-window).
		 */
		Window: typeof Window,
		
		/**
		 * A WebGL context instance. This is **almost** the same as real WebGL stuff.
		 * For more info see [webgl-raub](https://github.com/node-3d/webgl-raub#webgl-for-nodejs).
		 */
		gl: typeof webgl,
		
		/**
		 * Low level GLFW interface.
		 * For more info see glfw-raub](https://github.com/node-3d/glfw-raub#glfw-for-nodejs)
		 */
		glfw: typeof glfw,
		
		/**
		 * The default instance of Document - created automatically when `init()` is called.
		 */
		doc: Document,
		
		/**
		 * @alias doc
		 */
		canvas: Document,
		/**
		 * @alias doc
		 */
		document: Document,
		/**
		 * @alias doc
		 */
		window: Document,
		
		/**
		 * The default frame-loop helper, calls `requestAnimationFrame` automatically.
		 */
		loop: TLoop,
		
		/**
		 * Swaps GL buffers and calls the `cb` callback on next frame.
		 * @alias doc.requestAnimationFrame
		 */
		requestAnimationFrame: (cb: (dateNow: number) => void) => number,
	};
	
	type TPluginDecl = string | ((core3d: TCore3D) => void) | Readonly<{ name: string, opts: TUnknownObject }>;
	
	type TInitOpts = ConstructorParameters<typeof Document>[0] & Readonly<{
		/**
		 * Use GLES 3.2 profile instead of default.
		 *
		 * In this mode, shader augmentation is disabled, as the context becomes compatible
		 * with WebGL API set (as GLES intended). Some things, such as
		 * `texture.colorSpace = three.SRGBColorSpace;` work better or even exclusively
		 * in this mode.
		 */
		isGles3?: boolean,
		
		/**
		 * EXPERIMENTAL. Defines WebGL2 context, so three.js uses WebGL2 pathways.
		 *
		 * At this point, most of the stuff stops working in this mode. Some additional
		 * shader tweaks or API exports may be required to fully support running web
		 * libs in WebGL2 mode.
		 *
		 * Note: for non-web libs this has no effect, since it only affects common "isWebGL2" checks.
		 */
		isWebGL2?: boolean,
		
		/**
		 * An override for WebGL implementation.
		 */
		webgl?: typeof webgl,
		
		/**
		 * An override for Image implementation.
		 */
		Image?: Image,
		
		/**
		 * An override for GLFW implementation.
		 */
		glfw?: typeof glfw,
		
		/**
		 * An override for the `location` object.
		 */
		location?: TLocation,
		
		/**
		 * An override for the `navigator` object.
		 */
		navigator?: TNavigator,
		
		/**
		 * An override for the `WebVRManager` object.
		 */
		WebVRManager?: WebVRManager,
	}>;
	
	/**
	 * Initialize Node3D. Creates the first window/document and sets up the global environment.
	 * This function can be called repeatedly, but will ignore further calls.
	 * The return value is cached and will be returned immediately for repeating calls.
	 */
	export const init: (opts?: TInitOpts) => TCore3D;
	
	/**
	 * Teaches `three.FileLoader.load` to work with Node `fs`. Additionally implements
	 * `three.Texture.fromId` static method to create THREE textures from known GL resource IDs.
	 */
	export const addThreeHelpers: (three: TUnknownObject, gl: typeof webgl) => void;
}
