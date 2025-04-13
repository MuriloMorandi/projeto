import { publicProcedure, router } from './trpc';
 
export const appRouter = router({
  user: {
    list: publicProcedure
      .query(async () => {
        // Retrieve users from a datasource, this is an imaginary database
        const users = [{id:1, nome: 'Murilo Morandi'}, {id:2, nome: 'Gabriel Morandi'}]
             
        return {
          data: users,
          count: users.length 
        };
      }),  
  }
  
});

export type AppRouterType = typeof appRouter