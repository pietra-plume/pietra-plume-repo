import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const OUTPUT_DIR = path.join(__dirname, '../public/assets/images');
const MAP_FILE = path.join(OUTPUT_DIR, 'map.json');

// List of files to scan for images
const FILES_TO_SCAN = [
  '../components/Hero.tsx',
  '../components/Philosophy.tsx',
  '../components/Portfolio.tsx',
  '../components/Services.tsx',
  '../components/TheDeparture.tsx',
  '../components/methodology/Hero.tsx',
  '../components/methodology/HolidayPerk.tsx',
  '../components/methodology/Portfolio.tsx',
  '../components/methodology/VideoGenerator.tsx'
];

// Regex to find Unsplash URLs (matches inside quotes)
const URL_REGEX = /https?:\/\/images\.unsplash\.com\/[^"'\s`)]+/g;

// Ensure directory exists
function ensureDirectoryExistence(filePath) {
  if (fs.existsSync(filePath)) {
    return true;
  }
  fs.mkdirSync(filePath, { recursive: true });
}

// Download a single file
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    
    const request = https.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadFile(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
        return;
      }

      response.pipe(file);
    });

    file.on('finish', () => {
      file.close(() => resolve(true));
    });

    request.on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });

    file.on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  console.log('--- Pietra & Plume Asset Downloader ---');
  
  ensureDirectoryExistence(OUTPUT_DIR);

  let allUrls = new Set();

  // 1. Scan files
  console.log('Scanning files...');
  FILES_TO_SCAN.forEach(relativePath => {
    const fullPath = path.join(__dirname, relativePath);
    try {
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const matches = content.match(URL_REGEX);
        if (matches) {
          matches.forEach(url => allUrls.add(url));
        }
      } else {
        console.warn(`Warning: File not found ${fullPath}`);
      }
    } catch (e) {
      console.error(`Error reading ${fullPath}:`, e);
    }
  });

  const uniqueUrls = Array.from(allUrls);
  console.log(`Found ${uniqueUrls.length} unique images.`);

  const urlMap = {};
  let successCount = 0;

  // 2. Download images
  for (let i = 0; i < uniqueUrls.length; i++) {
    const url = uniqueUrls[i];
    const filename = `pietra-asset-${String(i + 1).padStart(3, '0')}.jpg`;
    const destPath = path.join(OUTPUT_DIR, filename);
    const publicPath = `/assets/images/${filename}`;

    process.stdout.write(`[${i + 1}/${uniqueUrls.length}] Downloading ${filename}... `);

    try {
      await downloadFile(url, destPath);
      urlMap[url] = publicPath;
      console.log('Done.');
      successCount++;
    } catch (err) {
      console.log('Failed!');
      console.error(`  Error: ${err.message}`);
    }
  }

  // 3. Save Map
  fs.writeFileSync(MAP_FILE, JSON.stringify(urlMap, null, 2));
  console.log('---------------------------------------');
  console.log(`Successfully downloaded ${successCount} images.`);
  console.log(`Images saved to: ${OUTPUT_DIR}`);
  console.log(`Mapping file created at: ${MAP_FILE}`);
  console.log('---------------------------------------');
}

main();
