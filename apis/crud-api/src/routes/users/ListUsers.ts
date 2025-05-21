import { and, asc, count, desc, like, or } from 'drizzle-orm';
import { usersTable } from '@projeto/database';
import { publicProcedure } from '../../trpc';
import z from 'zod';
import type { SQLiteColumn } from 'drizzle-orm/sqlite-core';
import { withPagination } from '@projeto/database/utils';

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

		const filters = and(
			or(
				like(usersTable.name, `%${input.search ?? ''}%`),
				like(usersTable.email, `%${input.search ?? ''}%`),
			),
		);

		const query = db
			.select()
			.from(usersTable)
			.where(filters)
			.orderBy(
				orderByAsc ?
					asc(orderDynamicColumn) :
					desc(orderDynamicColumn)
			);

		const result = await withPagination(
			query.$dynamic(),
			page,
			pageSize
		);

		const [dataCount] = await db
			.select({
				count: count(),
			})
			.from(usersTable)
			.where(filters)

		return {
			data: result,
			count: dataCount?.count,
		};
	});
