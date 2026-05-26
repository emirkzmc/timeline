import { Pool } from 'pg';

import { env } from '../config/env.js';

export const pool = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
});

export const DB_POOL = 'DB_POOL';

export const DatabaseProvider = {
  provide: DB_POOL,
  useValue: pool,
};