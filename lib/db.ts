import { Pool } from 'pg';

let pool: Pool;

declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
}

if (!global._pgPool) {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }

  global._pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // For Neon, often SSL is required:
    ssl: {
      rejectUnauthorized: false,
    },
  });
}

pool = global._pgPool;

export { pool };
