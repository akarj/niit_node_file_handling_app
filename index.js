const moment = require('moment-timezone');
const timestamp = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');

require('./src/services/fileMonitor.service');
require('./src/services/fileProcessor.service');
require('./src/services/fileChunking.service');
require('./src/services/fileValidation.service');
require('./src/services/resultLogging.service');

console.log(`[${timestamp}] File Handling Application Started...`);
