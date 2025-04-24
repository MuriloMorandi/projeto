import z from 'zod';
import { publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';
import CreateUsers from './routes/users/CreateUsers';
import listUsers from './routes/users/ListUsers';
import { usersTable } from './database/schema';
import { and, eq } from 'drizzle-orm';
 
let users = [{ id: "1", nome: 'Heitor Luan da Mata', email: 'heitor_damata@teste.com' }, { id: "2", nome: 'Isis Ana Luna Souza', email: "isis.ana.souza@konzeption.com.br" }];


export const appRouter = router({
  user: {
    list: listUsers,
    get: publicProcedure
      .input(z.object({ id: z.string().nanoid() }))
      .query(async({ input, ctx:{ db } }) => {

        const [user] = await db.select()
          .from(usersTable)
          .where(and(eq(usersTable.id, input.id)))
        
      if (!user)
      {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Usúario não localizado.",
        });
      }

      return user;
    }),
    create: CreateUsers,
    delete: publicProcedure.input(z.object({
      id: z.string().nanoid(),
    })).mutation(async ({ input }) => {
      users = users.filter(x => x.id != input.id)
      
    })
    
  }
  
});

export type AppRouterType = typeof appRouter