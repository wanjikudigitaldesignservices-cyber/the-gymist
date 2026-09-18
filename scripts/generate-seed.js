const fs = require('fs');

const workouts = [
  { id: '01', title: 'Barbell Back Squat', category: 'Strength', tier: 2, muscles: 'Quads, glutes', equipment: 'Barbell, rack', slug: 'barbell-back-squat', img: 'barbell-back-squat.webp' },
  { id: '02', title: 'Conventional Deadlift', category: 'Strength', tier: 3, muscles: 'Posterior chain', equipment: 'Barbell', slug: 'conventional-deadlift', img: 'conventional-deadlift.webp' },
  { id: '03', title: 'Barbell Bench Press', category: 'Strength', tier: 2, muscles: 'Chest, triceps', equipment: 'Barbell, bench', slug: 'barbell-bench-press', img: 'barbell-bench-press.webp' },
  { id: '04', title: 'Overhead Press', category: 'Strength', tier: 2, muscles: 'Shoulders', equipment: 'Barbell', slug: 'overhead-press', img: 'overhead-press.webp' },
  { id: '05', title: 'Romanian Deadlift', category: 'Strength', tier: 2, muscles: 'Hamstrings, glutes', equipment: 'Barbell', slug: 'romanian-deadlift', img: 'romanian-deadlift.webp' },
  { id: '06', title: 'Front Rack Lunge', category: 'Strength', tier: 2, muscles: 'Quads, glutes', equipment: 'Barbell', slug: 'front-rack-lunge', img: 'front-rack-lunge.webp' },
  { id: '07', title: 'Pull-Up', category: 'Strength', tier: 2, muscles: 'Lats, biceps', equipment: 'Bar', slug: 'pull-up', img: 'pull-up.webp' },
  { id: '08', title: 'Barbell Row', category: 'Strength', tier: 2, muscles: 'Mid back', equipment: 'Barbell', slug: 'barbell-row', img: 'barbell-row.webp' },
  { id: '09', title: 'Dumbbell Bench Press', category: 'Hypertrophy', tier: 1, muscles: 'Chest', equipment: 'Dumbbells, bench', slug: 'dumbbell-bench-press', img: 'dumbbell-bench-press.webp' },
  { id: '10', title: 'Dumbbell Shoulder Press', category: 'Hypertrophy', tier: 1, muscles: 'Shoulders', equipment: 'Dumbbells', slug: 'dumbbell-shoulder-press', img: 'dumbbell-shoulder-press.webp' },
  { id: '11', title: 'Lat Pulldown', category: 'Hypertrophy', tier: 1, muscles: 'Lats', equipment: 'Cable machine', slug: 'lat-pulldown', img: 'lat-pulldown.webp' },
  { id: '12', title: 'Seated Cable Row', category: 'Hypertrophy', tier: 1, muscles: 'Mid back', equipment: 'Cable machine', slug: 'seated-cable-row', img: 'seated-cable-row.webp' },
  { id: '13', title: 'Leg Press', category: 'Hypertrophy', tier: 1, muscles: 'Quads', equipment: 'Leg press machine', slug: 'leg-press', img: 'leg-press.webp' },
  { id: '14', title: 'Bulgarian Split Squat', category: 'Hypertrophy', tier: 2, muscles: 'Quads, glutes', equipment: 'Dumbbells, bench', slug: 'bulgarian-split-squat', img: 'bulgarian-split-squat.webp' },
  { id: '15', title: 'Hip Thrust', category: 'Hypertrophy', tier: 2, muscles: 'Glutes', equipment: 'Barbell, bench', slug: 'hip-thrust', img: 'hip-thrust.webp' },
  { id: '16', title: 'Kettlebell Swing', category: 'Conditioning', tier: 2, muscles: 'Posterior chain', equipment: 'Kettlebell', slug: 'kettlebell-swing', img: 'kettlebell-swing.webp' },
  { id: '17', title: 'Farmer\'s Carry', category: 'Conditioning', tier: 1, muscles: 'Grip, core', equipment: 'Dumbbells/handles', slug: 'farmers-carry', img: 'farmers-carry.webp' },
  { id: '18', title: 'Battle Ropes', category: 'Conditioning', tier: 1, muscles: 'Full body', equipment: 'Battle ropes', slug: 'battle-ropes', img: 'battle-ropes.webp' },
  { id: '19', title: 'Assault Bike Sprint', category: 'Conditioning', tier: 2, muscles: 'Full body', equipment: 'Air bike', slug: 'assault-bike-sprint', img: 'assault-bike-sprint.webp' },
  { id: '20', title: 'Box Jump', category: 'Conditioning', tier: 2, muscles: 'Legs, power', equipment: 'Plyo box', slug: 'box-jump', img: 'box-jump.webp' },
  { id: '21', title: 'Plank', category: 'Core', tier: 1, muscles: 'Core', equipment: 'Bodyweight', slug: 'plank', img: 'plank.webp' },
  { id: '22', title: 'Hanging Leg Raise', category: 'Core', tier: 2, muscles: 'Lower abs', equipment: 'Bar', slug: 'hanging-leg-raise', img: 'hanging-leg-raise.webp' },
  { id: '23', title: 'Power Clean', category: 'Olympic', tier: 3, muscles: 'Full body', equipment: 'Barbell', slug: 'power-clean', img: 'power-clean.webp' },
  { id: '24', title: '90/90 Hip Mobility Flow', category: 'Mobility', tier: 1, muscles: 'Hips', equipment: 'Mat', slug: '90-90-hip-mobility-flow', img: '90-90-hip-mobility-flow.webp' }
];

