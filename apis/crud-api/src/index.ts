import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import cors from 'cors';
import { createContext } from './context.js';
import { type AppRouterType, appRouter } from './router.js';

export * from './router.js';

export type ApiInputType = inferRouterInputs<AppRouterType>;
export type ApiOutputType = inferRouterOutputs<AppRouterType>;

const server = createHTTPServer({
	middleware: cors(),
	router: appRouter,
	createContext: createContext,
});

console.log(`API(CRUD) rodando na porta: ${process.env.PORT || 3001}`);
server.listen(process.env.PORT || 3001);
