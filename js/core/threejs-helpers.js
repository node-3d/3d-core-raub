'use strict';

module.exports = three => {
	
	three.FileLoader.prototype.load = (url, onLoad, onProgress, onError) => {
		
		// Data URI
		if (/^data:/.test(url)) {
			
			const [head, body] = url.split(',');
			const isBase64 = head.indexOf('base64') > -1;
			const data = isBase64 ? Buffer.from(body, 'base64') : Buffer.from(unescape(body));
			onLoad(data);
			return;
			
		}
		
		// Remote URI
		if (/^https?:\/\//i.test(url)) {
			
			const download = require('addon-tools-raub/download');
			
			download(url).then(
				data => onLoad(data),
				err => typeof onError === 'function' ? onError(err) : console.error(err)
			);
			
			return;
			
		}
		
		// Filesystem URI
		require('fs').readFile(url, (err, data) => {
			if (err) {
				return typeof onError === 'function' ? onError(err) : console.error(err);
			}
			onLoad(data);
		});
		
	};
	
	
	const _load = three.TextureLoader.prototype.load;
	three.TextureLoader.prototype.load = function (url, onLoad, onProgress, onError) {
		const cb = tex => {
			tex.format = three.RGBAFormat;
			if (onLoad) {
				onLoad(tex);
			}
		};
		return _load.call(this, url, cb, onProgress, onError);
	};
	
	
	three.Texture.fromId = (id, renderer) => {
		
		const rawTexture = gl.createTexture();
		rawTexture._ = id;
		
		const texture = new three.Texture();
		
		let properties = null;
		if ( ! renderer.properties ) {
			properties = texture;
		} else {
			properties = renderer.properties.get(texture); // !!!!
		}
		
		properties.__webglTexture = rawTexture;
		properties.__webglInit = true;
		
		return texture;
		
	};
	
};
