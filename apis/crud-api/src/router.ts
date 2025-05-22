import { router } from './trpc.js';
import CreateUsers from './routes/users/CreateUsers.js';
import listUsers from './routes/users/ListUsers.js';
import UpdateUsers from './routes/users/UpdateUsers.js';
import DeleteUsers from './routes/users/DeleteUsers.js';
import GetUsers from './routes/users/GetUsers.js';

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
