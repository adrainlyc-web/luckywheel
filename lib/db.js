const { Pool } = require('pg');

const connectionString =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL;

if (!connectionString) {
  // Thrown lazily on first query, not at module load, so local `node --check` still passes.
}

let pool;
function getPool() {
  if (!pool) {
    if (!connectionString) {
      throw new Error(
        'No database connection string found. Add a Postgres integration in Vercel (Storage tab) so POSTGRES_URL or DATABASE_URL is set.'
      );
    }
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
    });
  }
  return pool;
}

async function query(text, params) {
  return getPool().query(text, params);
}

async function ensureSchema() {
  await query(`
    CREATE TABLE IF NOT EXISTS entries (
      phone TEXT PRIMARY KEY,
      name TEXT,
      claimed BOOLEAN NOT NULL DEFAULT FALSE,
      prize TEXT,
      prize_index INTEGER,
      claimed_at TIMESTAMPTZ
    )
  `);
}

function normalizePhone(raw) {
  return String(raw || '').replace(/[\s\-()]/g, '').trim();
}

module.exports = { query, ensureSchema, normalizePhone };
