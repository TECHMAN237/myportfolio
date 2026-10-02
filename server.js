import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware to normalize file paths with space variations or url-encoding
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  try {
    const decoded = decodeURIComponent(req.path);
    const targetPath = path.join(__dirname, decoded);
    if (fs.existsSync(targetPath) && fs.statSync(targetPath).isFile()) {
      return res.sendFile(targetPath);
    }
    // Try single-space variation
    const singleSpace = path.join(__dirname, decoded.replace(/ {2,}/g, ' '));
    if (fs.existsSync(singleSpace) && fs.statSync(singleSpace).isFile()) {
      return res.sendFile(singleSpace);
    }
    // Try double-space variation
    const doubleSpace = path.join(__dirname, decoded.replace(/ /g, '  '));
    if (fs.existsSync(doubleSpace) && fs.statSync(doubleSpace).isFile()) {
      return res.sendFile(doubleSpace);
    }
  } catch (e) {
    // Ignore decode errors and continue
  }
  next();
});

// Serve static assets from current directory
app.use(express.static(__dirname, {
  extensions: ['html', 'htm']
}));

// Fallback to index.html only for navigation routes without file extensions
app.get('*', (req, res) => {
  if (path.extname(req.path)) {
    return res.status(404).type('text/plain').send('Asset not found: ' + req.path);
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
