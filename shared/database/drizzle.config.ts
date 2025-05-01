import type { Config } from 'drizzle-kit';

export default {
	dialect: 'turso',
	dbCredentials: {
		url: process.env.DATABASE_URL || '',
		authToken: process.env.DATABASE_AUTH_TOKEN || '',
	},
	schema: './src/schema.ts',
	out: './migrations',
} satisfies Config;
