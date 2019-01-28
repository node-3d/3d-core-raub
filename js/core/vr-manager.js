'use strict';


class WebVRManager {
	
	get enabled() { return false; }
	
	constructor() {}
	
	isPresenting() { return false; }
	dispose() {}
	setAnimationLoop() {}
	getCamera() { return {}; }
	submitFrame() {}
	
}


module.exports = WebVRManager;
