import { usersTable } from '@projeto/database';
import { TRPCError } from '@trpc/server';
import { and, eq, ne } from 'drizzle-orm';
import z from 'zod';
import { publicProcedure } from '../../trpc.js';

export default publicProcedure
	.input(
		z.object({
			id: z.string().nanoid(),
			name: z.string(),
			email: z.string().email(),
		}),
	)
	.mutation(async ({ ctx: { db }, input }) => {
		const [user] = await db
			.select()
			.from(usersTable)
			.where(and(eq(usersTable.id, input.id)));

		if (!user) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'Usúario não localizado.',
			});
		}

		const hasEmail = await db.query.usersTable.findFirst({
			columns: {
				email: true,
			},
			where: and(
				eq(usersTable.email, input.email),
				ne(usersTable.id, input.id),
			),
		});

		if (hasEmail) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'E-mail já cadastrado',
			});
		}

		const [data] = await db
			.update(usersTable)
			.set({
				email: input.email,
				name: input.name,
			})
			.where(eq(usersTable.id, input.id))
			.returning({
				id: usersTable.id,
				email: usersTable.email,
				name: usersTable.name,
			});

		return {
			...data,
		};
	});
