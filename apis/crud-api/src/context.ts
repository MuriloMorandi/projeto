import { db } from '@projeto/database';

export const createContext = () => ({
	db,
});

export type Context = Awaited<ReturnType<typeof createContext>>;
