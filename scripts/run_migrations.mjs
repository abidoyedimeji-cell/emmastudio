import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Client } = pg;

const migrations = [
  '020_add_owner_fields.sql',
  '021_marketplace_schema.sql',
  '022_marketplace_rpcs.sql',
];

async function run() {
  const client = new Client({
    connectionString: process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('Connected to database');

    for (const file of migrations) {
      const filePath = path.join(process.cwd(), 'scripts', file);
      const sql = fs.readFileSync(filePath, 'utf8');
      console.log(`\nRunning migration: ${file}...`);
      try {
        await client.query(sql);
        console.log(`SUCCESS: ${file}`);
      } catch (err) {
        console.error(`ERROR in ${file}:`, err.message);
        // Continue with next migration
      }
    }
  } catch (err) {
    console.error('Connection error:', err.message);
  } finally {
    await client.end();
    console.log('\nDone.');
  }
}

run();
