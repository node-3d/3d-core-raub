'use strict';

const { Blob } = require('node:buffer');


const finishLoad = (three, responseType, mimeType, onLoad, buffer) => {
	if (responseType === 'arraybuffer') {
		onLoad((new Uint8Array(buffer)).buffer);
		return;
	}
	
	if (responseType === 'blob') {
		onLoad(new Blob([buffer]));
		return;
	}
	
	if (responseType === 'document') {
		onLoad({});
		return;
	}
	
	if (responseType === 'json') {
		try {
			onLoad(JSON.parse(buffer.toString()));
		} catch (_e) {
			onLoad({});
		}
		return;
	}
	
	if (!mimeType) {
		onLoad(buffer.toString());
		return;
	}
	
	// sniff encoding
	const re = /charset="?([^;"\s]*)"?/i;
	const exec = re.exec(mimeType);
	const label = exec && exec[1] ? exec[1].toLowerCase() : undefined;
	const decoder = new three.TextDecoder(label);
	
	onLoad(decoder.decode(buffer));
};


module.exports = (three, gl) => {
	three.FileLoader.prototype.load = function (url, onLoad, onProgress, onError) {
		// Data URI
		if (/^data:/.test(url)) {
			const [head, body] = url.split(',');
			const isBase64 = head.indexOf('base64') > -1;
			const data = isBase64 ? Buffer.from(body, 'base64') : Buffer.from(unescape(body));
			finishLoad(three, this.responseType, this.mimeType, onLoad, data);
			return;
		}
		
		// Remote URI
		if (/^https?:\/\//i.test(url)) {
			const download = require('addon-tools-raub/download');
			
			download(url).then(
				(data) => finishLoad(three, this.responseType, this.mimeType, onLoad, data),
				(err) => typeof onError === 'function' ? onError(err) : console.error(err)
			);
			
			return;
		}
		
		// Filesystem URI
		if (this.path !== undefined) {
			url = this.path + url;
		}
		require('fs').readFile(url, (err, data) => {
			if (err) {
				return typeof onError === 'function' ? onError(err) : console.error(err);
			}
			finishLoad(three, this.responseType, this.mimeType, onLoad, data);
		});
	};
	
	three.Texture.fromId = (id, renderer) => {
		const rawTexture = gl.createTexture();
		rawTexture._ = id;
		
		const texture = new three.Texture();
		
		let properties = null;
		if (!renderer.properties) {
			properties = texture;
		} else {
			properties = renderer.properties.get(texture); // !!!!
		}
		
		properties.__webglTexture = rawTexture;
		properties.__webglInit = true;
		
		return texture;
	};
};
