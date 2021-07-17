// With ❤ by GuttyMora
const path = require('path');
const fs = require('fs');

const DEFAULT_DIRECTORY_NAME = require.main.filename;

class FileProcessor {
    async getFiles(folder = null) {
        console.log('[FileProcessor] - getFiles()');

        const directoryPath = path.join(path.dirname(DEFAULT_DIRECTORY_NAME), folder ?? '');
        return await new Promise((resolve, reject) => {
            fs.readdir(directoryPath, (err, files) => {
                if (err) {
                    console.error('[!] Unable to read directory:', err);
                    reject(null);
                } else {
                    resolve([directoryPath, files]);
                }
            })
        });
    }

    async getFileStats(filePath) {
        console.log('[FileProcessor] - getFileStats()');
        console.log('filePath:', filePath);

        return await new Promise((resolve, reject) => {
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.error('[!] Unable to get file stats:', err);
                    reject(null);
                } else {
                    resolve(stats);
                }
            })
        });
    }
}

module.exports = FileProcessor;
