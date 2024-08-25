const eventBus = require('../utils/eventBus.utils');
const moment = require('moment-timezone');
const timestamp = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
const processedFiles = new Set();

eventBus.on('FileFound', filePath => {
	if (processedFiles.has(filePath)) {
		console.log(`[${timestamp}] File ${filePath} already processed.`);
		return;
	}
	processedFiles.add(filePath);
	eventBus.emit('ProcessFile', filePath);
});
