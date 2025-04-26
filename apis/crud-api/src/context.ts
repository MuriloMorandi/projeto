import { db } from './database';

export const createContext = () => ({
	db,
});

export type Context = Awaited<ReturnType<typeof createContext>>;
