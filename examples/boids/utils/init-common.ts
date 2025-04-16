import * as THREE from 'three';
import node3d, { type Screen, type TCore3D } from '../../../index.js';
import { debugShaders } from '../../utils/debug-shaders.ts';

const { init, addThreeHelpers } = node3d;

type TInitResult = {
	doc: TCore3D['doc'],
	screen: Screen,
	loop: TCore3D['loop'],
	gl: TCore3D['gl'],
};

export const initCommon = (isPerf: boolean, title: string): TInitResult => {
	const {
		doc, gl, Screen, loop,
	} = init({
		isGles3: true,
		isWebGL2: true,
		autoEsc: true,
		autoFullscreen: true,
		title,
		vsync: !isPerf,
	});
	addThreeHelpers(THREE, gl);
	
	const screen = new Screen({ three: THREE, fov: 75, near: 1, far: 2000 });
	screen.camera.position.z = 350;
	
	debugShaders(screen.renderer, true);
	
	// screen.scene.background = new THREE.Color(0x87ceeb);
	// screen.scene.background = new THREE.Color(0xffffff);
	// screen.scene.background = new THREE.Color(0x0);
	// screen.scene.fog = new THREE.Fog(0x87ceeb, 100, 1000);
	
	return {
		doc, screen, loop, gl,
	};
};
