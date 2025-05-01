import { and, eq } from 'drizzle-orm';
import { usersTable } from '@projeto/database';
import { publicProcedure } from '../../trpc';
import z from 'zod';
import { TRPCError } from '@trpc/server';

export default publicProcedure
	.input(
		z.object({
			name: z.string(),
			email: z.string().email(),
		}),
	)
	.mutation(async ({ ctx: { db }, input }) => {
		const hasEmail = await db.query.usersTable.findFirst({
			columns: {
				email: true,
			},
			where: and(eq(usersTable.email, input.email)),
		});

		if (hasEmail) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'E-mail já cadastrado',
			});
		}

		const [data] = await db
			.insert(usersTable)
			.values({
				email: input.email,
				name: input.name,
			})
			.returning({
				id: usersTable.id,
				email: usersTable.email,
				name: usersTable.name,
			});

		return {
			...data,
		};
	});
