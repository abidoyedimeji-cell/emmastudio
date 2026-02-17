// Runs SQL migrations via Supabase Management API
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

async function runSQL(sql, label) {
  console.log(`\n--- Running: ${label} ---`);
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SERVICE_ROLE_KEY,
      "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({}),
  });

  // Use the pg_net approach - execute via the SQL endpoint
  const sqlRes = await fetch(`${SUPABASE_URL}/pg`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SERVICE_ROLE_KEY,
      "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ query: sql }),
  });

  if (!sqlRes.ok) {
    const text = await sqlRes.text();
    console.error(`FAILED: ${label} - ${sqlRes.status} ${text.substring(0, 200)}`);
    return false;
  }
  console.log(`SUCCESS: ${label}`);
  return true;
}

// For Supabase, we need to use the direct postgres connection
// Since fetch to /pg doesn't exist, let's use pg with proper SSL handling
import pg from "pg";
const { Client } = pg;

async function run() {
  const connectionString = process.env.POSTGRES_URL;
  if (!connectionString) {
    console.error("POSTGRES_URL not set");
    process.exit(1);
  }

  // Create client with SSL disabled for cert validation
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log("Connected to Postgres successfully");
  } catch (err) {
    console.error("Connection failed:", err.message);
    process.exit(1);
  }

  // Read SQL files from stdin-like approach - embed critical parts
  // First, just test the connection works
  try {
    const result = await client.query("SELECT current_database(), current_user, version()");
    console.log("Database:", result.rows[0].current_database);
    console.log("User:", result.rows[0].current_user);
    console.log("Version:", result.rows[0].version.substring(0, 60));
  } catch (err) {
    console.error("Query failed:", err.message);
  }

  await client.end();
  console.log("\nConnection test complete.");
}

run().catch(console.error);
