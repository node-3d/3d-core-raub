'use strict';

const { Writable } = require('stream');

const CHUNK_SIZE = 1024;
const INITIAL_SIZE = 8 * CHUNK_SIZE;
const INCREMENT_SIZE = 8 * CHUNK_SIZE;


class WritableBuffer extends Writable {
	
	constructor() {
		
		super();
		
		this._buffer = new Buffer(INITIAL_SIZE);
		this._size = 0;
		
	}
	
	get() {
		
		if ( ! this._size ) {
			return null;
		}
		
		const data = new Buffer(this._size);
		this._buffer.copy(data, 0, 0, this._size);
		
		return data;
		
	}
	
	
	_increaseAsNeeded(incomingSize) {
		
		if ( (this._buffer.length - this._size) >= incomingSize ) {
			return;
		}
		
		const freeSpace = this._buffer.length - this._size;
		const factor = Math.ceil((incomingSize - freeSpace) / INCREMENT_SIZE);
		
		const newBuffer = new Buffer(this._buffer.length + (INCREMENT_SIZE * factor));
		this._buffer.copy(newBuffer, 0, 0, this._size);
		
		this._buffer = newBuffer;
		
	}
	
	
	_write(chunk, encoding, callback) {
		
		this._increaseAsNeeded(chunk.length);
		
		chunk.copy(this._buffer, this._size, 0);
		this._size += chunk.length;
		
		callback();
		
	}
	
}

module.exports = WritableBuffer;
