'use strict';

const fs = require('node:fs');

const { doc, Image } = require('./init');


const pixelThreshold = 0.2; // threshold error in one pixel
const maxFailedPixels = 100; // total failed pixels

const makePathDiff = (name) => `test/__diff__/${name}.png`;
const makePathExpected = (name) => `test/__diff__/${name}__expected__.png`;
const makePathActual = (name) => `test/__diff__/${name}__actual__.png`;
const makePathExport = (name) => `__screenshots__/${name}.png`;


const allocBuffer = () => {
	const memSize = doc.w * doc.h * 4; // estimated number of bytes
	return Buffer.allocUnsafeSlow(memSize);
};

const getImage = () => {
	try {
		const storage = { data: allocBuffer() };
		
		doc.context.readPixels(
			0, 0,
			doc.w, doc.h,
			doc.context.RGBA,
			doc.context.UNSIGNED_BYTE,
			storage
		);
		
		const img = Image.fromPixels(doc.w, doc.h, 32, storage.data);
		return img;
	} catch (error) {
		console.error(error);
		return null;
	}
};


const makeScreenshot = (name) => {
	console.info(`Screenshot: ${name}`);
	const img = getImage();
	if (img) {
		img.save(makePathExport(name));
		console.info(`Screenshot: ${name} generated`);
	}
};

const compareScreenshot = async (name) => {
	const path = makePathExport(name);
	if (!fs.existsSync(path)) {
		console.error(`Warning! No such screenshot: ${name}.`);
		return false;
	}
	
	const actualImage = getImage();
	if (!actualImage) {
		return false;
	}
	
	const expectedImage = await Image.loadAsync(path);
	
	const diff = allocBuffer();
	
	let numFailedPixels = 0;
	
	try {
		const { default: pixelmatch } = await import('pixelmatch');
		
		numFailedPixels = pixelmatch(
			expectedImage.data,
			actualImage.data,
			diff,
			actualImage.width,
			actualImage.height,
			{
				threshold: pixelThreshold,
				alpha: 0.3,
				diffMask: false,
				diffColor: [255, 0, 0],
			},
		);
	} catch (error) {
		console.error(error);
		return false;
	}
	
	const pathDiff = makePathDiff(name);
	
	if (numFailedPixels) {
		console.warn(`Screenshot: ${name} - ${numFailedPixels}/${maxFailedPixels}.`);
		const pathExpected = makePathExpected(name);
		const pathActual = makePathActual(name);
		actualImage.save(pathActual);
		expectedImage.save(pathExpected);
		
		const diffImage = Image.fromPixels(doc.w, doc.h, 32, diff);
		diffImage.save(pathDiff);
		
		const isError = numFailedPixels >= maxFailedPixels;
		console[isError ? 'error' : 'warn']([
			`Screenshot: ${name}.`,
			`Failed pixels: ${numFailedPixels}/${maxFailedPixels}.`,
			`Diff written: ${pathDiff}.`,
		].join('\n'));
		
		return !isError;
	}
	
	return true;
};


const screenshot = async (name) => {
	try {
		const path = makePathExport(name);
		
		const isCi = !!process.env['CI'];
		const hasFile = fs.existsSync(path);
		
		if (!hasFile && !isCi) {
			await makeScreenshot(name);
			return true;
		}
		
		return compareScreenshot(name);
	} catch (error) {
		console.error(error);
		return false;
	}
};

module.exports = { screenshot };