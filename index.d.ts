import { Document, Window } from 'glfw-raub';
import { Image, TImage } from 'image-raub';

import WebVRManager from './js/core/vr-manager';


declare module "3d-core-raub" {
	type TSomeObject = Readonly<{ [id: string]: unknown }>;
	
	type TLocation = Readonly<{
		href: string,
		ancestorOrigins: TSomeObject,
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
		bluetooth: TSomeObject,
		clipboard: TSomeObject,
		connection: {
			onchange: null,
			effectiveType: string,
			rtt: number,
			downlink: number,
			saveData: boolean,
		},
		cookieEnabled: boolean,
		credentials: TSomeObject,
		deviceMemory: number,
		doNotTrack: null,
		geolocation: TSomeObject,
		hardwareConcurrency: number,
		keyboard: TSomeObject,
		language: string,
		languages: string[],
		locks: TSomeObject,
		maxTouchPoints: number,
		mediaCapabilities: TSomeObject,
		mediaDevices: { ondevicechange: null },
		mimeTypes: { length: number },
		onLine: boolean,
		permissions: TSomeObject,
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
		storage: TSomeObject,
		usb: {
			onconnect: null,
			ondisconnect: null,
		},
		userAgent: string,
		vendor: string,
		vendorSub: string,
		webkitPersistentStorage: TSomeObject,
		webkitTemporaryStorage: TSomeObject,
	}>;
	
	type TInitOpts = Readonly<{
		webgl?: TSomeObject,
		Image?: Image,
		glfw?: TSomeObject,
		location?: TLocation,
		navigator?: TNavigator,
		WebVRManager?: WebVRManager,
		width?: number,
		height?: number,
		display?: number,
		vsync?: boolean,
		autoIconify?: boolean,
		fullscreen?: boolean,
		mode?: string,
		decorated?: boolean,
		msaa?: number,
		icon?: TImage,
		title?: string,
		shaderHacks?: unknown[],
		three?: TSomeObject,
		THREE?: TSomeObject,
		extend?: TSomeObject,
		plugins?: TSomeObject,
	}>;
	
	type TCore3D = {
		Image: typeof Image,
		Document: typeof Document,
		Window: typeof Window,
		
		gl: TSomeObject,
		webgl: TSomeObject,
		context: TSomeObject,
		
		glfw: TSomeObject,
		
		doc: Document,
		canvas: Document,
		document: Document,
		window: Document,
		
		three: TSomeObject,
		THREE: TSomeObject,
		
		loop,
		requestAnimationFrame,
		frame,
		
		[key: string]: unknown,
	};
	
	const init: (opts?: TInitOpts) => TCore3D;
	
	export = init;
}
