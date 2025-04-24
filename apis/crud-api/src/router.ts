import z from 'zod';
import { publicProcedure, router } from './trpc';
import CreateUsers from './routes/users/CreateUsers';
import ListUsers from './routes/users/ListUsers';
import GetUsers from './routes/users/GetUsers';
import DeleteUsers from './routes/users/DeleteUsers';
import UpdateUsers from './routes/users/UpdateUsers';
 
let users = [{ id: "1", nome: 'Heitor Luan da Mata', email: 'heitor_damata@teste.com' }, { id: "2", nome: 'Isis Ana Luna Souza', email: "isis.ana.souza@konzeption.com.br" }];


export const appRouter = router({
  user: {
    list: ListUsers,
    get: GetUsers,
    create: CreateUsers,
    delete: DeleteUsers,
    update: UpdateUsers,
  }
  
});

export type AppRouterType = typeof appRouter