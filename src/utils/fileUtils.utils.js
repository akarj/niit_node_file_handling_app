const fs = require('fs-extra');
const { exec } = require('child_process');

const chunkFile = (filePath, chunkSize, outputDir) => {
	const command = `split -b ${chunkSize} "${filePath}" "${outputDir}/chunk_"`;
	return new Promise((resolve, reject) => {
		exec(command, (err, stdout, stderr) => {
			if (err) {
				return reject(stderr);
			}
			resolve(stdout);
		});
	});
};

const compareFiles = (originalFilePath, chunkFiles) => {
	const originalSize = fs.statSync(originalFilePath).size;
	const chunksSize = chunkFiles.reduce(
		(acc, file) => acc + fs.statSync(file).size,
		0
	);

	return originalSize === chunksSize;
};

module.exports = { chunkFile, compareFiles };
