import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

export const dbMock = drizzle(
	createClient({
		url: 'file:teste.db',
	}),
	{ schema },
);
