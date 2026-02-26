import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MUSIC_DIR = path.resolve(__dirname, '../public/music');
const OUTPUT_FILE = path.resolve(__dirname, '../src/assets/sounds.json');
const BASE_URL = '/focus-station';

interface SoundFile {
  name: string;
  path: string;
}

interface SoundGroup {
  name: string; // e.g., "雨声"
  files: string[]; // e.g., ["/focus-station/music/自然/雨声/1.mp3", ...]
}

interface Category {
  category: string; // e.g., "自然"
  sounds: SoundGroup[];
}

function scanDirectory(dir: string): Category[] {
  const categories: Category[] = [];

  if (!fs.existsSync(dir)) {
    console.error(`Directory not found: ${dir}`);
    return [];
  }

  const categoryDirs = fs.readdirSync(dir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory());

  for (const catDir of categoryDirs) {
    const categoryName = catDir.name;
    const catPath = path.join(dir, categoryName);
    
    const soundGroups: SoundGroup[] = [];
    const soundDirs = fs.readdirSync(catPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory());

    for (const soundDir of soundDirs) {
      const soundName = soundDir.name;
      const soundPath = path.join(catPath, soundName);
      
      // Scan files in this directory
      const audioFiles = fs.readdirSync(soundPath)
        .filter(file => /\.(mp3|wav|ogg|m4a)$/i.test(file))
        .map(file => {
           // Construct URL path: /focus-station/music/Category/SoundName/FileName.mp3
           const fullFilePath = path.join(soundPath, file);
           // Calculate relative path from 'public' folder: music/Category/SoundName/FileName.mp3
           const relativePath = path.relative(path.resolve(__dirname, '../public'), fullFilePath);
           // Convert backslashes to forward slashes for URL
           return `${BASE_URL}/${relativePath.split(path.sep).join('/')}`;
        });

      if (audioFiles.length > 0) {
        soundGroups.push({
          name: soundName,
          files: audioFiles
        });
      }
    }

    if (soundGroups.length > 0) {
      categories.push({
        category: categoryName,
        sounds: soundGroups
      });
    }
  }

  return categories;
}

console.log('Scanning music directory...');
const soundConfig = scanDirectory(MUSIC_DIR);

// Ensure src/assets exists
const assetsDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(soundConfig, null, 2));
console.log(`Generated sound config at ${OUTPUT_FILE}`);
