declare namespace node3d {
	type EventEmitter = import('node:events').EventEmitter;
	type Img = typeof import('image-raub');
	type TThree = typeof import('three');
	type TScene = import('three').Scene;
	type TRenderer = import('three').WebGLRenderer;
	type TCamera = import('three').Camera;
	type TWebgl = typeof import('webgl-raub');
	type TImage = typeof import('image-raub');
	type TGlfw = typeof import('glfw-raub');
	type TDocumentOpts = import('glfw-raub').TDocumentOpts;
	type Document = import('glfw-raub').Document;
	type Window = import('glfw-raub').Window;
	
	
	type TUnknownObject = Readonly<{ [id: string]: unknown }>;
	
	class WebVRManager {
		readonly enabled: boolean;
		
		constructor();
		
		isPresenting(): boolean;
		dispose(): void;
		setAnimationLoop(): void;
		getCamera(): TUnknownObject;
		submitFrame(): void;
	}
	
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
			onchange: unknown,
			effectiveType: string,
			rtt: number,
			downlink: number,
			saveData: boolean,
		},
		cookieEnabled: boolean,
		credentials: TUnknownObject,
		deviceMemory: number,
		doNotTrack: unknown,
		geolocation: TUnknownObject,
		hardwareConcurrency: number,
		keyboard: TUnknownObject,
		language: string,
		languages: string[],
		locks: TUnknownObject,
		maxTouchPoints: number,
		mediaCapabilities: TUnknownObject,
		mediaDevices: { ondevicechange: unknown },
		mimeTypes: { length: number },
		onLine: boolean,
		permissions: TUnknownObject,
		platform: string,
		plugins: { length: number },
		presentation: { defaultRequest: unknown, receiver: unknown },
		product: string,
		productSub: string,
		serviceWorker: {
			ready: Promise<boolean>,
			controller: unknown,
			oncontrollerchange: unknown,
			onmessage: unknown
		},
		storage: TUnknownObject,
		usb: {
			onconnect: unknown,
			ondisconnect: unknown,
		},
		userAgent: string,
		vendor: string,
		vendorSub: string,
		webkitPersistentStorage: TUnknownObject,
		webkitTemporaryStorage: TUnknownObject,
	}>;
	
	type TScreenOpts = Readonly<{
		three?: TThree,
		THREE?: TThree,
		gl?: TWebgl,
		doc?: Document,
		document?: Document,
		Image?: TImage,
		title?: string,
		camera?: TCamera,
		scene?: TScene,
		renderer?: TRenderer,
		fov?: number,
		near?: number,
		far?: number,
		z?: number,
	}>;
	
	export class Screen implements EventEmitter {
		constructor(opts?: TScreenOpts);
		
		readonly context: TWebgl;
		readonly three: TThree;
		readonly renderer: TRenderer;
		readonly scene: TScene;
		readonly camera: TCamera;
		
		readonly document: Document;
		readonly canvas: Document;
		
		readonly width: number;
		readonly height: number;
		readonly w: number;
		readonly h: number;
		readonly size: TThree['Vector2'];
		
		title: string;
		icon: Document['icon'];
		fov: number;
		mode: Document['mode'];
		
		draw(): void;
		snapshot(name?: string): void;
		
		
		// ------ implements EventEmitter
		
		addListener(eventName: string | symbol, listener: (...args: any[]) => void): this;
		on(eventName: string | symbol, listener: (...args: any[]) => void): this;
		once(eventName: string | symbol, listener: (...args: any[]) => void): this;
		removeListener(eventName: string | symbol, listener: (...args: any[]) => void): this;
		off(eventName: string | symbol, listener: (...args: any[]) => void): this;
		removeAllListeners(event?: string | symbol): this;
		setMaxListeners(n: number): this;
		getMaxListeners(): number;
		listeners(eventName: string | symbol): Function[];
		rawListeners(eventName: string | symbol): Function[];
		emit(eventName: string | symbol, ...args: any[]): boolean;
		listenerCount(eventName: string | symbol, listener?: Function): number;
		prependListener(eventName: string | symbol, listener: (...args: any[]) => void): this;
		prependOnceListener(eventName: string | symbol, listener: (...args: any[]) => void): this;
		eventNames(): Array<string | symbol>;
	}

	
	type TCore3D = {
		/**
		 * Almost the same as `Image` in a browser. Also `document.createElement('img')`
		 * does the same thing as `new Image()`. For more info see
		 * [image-raub](https://github.com/node-3d/image-raub#image-for-nodejs).
		 */
		Image: Img,
		
		/**
		 * This constructor spawns a new platform window **with a web-document like interface**.
		 * For more info see [glfw-raub](https://github.com/node-3d/glfw-raub#class-document).
		 */
		Document: TGlfw['Document'],
		
		/**
		 * This constructor spawns a new OS window.
		 * For more info see [glfw-raub](https://github.com/node-3d/glfw-raub#class-window).
		 */
		Window: TGlfw['Window'],
		
		/**
		 * A WebGL context instance. This is **almost** the same as real WebGL stuff.
		 * For more info see [webgl-raub](https://github.com/node-3d/webgl-raub#webgl-for-nodejs).
		 */
		gl: TWebgl,
		
		/**
		 * Low level GLFW interface.
		 * For more info see glfw-raub](https://github.com/node-3d/glfw-raub#glfw-for-nodejs)
		 */
		glfw: TGlfw,
		
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
		 * Optimized loop method that will continuously generate frames with given `cb`.
		 *
		 * The returned function may be called to break the loop.
		 * @alias doc.loop
		*/
		loop(cb: (dateNow: number) => void): (() => void);
		
		/**
		 * Similar to `requestAnimationFrame` on web. It uses `setImmediate`, and can
		 * therefore be cancelled (with `doc.cancelAnimationFrame`).
		 *
		 * On immediate, it will process events (input), then call `cb`, then swap buffers.
		 * Swap buffers is blocking when VSYNC is on - that's how FPS is sync'd.
		 * @alias doc.requestAnimationFrame
		 */
		requestAnimationFrame: (cb: (dateNow: number) => void) => number,
		
		/**
		 * A wrapper for `document` that automates some common operations.
		 *
		 * * Pass `three`, or `THREE`. If not, it will refer to `global.THREE`
		 * * Pass your own `camera`, or it will create a new one - with default parameters, or yours.
		 * * Pass your `scene`, or it will create a new one.
		 * * Pass a `renderer`, or don't - that's just fine.
		 * * Call `screen.draw()` - equivalent of `renderer.render(scene, camera)`.
		 *
		 * It will also propagate the `document` input events and handle the `'mode'` event.
		 * The latter is important to correctly update any VAO-based geometry. The `'mode'`
		 * event will be propagated after necessary handling (re-creation of `renderer`).
		 */
		Screen: typeof Screen,
	};
	
	type TPluginDecl = string | ((core3d: TCore3D) => void) | Readonly<{ name: string, opts: TUnknownObject }>;
	
	type TInitOpts = TDocumentOpts & Readonly<{
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
		 * Is default window visible?
		 *
		 * For "headless" mode, use `false`. The window will be created in GLFW hidden mode
		 * (this is how headless GL works anyway). The default value is `true` - visible window.
		 */
		isVisible?: boolean,
		
		/**
		 * An override for WebGL implementation.
		 */
		webgl?: TWebgl,
		
		/**
		 * An override for Image implementation.
		 */
		Image?: Img,
		
		/**
		 * An override for GLFW implementation.
		 */
		glfw?: TGlfw,
		
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
	export const addThreeHelpers: (three: TThree, gl: TWebgl) => void;

}

export = node3d;

