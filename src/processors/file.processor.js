// With ❤ by GuttyMora
const {parentPort} = require('worker_threads');
require('dotenv').config();
const fs = require('fs');
const crypto = require('crypto');
const {Buffer} = require('buffer');
const ErrorCodes = require('../constants/error-codes.constant');
const KrakenError = require('../objects/kraken-error.object');

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY ?? 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
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
                    reject(new KrakenError(ErrorCodes.DIRECTORY_NOT_FOUND), 'Directorio no encontrado');
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
                    reject(new KrakenError(ErrorCodes.FILE_OR_FOLDER_NOT_FOUND, 'No se pudo obtener los datos del archivo/carpeta'));
                } else {
                    resolve(stats);
                }
            })
        });
    }

    async encrypt(file) {
        console.log('[FileProcessor] - encrypt()');

        return await new Promise((resolve, reject) => {
            fs.readFile(`${file.directoryPath}\\${file.name}`, async (err, data) => {
                if (err) {
                    console.error('[!] Unable to read file:', err);
                    reject(new KrakenError(ErrorCodes.READING_FILE_ERROR, 'Error leyendo el archivo'));
                } else {
                    try {
                        const extension = (file.name.split('.'))[1];
                        const extensionLength = extension.length;
                        const extensionBuff = Buffer.from(`${extensionLength}${extension}`, 'utf8');
                        const iv = crypto.randomBytes(16);

                        // Create a new cipher using the algorithm, key, and iv
                        const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);

                        // Create the new encrypted buffer
                        const encryptedBuffer = Buffer.concat([
                            Buffer.from(iv.toString('hex')),
                            extensionBuff,
                            cipher.update(data),
                            cipher.final()
                        ]);

                        const encryptedFileName = this.writeFile(`${(file.name.split('.')[0])}.${ENCRYPTED_FILE_EXTENSION}`, encryptedBuffer);
                        resolve(encryptedFileName);
                    } catch (err) {
                        console.error('[!] Unable to encrypt file:', err);
                        reject(new KrakenError(ErrorCodes.ENCRYPTING_ERROR, 'Error encriptando el archivo'));
                    }
                }
            });
        });
    }

    async decrypt(file) {
        console.log('[FileProcessor] - decrypt()');

        return await new Promise((resolve, reject) => {
            fs.readFile(`${file.directoryPath}\\${file.name}`, async (err, data) => {
                if (err) {
                    console.error('[!] Unable to read file:', err);
                    reject(new KrakenError(ErrorCodes.READING_FILE_ERROR, 'Error leyendo el archivo'));
                } else {
                    try {
                        const iv = data.slice(0, 32);
                        const extensionLength = parseInt(data.slice(32, 33).toString());
                        const extension = data.slice(33, 33 + extensionLength);
                        const encryptedData = data.slice(33 + extensionLength);

                        // Create a new decipher using the algorithm, key, and iv
                        const decipher = crypto.createDecipheriv(this.algorithm, this.key, Buffer.from(iv.toString(), 'hex'));
                        // Decrypted buffer
                        let decryptedBuffer = Buffer.concat([
                            decipher.update(encryptedData),
                            decipher.final()
                        ]);

                        const decryptedFileName = await this.writeFile(`${(file.name.split('.')[0])}.${extension.toString()}`, decryptedBuffer);
                        resolve(decryptedFileName);
                    } catch (err) {
                        console.error('[!] Unable to decrypt file:', err);
                        reject(new KrakenError(ErrorCodes.DECRYPTING_ERROR, 'Error desencriptando el archivo'));
                    }
                }
            });
        });
    }

    writeFile(fileName, buffer) {
        console.log('[FileProcessor] - writeFile()');

        const fileDescriptor = fs.openSync(fileName, 'w');
        fs.writeSync(fileDescriptor, buffer);

        return fileName;
    }
}

// Listen work thread events
parentPort.on('message', data => {
    const processor = new FileProcessor();

    switch (data.method) {
        case 'getFiles':
            processor.getFiles(data.folder).then(result => {
                parentPort.postMessage(result);
            }).catch(err => {
                parentPort.postMessage(err);
            });
            break;
        case 'encrypt':
            processor.encrypt(data.file).then(result => {
                parentPort.postMessage(result);
            }).catch(err => {
                parentPort.postMessage(err);
            });
            break;
        case 'decrypt':
            processor.decrypt(data.file).then(result => {
                parentPort.postMessage(result);
            }).catch(err => {
                parentPort.postMessage(err);
            });
            break;
        default:
            console.error('[!] FileProcessor error: Not method defined');
    }
});

module.exports = FileProcessor;
