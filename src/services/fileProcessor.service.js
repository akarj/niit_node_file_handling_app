const fs = require('fs-extra');
const path = require('path');
const eventBus = require('../utils/eventBus.utils');
const moment = require('moment-timezone');

const processedFilesPath = path.join(
	__dirname,
	'../store/processedFiles.store.json'
);

const ensureFileExists = async () => {
	try {
		const dir = path.dirname(processedFilesPath);
		await fs.ensureDir(dir);
		if (!(await fs.pathExists(processedFilesPath))) {
			await fs.writeJson(processedFilesPath, []);
		}
	} catch (err) {
		console.error('Error ensuring processed files file exists:', err);
	}
};

const loadProcessedFiles = async () => {
	try {
		await ensureFileExists();
		const data = await fs.readJson(processedFilesPath);
		return new Set(data);
	} catch (err) {
		console.error('Error loading processed files:', err);
	}
	return new Set();
};

const saveProcessedFiles = async processedFiles => {
	try {
		await fs.writeJson(processedFilesPath, Array.from(processedFiles));
	} catch (err) {
		console.error('Error saving processed files:', err);
	}
};

const processFile = async (filePath, processedFiles) => {
	const timestamp = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');

	try {
		if (processedFiles.has(filePath)) {
			console.log(`[${timestamp}] File ${filePath} already processed.`);
			return;
		}

		const stats = await fs.stat(filePath);
		const fileSizeInMB = stats.size / (1024 * 1024);

		if (fileSizeInMB > 10) {
			processedFiles.add(filePath);
			await saveProcessedFiles(processedFiles);
			eventBus.emit('ProcessFile', filePath);
		} else {
			console.log(
				`[${timestamp}] File ${filePath} is smaller than 10MB (${fileSizeInMB.toFixed(
					2
				)}MB), skipping.`
			);
		}
	} catch (err) {
		console.error(`[${timestamp}] Error getting file stats:`, err);
	}
};

(async () => {
	const processedFiles = await loadProcessedFiles();
	eventBus.on('FileFound', async filePath => {
		await processFile(filePath, processedFiles);
	});
})();
