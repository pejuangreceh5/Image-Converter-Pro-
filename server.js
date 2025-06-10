const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const cors = require('cors');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.static('public'));

app.post('/convert', upload.single('images'), async (req, res) => {
  const format = req.body.format || 'png';
  const width = req.body.width ? parseInt(req.body.width) : null;
  const height = req.body.height ? parseInt(req.body.height) : null;
  const quality = req.body.quality ? parseInt(req.body.quality) : 80;

  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ status: 'error', message: 'No file uploaded' });
    }

    // Only allow certain formats
    if (!['jpeg', 'png', 'webp'].includes(format)) {
      fs.unlinkSync(file.path);
      return res.status(400).json({ status: 'error', message: 'Output format not supported.' });
    }

    let image = sharp(file.path);
    if (width || height) image = image.resize(width, height);
    if (format === 'jpeg') image = image.jpeg({ quality });
    else if (format === 'png') image = image.png({ quality });
    else if (format === 'webp') image = image.webp({ quality });

    const buffer = await image.toBuffer();

    // Remove uploaded file
    fs.unlinkSync(file.path);

    res.set('Content-Type', `image/${format}`);
    res.send(buffer);

  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ status: 'error', message: err.message || 'Conversion error' });
  }
});

app.listen(3000, () => {
  console.log('Image Converter running at http://localhost:3000');
});
