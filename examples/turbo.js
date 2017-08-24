'use strict';

const node3d  = require('../index');


const buffer = node3d.turbo.alloc(1e6);
const factor = 4;

for (let i = 0; i < 1e6; i++) {
	buffer.data[i] = i;
}

node3d.turbo.run(buffer, `void main(void) {
commit(read() * ${factor}.0);
}`);

console.log(buffer.data.subarray(0, 15));
