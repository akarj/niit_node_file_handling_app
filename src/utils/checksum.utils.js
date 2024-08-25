function calculateFileChecksum(filePath) {
	const fileBuffer = fs.readFileSync(filePath);
	return calculateBufferChecksum(fileBuffer);
}

function calculateBufferChecksum(buffer) {
	const hash = crypto.createHash('sha256');
	hash.update(buffer);
	return hash.digest('hex');
}

module.exports = {
	calculateFileChecksum,
	calculateBufferChecksum,
};
