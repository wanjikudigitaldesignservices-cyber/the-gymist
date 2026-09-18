const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  'https://bivrzkrzakulmjrknkux.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpdnJ6a3J6YWt1bG1qcmtua3V4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTczODI2NSwiZXhwIjoyMTA1MzE0MjY1fQ.h0rB7dtp65Xk0ilMcSqQOaVtiDAd1bK5G2dQDmQBgWA'
);

async function run() {
  console.log('Fetching files from public/supabase-mock...');
  const files = fs.readdirSync('./public/supabase-mock').filter(f => f.endsWith('.webp'));
  const slugs = files.map(f => f.replace('.webp', ''));

  console.log(`Found ${files.length} images.`);

  // Update workouts
  console.log('Updating workouts...');
  const { data: workouts } = await supabase.from('workouts').select('id, slug');
  for (const w of workouts) {
    if (slugs.includes(w.slug)) {
      await supabase.from('workouts').update({ image_url: `/supabase-mock/${w.slug}.webp` }).eq('id', w.id);
      console.log(`Updated workout ${w.slug}`);
    } else {
      console.log(`No image for workout ${w.slug}`);
    }
  }

  // Update instructors
  console.log('Updating instructors...');
  const { data: instructors } = await supabase.from('instructors').select('id, slug');
  for (const i of instructors) {
    if (slugs.includes(i.slug)) {
      await supabase.from('instructors').update({ 
        image_url: `/supabase-mock/${i.slug}.webp`,
        portrait_url: `/supabase-mock/${i.slug}.webp` 
      }).eq('id', i.id);
      console.log(`Updated instructor ${i.slug}`);
    } else {
      console.log(`No image for instructor ${i.slug}`);
    }
  }

  // Update classes
  console.log('Updating classes...');
  const { data: classes } = await supabase.from('classes').select('id, slug');
  for (const c of classes) {
    // We don't have exact class slugs in the mock images, let's just use some
    let image = null;
    if (c.slug.includes('strength')) image = '/supabase-mock/barbell-back-squat.webp';
    else if (c.slug.includes('engine') || c.slug.includes('hybrid')) image = '/supabase-mock/battle-ropes.webp';
    else if (c.slug.includes('mobility')) image = '/supabase-mock/90-90-hip-mobility-flow.webp';
    else if (c.slug.includes('weightlifting')) image = '/supabase-mock/power-clean.webp';
    else image = '/supabase-mock/barbell-bench-press.webp';

    await supabase.from('classes').update({ image_url: image }).eq('id', c.id);
    console.log(`Updated class ${c.slug} with ${image}`);
  }

  console.log('Done!');
}

run().catch(console.error);