const instructors = [
  { name: 'Brian Otieno', role: 'Head Coach & Co-founder', speciality: 'Powerlifting, strength programming', cats: ['Strength'], slug: 'brian-otieno' },
  { name: 'Achieng\' Mboya', role: 'Strength & Conditioning Coach', speciality: 'Women\'s strength, postnatal return', cats: ['Strength', 'Hypertrophy'], slug: 'achieng-mboya' },
  { name: 'Kevin Mwangi', role: 'Performance Coach', speciality: 'Hyrox, engine work, running', cats: ['Conditioning'], slug: 'kevin-mwangi' },
  { name: 'Njeri Kamau', role: 'Mobility & Rehab Lead', speciality: 'Movement screening, injury-return', cats: ['Mobility'], slug: 'njeri-kamau' },
  { name: 'Samuel Kiprotich', role: 'Olympic Lifting Coach', speciality: 'Snatch, clean & jerk, athletic power', cats: ['Olympic'], slug: 'samuel-kiprotich' },
  { name: 'Faith Wanjiru', role: 'Nutrition Coach & Trainer', speciality: 'Body composition, habit coaching', cats: ['Nutrition', 'Hypertrophy'], slug: 'faith-wanjiru' },
  { name: 'Dennis Odhiambo', role: 'Group Fitness Lead', speciality: 'Kettlebells, circuits, class energy', cats: ['Conditioning'], slug: 'dennis-odhiambo' },
  { name: 'Aisha Hassan', role: 'Youth & Beginner Coach', speciality: 'Ages 14–18, first-90-days onboarding', cats: ['Strength', 'Core'], slug: 'aisha-hassan' }
];

const blogTitles = [
  "How much protein do you actually need? A Kenyan lifter's guide",
  "Progressive overload: the only training principle that matters",
  "Squat depth, knees over toes, and other myths that won't die",
  "Your first 12 weeks in the gym: a week-by-week plan",
  "Training in Nairobi's altitude and dry season — what actually changes",
  "Sleep is a performance-enhancing drug (and it's free)",
  "Why your deadlift stalls at 100 kg — and the four fixes",
  "Eating for fat loss without giving up Kenyan food",
  "Mobility vs stretching: what your hips actually need",
  "DOMS, soreness and the recovery myths we need to retire",
  "Strength training for women: what the research actually says",
  "How to not quit in week three — the psychology of habit stacking"
];

let sql = `-- THE GYMIST SEED DATA\n\n`;

// WORKOUTS
sql += `INSERT INTO workouts (slug, name, category, tier, short_description, image_url, image_alt, primary_muscles, secondary_muscles, equipment, steps, cues, mistakes, is_published, is_featured) VALUES\n`;
const workoutVals = workouts.map(w => {
  const steps = JSON.stringify(['Step 1: Setup', 'Step 2: Execution', 'Step 3: Return']);
  const cues = JSON.stringify(['Keep chest up', 'Brace core', 'Drive through heels']);
  const mistakes = JSON.stringify([{mistake: 'Rounding back', fix: 'Keep neutral spine'}]);
  const primary = w.muscles.split(',').map(m => m.trim());
  const equip = w.equipment.split(',').map(m => m.trim());
  
  const safeTitle = w.title.replace(/'/g, "''");
  return `('${w.slug}', '${safeTitle}', '${w.category}', ${w.tier}, 'A detailed guide for ${safeTitle}', '/supabase-mock/${w.img}', '${safeTitle} demonstrator', ARRAY[${primary.map(p=>`'${p}'`).join(',')}], ARRAY[]::text[], ARRAY[${equip.map(p=>`'${p}'`).join(',')}], '${steps}'::jsonb, '${cues}'::jsonb, '${mistakes}'::jsonb, true, true)`;
});
sql += workoutVals.join(',\n') + ';\n\n';

// INSTRUCTORS
sql += `INSERT INTO instructors (slug, full_name, role, bio, portrait_url, specialities, categories, is_published) VALUES\n`;
const instructorVals = instructors.map(i => {
  const specs = i.speciality.split(',').map(s => s.trim());
  const safeName = i.name.replace(/'/g, "''");
  const safeSpeciality = i.speciality.replace(/'/g, "''");
  const safeRole = i.role.replace(/'/g, "''");
  return `('${i.slug}', '${safeName}', '${safeRole}', 'Experienced coach specializing in ${safeSpeciality}', '/supabase-mock/${i.slug}.webp', ARRAY[${specs.map(s=>`'${s.replace(/'/g, "''")}'`).join(',')}], ARRAY[${i.cats.map(c=>`'${c.replace(/'/g, "''")}'`).join(',')}], true)`;
});
sql += instructorVals.join(',\n') + ';\n\n';

// BLOG POSTS
sql += `INSERT INTO blog_posts (slug, title, excerpt, body_md, cover_image_url, status, is_featured) VALUES\n`;
const blogVals = blogTitles.map((title, idx) => {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const safeTitle = title.replace(/'/g, "''");
  const body = ('# ' + title + '\\n\\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\\n\\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\\n\\n## Section 1\\n\\nSed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.').replace(/'/g, "''");
  
  return `('${slug}', '${safeTitle}', 'Learn about ${safeTitle}', '${body}', '/supabase-mock/blog-${idx+1}.webp', 'published', true)`;
});
sql += blogVals.join(',\n') + ';\n\n';

fs.writeFileSync('supabase/migrations/002_seed.sql', sql);
console.log('Seed SQL generated successfully!');
