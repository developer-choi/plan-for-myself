import {attachDatabasePool} from '@vercel/functions';
import {Pool} from 'pg';

export const pool = new Pool({connectionString: process.env.POSTGRES_URL});

attachDatabasePool(pool);
