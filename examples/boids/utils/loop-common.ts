import { type TMouseMoveEvent } from 'glfw-raub';
import node3d from '../../../index.js';
import { countFrame } from '../../utils/perf.ts';

type TCbLoop = (now: number, dt: number, mouse: [number, number]) => void;

export const loopCommon = (isPerf: boolean, cb: TCbLoop) => {
	const { doc, loop } = node3d.init();
	
	let mouseX = -10000;
	let mouseY = -10000;
	
	doc.on('mousemove', (event) => {
		const windowHalfX = window.innerWidth / 2;
		const windowHalfY = window.innerHeight / 2;
		mouseX = (event as TMouseMoveEvent).clientX - windowHalfX;
		mouseY = (event as TMouseMoveEvent).clientY - windowHalfY;
	});
	
	let last: number = performance.now();
	
	return loop((now: number) => {
		let delta = (now - last) / 1000;
		
		if (delta > 0.1) {
			delta = 0.1; // safety cap on large deltas
		}
		last = now;
		
		let windowHalfX = window.innerWidth / 2;
		let windowHalfY = window.innerHeight / 2;
		
		cb(now, delta, [0.5 * mouseX / windowHalfX, - 0.5 * mouseY / windowHalfY]);
		
		if (isPerf) {
			countFrame(now);
		}
	});
};
