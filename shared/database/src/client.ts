import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema.js';

const client = createClient({
	url: process.env.DATABASE_URL || '',
	authToken: process.env.DATABASE_AUTH_TOKEN || '',
});

export const db = drizzle(client, { schema });

export type dbType = typeof db;
