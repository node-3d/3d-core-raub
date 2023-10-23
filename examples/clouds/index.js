/* eslint-disable no-unreachable */
/* eslint-disable no-loss-of-precision */
/* eslint-disable no-redeclare */
/* eslint-disable no-async-promise-executor */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable camelcase */
const { readFileSync } = require('node:fs');
const Image = require('image-raub');
const { write } = require('addon-tools-raub');

const { init } = require('../../index');
const { resolveObjectURL } = require('node:buffer');

const {
	doc, requestAnimationFrame, gl: webgl,
} = init({
	isGles3: true,
	isWebGL2: true,
	autoEsc: true,
	autoFullscreen: true,
});

const icon = new Image(__dirname + '/favicon.ico');
icon.on('load', () => { doc.icon = icon; });
doc.title = 'Weather Sandbox';

global.alert = () => undefined;
global.confirm = () => true;
global.prompt = () => 'clouds';

const addEventListener = doc.addEventListener.bind(doc);

const graphCanvas = {
	getContext: () => ({}),
	height: 1,
	style: {},
	width: 1,
};

const mockElements = {
	fileInput: { files: [], value: '' },
	simResSelX: { value: 2500 },
	simResSelY: { value: 300 },
	simHeightSel: { value: 12000 },
	IntroScreen: { parentNode: { removeChild: () => undefined } },
	mainCanvas: doc,
	graphCanvas,
};

const _getElementById = doc.getElementById.bind(doc);
doc.getElementById = (tag) => {
	if (mockElements[tag]) {
		return mockElements[tag];
	}
	
	return _getElementById();
};

const _createElement = doc.createElement.bind(doc);
doc.createElement = (tag) => {
	if (tag === 'a' || tag === 'div') {
		return {
			tag,
			parentNode: { removeChild: () => undefined },
			appendChild() {},
			attributes: {},
			setAttribute(name, value) { this.attributes[name] = value; },
			style: {},
			click() {
				if (tag === 'a') {
					(async () => {
						const url = this.attributes.href;
						let data = null;
						
						if (/^blob:nodedata:/.test(url)) { // Object URL
							const blob = resolveObjectURL(url);
							const arrayBuffer = await blob.arrayBuffer();
							data = Buffer.from(arrayBuffer);
						} else if (/^data:/.test(url)) { // Data URI
							const [head, body] = url.split(',');
							const isBase64 = head.indexOf('base64') > -1;
							data = isBase64 ? Buffer.from(body, 'base64') : Buffer.from(unescape(body));
						} else {
							return;
						}
						
						await write(this.attributes.filename, data);
					})();
				}
			},
		};
	}
	
	if (tag === 'canvas') {
		return {
			height: 0,
			width: 0,
			getContext: () => ({
				beginPath: () => undefined,
				clearRect: () => undefined,
				drawImage: () => undefined,
				fill: () => undefined,
				fillRect: () => undefined,
				fillStyle: () => undefined,
				fillText: () => undefined,
				font: () => undefined,
				rect: () => undefined,
				getElementById: () => undefined,
				lineTo: () => undefined,
				lineWidth: () => undefined,
				moveTo: () => undefined,
				stroke: () => undefined,
				strokeRect: () => undefined,
				strokeStyle: () => undefined,
			}),
			addEventListener: () => undefined,
			parentElement: { removeChild: () => undefined },
			style: {},
			remove: () => undefined,
		};
	}
	
	return _createElement(tag);
};

let i, resArray, lastWheel, imgElement, reachedSaturation;

global.dat = {
	GUI: function () {
		this.add = () => this;
		this.listen = () => this;
		this.name = () => this;
		this.onChange = () => this;
		this.addFolder = () => this;
		this.destroy = () => undefined;
		this.hide = () => undefined;
		this.show = () => undefined;
		this.width = 0;
	},
};

global.XMLHttpRequest = class XMLHttpRequest {
	constructor() {
		this.status = 200;
	}
	open(_method, path) {
		this.responseText = readFileSync(`${__dirname}/${path}`).toString();
	}
	send() {}
};

require('./app');