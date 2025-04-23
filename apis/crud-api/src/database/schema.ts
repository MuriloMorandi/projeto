import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const usersTable = sqliteTable('users', {
  id: integer().primaryKey(),
  name: text().notNull(),  
  email: text().unique().notNull(),
});
