'use strict';

const https = require('https');
const http  = require('http');

const WritableBuffer = require('./writable-buffer');


const protocols = { http, https };


module.exports = url => new Promise(
	(res, rej) => {
		
		url = url.toLowerCase();
		
		const stream = new WritableBuffer();
		const proto  = protocols[url.match(/^https?/)[0]];
		
		proto.get(url, response => {
			
			response.pipe(stream);
			
			response.on('end', () => res(stream.get()));
			response.on('error', err => rej(err));
			
		});
		
	}
);
