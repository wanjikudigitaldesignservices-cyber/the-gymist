const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
  host: 'db.bivrzkrzakulmjrknkux.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'DYfJU+%U/f#7iah',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL!');

    console.log('Running Schema...');
    const schemaSql = fs.readFileSync(path.join(__dirname, '../supabase/migrations/001_schema.sql'), 'utf-8');
    await client.query(schemaSql);
    console.log('Schema executed successfully.');

    console.log('Running Seed...');
    const seedSql = fs.readFileSync(path.join(__dirname, '../supabase/migrations/002_seed.sql'), 'utf-8');
    await client.query(seedSql);
    console.log('Seed executed successfully.');

  } catch (error) {
    console.error('Database Error:', error);
  } finally {
    await client.end();
  }
}

run();
