const eventBus = require('../utils/eventBus.utils');
const moment = require('moment-timezone');
const timestamp = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');

eventBus.on('ValidationSuccess', filePath => {
	console.log(`[${timestamp}] Validation succeeded for file: ${filePath}`);
});

eventBus.on('ValidationFailed', filePath => {
	console.error(`[${timestamp}] Validation failed for file: ${filePath}`);
});
