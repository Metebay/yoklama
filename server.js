const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dosyaya yazma işlemi
app.post('/save-data', (req, res) => {
    const { data } = req.body;  // HTML formundan gelen veri

    // Dosya yolunu belirleyelim
    const filePath = path.join(__dirname, 'veri.txt');

    // Dosyaya veri yazalım
    fs.appendFile(filePath, data + '\n', (err) => {
        if (err) {
            return res.status(500).json({ message: 'Dosyaya yazarken hata oluştu.' });
        }
        res.status(200).json({ message: 'Veri başarıyla kaydedildi!' });
    });
});

// Sunucu başlatma
app.listen(port, () => {
    console.log(`Sunucu http://localhost:${port} adresinde çalışıyor`);
});
