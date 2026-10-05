import {attachDatabasePool} from '@vercel/functions';
import {Pool, type PoolClient} from 'pg';

export const pool = new Pool({connectionString: process.env.POSTGRES_URL});

attachDatabasePool(pool);

export async function runInPoolTransaction<T>(work: (transaction: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const result = await work(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
