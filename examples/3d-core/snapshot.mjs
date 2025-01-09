import { screen } from './tris.mjs';

screen.title = 'Snapshot';
setTimeout(() => {
	const time = Date.now();
	
	screen.snapshot(`${time}.png`);
	
	console.log(`Saved to "${time}.png".`);
	setTimeout(() => process.exit(0), 1000);
}, 1000);
