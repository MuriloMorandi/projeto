import { usersTable } from '../../database/schema';
import { publicProcedure } from '../../trpc';
import z from 'zod';

export default publicProcedure
	.input(
		z.object({
			nome: z.string(),
			email: z.string().email(),
		}),
	)
	.query(async ({ ctx: { db }, input }) => {
		const data = await db
			.insert(usersTable)
			.values({
				email: input.email,
				name: input.nome,
			})
			.returning({
				id: usersTable.id,
				email: usersTable.email,
				nome: usersTable.name,
			});

		return {
			data,
		};
	});
