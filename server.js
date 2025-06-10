const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const cors = require('cors');
const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.static('public'));

app.post('/convert', upload.array('images'), async (req, res) => {
  const format = req.body.format || 'png';
  const width = req.body.width ? parseInt(req.body.width) : null;
  const height = req.body.height ? parseInt(req.body.height) : null;
  const quality = req.body.quality ? parseInt(req.body.quality) : 80;

  try {
    const results = [];
    for (const file of req.files) {
      let image = sharp(file.path);
      if (width || height) image = image.resize(width, height);
      if (format === 'jpeg') image = image.jpeg({ quality });
      else if (format === 'png') image = image.png({ quality });
      else if (format === 'webp') image = image.webp({ quality });
      else if (format === 'gif') image = image.gif();
      else image = image.png();

      const outPath = file.path + '.' + format;
      await image.toFile(outPath);
      const buffer = fs.readFileSync(outPath);
      results.push({
        filename: file.originalname.replace(/\.[^/.]+$/, "") + '.' + format,
        data: buffer.toString('base64')
      });
      fs.unlinkSync(file.path);
      fs.unlinkSync(outPath);
    }
    res.json({ status: 'success', results });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Conversion error' });
  }
});

app.listen(3000, () => {
  console.log('Image Converter running at http://localhost:3000');
});