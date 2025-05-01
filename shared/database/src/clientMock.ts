import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

export const dbMock = drizzle(
    createClient({
        url: 'file:teste.db',
    }),
    { schema },
);
