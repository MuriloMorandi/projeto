import { and, asc, count, desc, like, or } from 'drizzle-orm';
import { usersTable } from '../../database/schema';
import { publicProcedure } from '../../trpc';
import z from 'zod';
import { SQLiteColumn } from 'drizzle-orm/sqlite-core';

export default publicProcedure
	.input(
		z.object({
			orderByAsc: z.boolean(),
			orderColumn: z.string(),
			page: z.number(),
			pageSize: z.number().min(10).max(100),
			search: z.string().optional(),
		}),
	)
	.query(async ({ ctx: { db }, input }) => {
		const { orderByAsc, orderColumn, page, pageSize } = input;

		const orderDynamicColumn = <SQLiteColumn>(
			usersTable[<keyof typeof usersTable>orderColumn]
		);

		const data = await db
			.select()
			.from(usersTable)
			.where(
				and(
					or(
						like(usersTable.name, `%${input.search ?? ''}%`),
						like(usersTable.email, `%${input.search ?? ''}%`),
					),
				),
			)
			.orderBy(orderByAsc ? asc(orderDynamicColumn) : desc(orderDynamicColumn))
			.limit(pageSize)
			.offset((page - 1) * pageSize);

		const [dataCount] = await db
			.select({
				count: count(),
			})
			.from(usersTable)
			.where(
				and(
					or(
						like(usersTable.name, `%${input.search ?? ''}%`),
						like(usersTable.email, `%${input.search ?? ''}%`),
					),
				),
			);

		return {
			data,
			count: dataCount.count,
		};
	});
