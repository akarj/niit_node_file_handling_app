// const path = require('path');
// const fs = require('fs-extra');
// const eventBus = require('../utils/eventBus.utils');
// const { chunkFile } = require('../utils/fileUtils.utils');
// const outputDir = path.join(__dirname, '../../output');
// const chunkSize = '10m';
// const moment = require('moment-timezone');

// eventBus.on('ProcessFile', async filePath => {
// 	const timestamp = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
// 	try {
// 		await fs.ensureDir(outputDir);
// 		await chunkFile(filePath, chunkSize, outputDir);
// 		console.log(`[${timestamp}] File chunked successfully: ${filePath}`);
// 		eventBus.emit('FileChunked', filePath);
// 	} catch (error) {
// 		console.error(`[${timestamp}] Error chunking file:`, error);
// 		eventBus.emit('ChunkingFailed', filePath);
// 	}
// });

const path = require('path');
const fs = require('fs-extra');
const { exec } = require('child_process');
const moment = require('moment-timezone');
const eventBus = require('../utils/eventBus.utils');

eventBus.on('ProcessFile', filePath => {
	const fileName = path.basename(filePath, path.extname(filePath));
	const timestamp = moment().tz('Asia/Kolkata');

	const outputDir = path.join(
		__dirname,
		'../../output',
		`${fileName}_${timestamp.format('YYYYMMDD_HHmmss')}`
	);

	fs.ensureDirSync(outputDir);

	const splitCommand = `split -b 10M "${filePath}" "${outputDir}/${fileName}_chunk_"`;

	exec(splitCommand, err => {
		if (err) {
			console.error(
				`[${timestamp.format(
					'YYYY-MM-DD HH:mm:ss'
				)}] Error splitting file ${filePath}:`,
				err
			);
			return;
		}

		console.log(
			`[${timestamp.format(
				'YYYY-MM-DD HH:mm:ss'
			)}] File ${filePath} has been split and saved to ${outputDir}`
		);

		eventBus.emit('ValidateChunks', filePath, outputDir);
	});
});
