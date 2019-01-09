'use strict';

const { Screen, loop, three, Image } = require('../index');


const screen = new Screen();

const geometry = new three.IcosahedronGeometry(200, 1);
const material =  new three.MeshLambertMaterial({
	color: 0x888888 + Math.round((0xFFFFFF - 0x888888) * Math.random()),
	emissive: 0x333333,
});

const mesh = new three.Mesh(geometry, material);
screen.scene.add( mesh );

const pointLight = new three.PointLight(0xFFFFFF, 1, 100000);
screen.scene.add( pointLight );
pointLight.position.x = 200;
pointLight.position.y = 2000;
pointLight.position.z = 500;


loop(() => {
	mesh.rotation.x = Date.now() * 0.0005;
	mesh.rotation.y = Date.now() * 0.001;
	mesh.rotation.z = Date.now() * 0.0007;
	screen.draw();
});


const makeSnapshot = () => {
	
	// ====== GRAB PIXELS
	
	const memSize = screen.w * screen.h * 4; // estimated number of bytes
	const storage = {
		data: Buffer.allocUnsafeSlow(memSize),
	};
	
	screen.context.readPixels(
		0, 0,
		screen.w, screen.h,
		screen.context.RGBA,
		screen.context.UNSIGNED_BYTE,
		storage
	);
	
	// ====== MIMIC BMP
	
	// see https://en.wikipedia.org/wiki/BMP_file_format
	const dibSize = 40;
	const headerSize = 14 + dibSize;
	const bmpSize = headerSize + memSize;
	const fakeBmp = Buffer.allocUnsafeSlow(bmpSize);
	let pos = 0;
	
	// ---------- BMP header
	
	fakeBmp.write('BM', pos, 2, 'ascii');
	pos += 2;
	
	fakeBmp.writeUInt32LE(bmpSize, pos);
	pos += 4;
	
	pos += 4; // skip unused
	
	fakeBmp.writeUInt32LE(headerSize, pos);
	pos += 4;
	
	// ---------- DIB header
	
	fakeBmp.writeUInt32LE(dibSize, pos);
	pos += 4;
	
	fakeBmp.writeInt32LE(screen.w, pos);
	pos += 4;
	
	fakeBmp.writeInt32LE(screen.h, pos);
	pos += 4;
	
	fakeBmp.writeUInt16LE(1, pos);
	pos += 2;
	
	fakeBmp.writeUInt16LE(32, pos);
	pos += 2;
	
	fakeBmp.writeUInt32LE(0, pos);
	pos += 4;
	
	fakeBmp.writeUInt32LE(memSize, pos);
	pos += 4;
	
	fakeBmp.writeUInt32LE(0x0ec4, pos);
	pos += 4;
	
	fakeBmp.writeUInt32LE(0x0ec4, pos);
	pos += 4;
	
	fakeBmp.writeUInt32LE(0, pos);
	pos += 4;
	
	fakeBmp.writeUInt32LE(0, pos);
	pos += 4;
	
	// ---------- PIXELS
	
	storage.data.copy(fakeBmp, pos);
	
	// ====== STORE JPEG
	
	const img = new Image();
	img._load(fakeBmp);
	
	img.save(`${Date.now()}.jpg`);
	
};


setTimeout(makeSnapshot, 1000);
