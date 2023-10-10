const express = require('express');
const https = require('https');
const multer = require('multer');
const crypto = require('crypto');
const fs = require('fs');

const app = express();
const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

app.post('/desencriptadoAsimetrico', upload.single('pdfAsimetrico'), (req, res) => {
  const privateKey = fs.readFileSync('privateKey.pem', 'utf-8');
  const encryptedData = fs.readFileSync(req.file.path);
  const decryptedData = crypto.privateDecrypt(privateKey,encryptedData);
  const decryptedFile = req.file.originalname.replace('desencriptadoAsimetrico.pdf', '.pdf');
  const decryptedFilePath = `uploads/desencrypted/${decryptedFile}`

  fs.writeFileSync(decryptedFilePath,decryptedData);

  res.download(decryptedFilePath,decryptedFile, (err) => {
    if (err) {
      console.log('Error al descargar el archivo:', err);
    }

    res.send('Archivo Desencriptado Exitosamente')

    fs.unlinkSync(req.file.path);
  });

});

app.post('/desencriptadoSimetrico', upload.single('pdfSimetrico'), (req, res) => {
  const keyFilePath = 'key.txt';
  const ivFilePath = 'iv.txt';

  const keyHex = fs.readFileSync(keyFilePath, 'utf-8');
  const key = Buffer.from(keyHex, 'hex');

  const ivHex = fs.readFileSync(ivFilePath, 'utf-8');
  const iv = Buffer.from(ivHex, 'hex');

  function desencriptar(inputPath, outputPath, key, iv) {
    const inputBuffer = fs.readFileSync(inputPath);

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

    const decryptedBuffer = Buffer.concat([decipher.update(inputBuffer), decipher.final()]);

    fs.writeFileSync(outputPath, decryptedBuffer);
  }

  desencriptar('uploads/encriptadoSimetrico.pdf', 'uploads/desencrypted/desencriptadoSimetrico.pdf', key, iv);

  res.send('Archivo Desencriptado Exitosamente')

});

https.createServer(options,app).listen(443, () => {
  console.log('Servidor HTTPS en ejecución')
});



