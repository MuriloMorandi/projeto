import { router } from './trpc';
import CreateUsers from './routes/users/CreateUsers';
import listUsers from './routes/users/ListUsers';
import UpdateUsers from './routes/users/UpdateUsers';
import DeleteUsers from './routes/users/DeleteUsers';
import GetUsers from './routes/users/GetUsers';

export const appRouter = router({
	user: {
		list: listUsers,
		get: GetUsers,
		create: CreateUsers,
		update: UpdateUsers,
		delete: DeleteUsers,
	},
});

export type AppRouterType = typeof appRouter;
