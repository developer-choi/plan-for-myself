import {Inject, Injectable} from '@nestjs/common';
import {eq} from 'drizzle-orm';
import type {Database} from '../db/database';
import {DATABASE} from '../db/database.module';
import {users} from '../db/schema';

export interface UserRow {
  id: number;
}

@Injectable()
export class UserRepository {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  /**
   * null: 그 번호의 사용자 행이 없다
   */
  async findById(id: number): Promise<UserRow | null> {
    const [row] = await this.db.select({id: users.id}).from(users).where(eq(users.id, id));
    return row ?? null;
  }
}
