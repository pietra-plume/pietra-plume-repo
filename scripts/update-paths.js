import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MAP_FILE = path.join(__dirname, '../public/assets/images/map.json');

// Files to scan and update
const FILES_TO_UPDATE = [
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

async function main() {
  console.log('--- Pietra & Plume Path Updater ---');

  if (!fs.existsSync(MAP_FILE)) {
    console.error('Error: map.json not found.');
    console.error('Please run "node scripts/download-images.js" first.');
    return;
  }

  const map = JSON.parse(fs.readFileSync(MAP_FILE, 'utf8'));
  let totalReplacements = 0;

  FILES_TO_UPDATE.forEach(relativePath => {
    const fullPath = path.join(__dirname, relativePath);
    
    try {
      if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        let fileReplacements = 0;
        let fileUpdated = false;

        // Iterate through every URL in the map and replace it in the file content
        Object.entries(map).forEach(([remoteUrl, localPath]) => {
          if (content.includes(remoteUrl)) {
            // Global string replacement
            content = content.split(remoteUrl).join(localPath);
            fileReplacements++;
            fileUpdated = true;
          }
        });

        if (fileUpdated) {
          fs.writeFileSync(fullPath, content, 'utf8');
          console.log(`✓ Updated ${relativePath} (${fileReplacements} links fixed)`);
          totalReplacements += fileReplacements;
        } else {
          console.log(`- No changes needed in ${relativePath}`);
        }
      } else {
        console.warn(`! Warning: File not found ${relativePath}`);
      }
    } catch (e) {
      console.error(`Error processing ${relativePath}:`, e);
    }
  });

  console.log('---------------------------------------');
  console.log(`Success! Replaced ${totalReplacements} remote URLs with local paths.`);
  console.log('---------------------------------------');
}

main();
