import { glfw } from 'glfw-raub';

declare module "3d-core-raub" {
	type TInitOpts = Readonly<{
		webgl?: unknown,
		Image?: unknown,
		glfw?: unknown,
		location?: unknown,
		navigator?: unknown,
		WebVRManager?: unknown,
		width?: unknown,
		height?: unknown,
		display?: unknown,
		vsync?: unknown,
		autoIconify?: unknown,
		fullscreen?: unknown,
		mode?: unknown,
		decorated?: unknown,
		msaa?: unknown,
		icon?: unknown,
		title?: unknown,
		shaderHacks?: unknown,
		three?: unknown,
		THREE?: unknown,
		extend?: unknown,
		plugins?: unknown,
	}>;
	
	type TCore3D = {
		Image,
		Document,
		Window,
		
		gl,
		webgl,
		context : gl,
		
		glfw,
		
		doc,
		canvas,
		document : doc,
		window   : doc,
		
		three,
		THREE : three,
		
		loop,
		requestAnimationFrame : doc.requestAnimationFrame,
		frame                 : doc.requestAnimationFrame,
		
		[key: string]: unknown,
	};
	
	const init = (opts?: TInitOpts) => {};
	
	export = init;
}
