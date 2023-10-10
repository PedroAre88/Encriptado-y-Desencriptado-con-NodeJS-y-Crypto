const crypto = require('crypto');
const fs = require('fs');

const {publicKey, privateKey} = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
    },
    privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
    },
});

fs.writeFileSync('publicKey.pem', publicKey)
fs.writeFileSync('privateKey.pem',privateKey);

function encriptar() {

const publicKey = fs.readFileSync('publicKey.pem', 'utf-8')

const pdfData = fs.readFileSync('uploads/archivo1.pdf');

const encryptedData = crypto.publicEncrypt(publicKey,Buffer.from(pdfData))

fs.writeFileSync('uploads/encriptadoAsimetrico.pdf', encryptedData);

console.log('Archivo Encriptado');

}

encriptar()