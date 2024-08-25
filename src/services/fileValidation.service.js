const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');
const eventBus = require('../utils/eventBus.utils');
const {
	calculateFileChecksum,
	calculateBufferChecksum,
} = require('../utils/checksum.utils');
const moment = require('moment-timezone');

eventBus.on('ValidateChunks', (originalFilePath, chunkDir) => {
	const originalChecksum = calculateFileChecksum(originalFilePath);
	const timestamp = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');

	const chunkFiles = fs.readdirSync(chunkDir).sort();
	const concatenatedBuffer = Buffer.concat(
		chunkFiles.map(file => {
			const chunkPath = path.join(chunkDir, file);
			return fs.readFileSync(chunkPath);
		})
	);

	const concatenatedChecksum = calculateBufferChecksum(concatenatedBuffer);

	if (originalChecksum === concatenatedChecksum) {
		console.log(
			`[${timestamp}] Validation successful: No data loss in file ${originalFilePath}`
		);
	} else {
		console.error(
			`[${timestamp}] Validation failed: Data loss detected in file ${originalFilePath}`
		);
	}
});
