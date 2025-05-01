import z from 'zod';
import { publicProcedure } from '../../trpc';
import { usersTable } from '../../database/schema';
import { and, eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

export default publicProcedure
	.input(
		z.object({
			id: z.string().nanoid(),
		}),
	)
	.query(async ({ input, ctx: { db } }) => {
		const [user] = await db
			.select()
			.from(usersTable)
			.where(and(eq(usersTable.id, input.id)))
			.limit(1);

		if (!user) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'Usúario não localizado.',
			});
		}

		return user;
	});
