import z from 'zod';
import { publicProcedure } from '../../trpc';
import { usersTable } from '../../database/schema';
import { eq } from 'drizzle-orm';

export default publicProcedure
	.input(
		z.object({
			id: z.string().nanoid(),
		}),
	)
	.query(async ({ input, ctx: { db } }) => {
		const result = await db
			.delete(usersTable)
			.where(eq(usersTable.id, input.id));

		return result;
	});
