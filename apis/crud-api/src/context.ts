import { db } from '@projeto/database';

export const createContext = (): { db: typeof db } => {
	return {
		db: db
	}
};

export type Context = Awaited<ReturnType<typeof createContext>>;
