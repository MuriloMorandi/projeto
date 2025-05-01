import type { Config } from 'drizzle-kit';

export default {
	dialect: 'turso',
	dbCredentials: {
		url: 'file:teste.db',
	},
	schema: './src/schema.ts',
	out: './migrations',
} satisfies Config;
