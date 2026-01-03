import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

// Ensure directory exists
const assetsDir = path.join(projectRoot, 'public', 'assets');
if (!fs.existsSync(assetsDir)){
    fs.mkdirSync(assetsDir, { recursive: true });
}

const images = [
    // Hero
    { 
        url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80', 
        filename: 'hero-luxury.jpg' 
    },
    // Portfolio
    {
        url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80',
        filename: 'project-urban-zen.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80',
        filename: 'project-heritage.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80',
        filename: 'project-vertex.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80',
        filename: 'project-scandi.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80',
        filename: 'project-kitchen.jpg'
    },
    // Holiday Destinations
    {
        url: 'https://images.unsplash.com/photo-1546412414-e1885259563a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        filename: 'dest-dubai.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        filename: 'dest-maldives.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        filename: 'dest-bali.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80',
        filename: 'texture-map.jpg'
    }
];

const downloadImage = (url, filename) => {
    return new Promise((resolve, reject) => {
        const filePath = path.join(assetsDir, filename);
        const file = fs.createWriteStream(filePath);

        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(() => {
                    console.log(`Downloaded: ${filename}`);
                    resolve();
                });
            });
        }).on('error', (err) => {
            fs.unlink(filePath, () => {}); // Delete the file async. (But we don't check the result)
            reject(err.message);
        });
    });
};

const run = async () => {
    console.log('Starting asset download...');
    try {
        await Promise.all(images.map(img => downloadImage(img.url, img.filename)));
        console.log('All assets downloaded successfully to public/assets/');
    } catch (error) {
        console.error('Error downloading assets:', error);
    }
};

run();
