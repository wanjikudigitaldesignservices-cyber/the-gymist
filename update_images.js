const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  'https://bivrzkrzakulmjrknkux.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpdnJ6a3J6YWt1bG1qcmtua3V4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTczODI2NSwiZXhwIjoyMTA1MzE0MjY1fQ.h0rB7dtp65Xk0ilMcSqQOaVtiDAd1bK5G2dQDmQBgWA'
);

const coachImages = [
  '/supabase-mock/brian-otieno.jpg',
  '/supabase-mock/achieng-mboya.jpg',
  '/supabase-mock/kevin-mwangi.jpg',
  '/supabase-mock/njeri-kamau.jpg'
];

const workoutImages = [
  '/supabase-mock/barbell-back-squat.jpg',
  '/supabase-mock/barbell-bench-press.jpg',
  '/supabase-mock/conventional-deadlift.jpg',
  '/supabase-mock/kettlebell-swing.jpg',
  '/supabase-mock/battle-ropes.jpg',
  '/supabase-mock/pull-up.jpg'
];

async function run() {
  console.log('Updating workouts...');
  const { data: workouts } = await supabase.from('workouts').select('id, slug');
  for (let i = 0; i < workouts.length; i++) {
    const w = workouts[i];
    const img = workoutImages[i % workoutImages.length];
    await supabase.from('workouts').update({ image_url: img }).eq('id', w.id);
  }

  console.log('Updating instructors...');
  const { data: instructors } = await supabase.from('instructors').select('id, slug');
  for (let i = 0; i < instructors.length; i++) {
    const inst = instructors[i];
    const img = coachImages[i % coachImages.length];
    await supabase.from('instructors').update({ image_url: img, portrait_url: img }).eq('id', inst.id);
  }

  console.log('Updating classes...');
  const { data: classes } = await supabase.from('classes').select('id, slug');
  for (let i = 0; i < classes.length; i++) {
    const c = classes[i];
    const img = workoutImages[(i + 2) % workoutImages.length]; // Mix it up a bit
    await supabase.from('classes').update({ image_url: img }).eq('id', c.id);
  }

  console.log('Done!');
}

run().catch(console.error);
