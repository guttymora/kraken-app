const path = require('path');
const fs = require('fs');

const DEFAULT_DIRECTORY_NAME = require.main.filename;

class FileProcessor {
    async getFiles() {
        console.log('getting files');

        const directoryPath = path.dirname(DEFAULT_DIRECTORY_NAME);
        return await new Promise((resolve, reject) => {
            fs.readdir(directoryPath, (err, files) => {
                if (err) {
                    console.error('[!] Unable to read directory!');
                    reject(null);
                }else{
                    resolve(files);
                }
            })
        });
    }
}

module.exports = FileProcessor;
