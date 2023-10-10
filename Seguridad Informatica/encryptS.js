const crypto = require('crypto');
const fs = require('fs');

const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
const keyFilePath = 'key.txt';
const keyHex = key.toString('hex');
fs.writeFileSync(keyFilePath, keyHex)
const ivFilePath = 'iv.txt';
const ivHex = iv.toString('hex');
fs.writeFileSync(ivFilePath, ivHex);

function encriptar(inputPath, outputPath, key) {
    const inputBuffer = fs.readFileSync(inputPath);

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

    const encryptedBuffer = Buffer.concat([cipher.update(inputBuffer), cipher.final()]);

    fs.writeFileSync(outputPath,encryptedBuffer);

    console.log('Archivo Encriptado Exitosamente')
}

encriptar('uploads/archivo2.pdf', 'uploads/encriptadoSimetrico.pdf', key, iv);