import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';

export const usersTable = sqliteTable('users', {
  id: text().primaryKey().$defaultFn(() => nanoid()),
  name: text().notNull(),  
  email: text().unique().notNull(),
});
