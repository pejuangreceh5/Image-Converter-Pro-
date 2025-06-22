import { IncomingForm } from 'formidable';
import sharp from 'sharp';
import fs from 'fs';

export const config = {
  api: { bodyParser: false },
};

const formatHandlers = {
  jpeg: (img) => img.jpeg(),
  png: (img) => img.png(),
  webp: (img) => img.webp(),
  tiff: (img) => img.tiff(),
  avif: (img) => img.avif(),
  heif: (img) => img.heif(),
  gif: (img) => (typeof img.gif === 'function' ? img.gif() : img), // GIF output only if supported
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }

  const form = new IncomingForm({ maxFileSize: 10 * 1024 * 1024 }); // 10MB

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ status: 'error', message: err.message });
    }
    const file = files.images;
    const format = (fields.format || 'png').toLowerCase();
    const allowed = Object.keys(formatHandlers);

    if (!file) {
      return res.status(400).json({ status: 'error', message: 'No file uploaded.' });
    }
    if (!allowed.includes(format)) {
      return res.status(400).json({ status: 'error', message: `Output format not supported. Supported: ${allowed.join(', ').toUpperCase()}` });
    }
    try {
      let image = sharp(file.filepath);
      image = formatHandlers[format](image);

      const buffer = await image.toBuffer();
      fs.unlinkSync(file.filepath);

      res.setHeader('Content-Type', `image/${format}`);
      res.status(200).end(buffer);
    } catch (e) {
      res.status(500).json({ status: 'error', message: e.message });
    }
  });
        }
