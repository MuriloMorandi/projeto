import { createHTTPServer } from '@trpc/server/adapters/standalone';
import cors from 'cors';
import { appRouter, type AppRouterType } from './router.js';
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { createContext } from './context.js';

export * from './router.js';

export type ApiInputType = inferRouterInputs<AppRouterType>;
export type ApiOutputType = inferRouterOutputs<AppRouterType>;

const server = createHTTPServer({
	middleware: cors(),
	router: appRouter,
	createContext: createContext,
});

console.log('API(CRUD) rodando na porta: ' + 3001);
server.listen(3001);
