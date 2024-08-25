const fs = require('fs-extra');
const path = require('path');
const cron = require('node-cron');
const eventBus = require('../utils/eventBus.utils');
const inputDir = path.join(__dirname, '../../input');
const moment = require('moment-timezone');

cron.schedule('*/5 * * * *', () => {
	const timestamp = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
	console.log(`[${timestamp}] Scanning input folder...`);
	fs.readdir(inputDir, (err, files) => {
		if (err) {
			return console.error(`[${timestamp}] Error reading input folder:`, err);
		}
		files.forEach(file => {
			const filePath = path.join(inputDir, file);
			eventBus.emit('FileFound', filePath);
		});
	});
});
