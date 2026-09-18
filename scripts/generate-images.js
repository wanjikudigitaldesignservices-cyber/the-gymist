const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../public/supabase-mock');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const imagesToGenerate = [
  'barbell-back-squat', 'conventional-deadlift', 'barbell-bench-press', 'overhead-press',
  'romanian-deadlift', 'front-rack-lunge', 'pull-up', 'barbell-row', 'dumbbell-bench-press',
  'dumbbell-shoulder-press', 'lat-pulldown', 'seated-cable-row', 'leg-press', 'bulgarian-split-squat',
  'hip-thrust', 'kettlebell-swing', 'farmers-carry', 'battle-ropes', 'assault-bike-sprint',
  'box-jump', 'plank', 'hanging-leg-raise', 'power-clean', '90-90-hip-mobility-flow',
  'brian-otieno', 'achieng-mboya', 'kevin-mwangi', 'njeri-kamau', 'samuel-kiprotich',
  'faith-wanjiru', 'dennis-odhiambo', 'aisha-hassan',
  'blog-1', 'blog-2', 'blog-3', 'blog-4', 'blog-5', 'blog-6',
  'blog-7', 'blog-8', 'blog-9', 'blog-10', 'blog-11', 'blog-12',
  'hero', 'about-founder'
];

async function generate() {
  for (const name of imagesToGenerate) {
    const text = name.replace(/-/g, ' ').toUpperCase();
    const svg = `
      <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#1C1C21" />
        <text x="50%" y="50%" font-family="sans-serif" font-weight="bold" font-size="40" fill="#D7FF3E" text-anchor="middle" dominant-baseline="middle">${text}</text>
      </svg>
    `;
    
    await sharp(Buffer.from(svg))
      .webp()
      .toFile(path.join(outDir, `${name}.webp`));
    console.log(`Generated ${name}.webp`);
  }
}

generate().catch(console.error);
