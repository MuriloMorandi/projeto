import { usersTable } from '@projeto/database';
import { eq } from 'drizzle-orm';
import z from 'zod';
import { publicProcedure } from '../../trpc.js';

export default publicProcedure
	.input(
		z.object({
			id: z.string().nanoid(),
		}),
	)
	.mutation(async ({ input, ctx: { db } }) => {
		const result = await db
			.delete(usersTable)
			.where(eq(usersTable.id, input.id));

		return result;
	});
