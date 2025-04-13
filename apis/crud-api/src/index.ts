import { createHTTPServer } from '@trpc/server/adapters/standalone';
import cors from 'cors';
import { appRouter, type AppRouterType } from './router.js';
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

export * from './router.js';


export type ApiOutputType = inferRouterOutputs<AppRouterType>;


const server = createHTTPServer({
  middleware: cors(),
  router: appRouter,
});
 
console.log("API(CRUD) rodando na porta: " + 3001)
server.listen(3001);