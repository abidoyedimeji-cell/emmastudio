import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import pg from "pg";

// Bypass SSL certificate validation for Supabase connections
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const { Client } = pg;
const __dirname = dirname(fileURLToPath(import.meta.url));

const migrations = [
  join(__dirname, "fresh_001_foundation.sql"),
  join(__dirname, "fresh_002_seed_data.sql"),
  join(__dirname, "fresh_003_seed_packages.sql"),
  join(__dirname, "fresh_004_marketplace_schema.sql"),
  join(__dirname, "fresh_005_marketplace_rpcs.sql"),
];

async function run() {
  const connectionString = process.env.POSTGRES_URL;

  if (!connectionString) {
    console.error("POSTGRES_URL not set");
    process.exit(1);
  }

  console.log("Connecting to:", connectionString.replace(/:[^:@]*@/, ":***@"));
  const client = new Client({ connectionString, ssl: true });
  await client.connect();
  console.log("Connected to Postgres");

  for (const file of migrations) {
    console.log(`\n--- Running: ${file} ---`);
    try {
      const sql = readFileSync(file, "utf-8");
      await client.query(sql);
      console.log(`SUCCESS: ${file}`);
    } catch (err) {
      console.error(`FAILED: ${file}`);
      console.error(err.message);
    }
  }

  await client.end();
  console.log("\nAll migrations complete.");
}

run().catch(console.error);
