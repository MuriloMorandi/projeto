import { Context } from '../src/context';
import { dbTest } from '../src/database';
import { usersTable } from '../src/database/schema';
import { appRouter } from './../src/router';
import {
	describe,
	it,
	expect,
	vi,
	beforeAll,
	afterAll,
	beforeEach,
} from 'vitest';

export const createMockContext = () => {
	return {
		db: dbTest,
	};
};

describe('banco vazio', () => {
	it('deve retornar um array vazio e count igual a 0', async () => {
		const ctx = createMockContext() as unknown as Context;
		const caller = appRouter.createCaller(ctx);

		const result = await caller.user.list();

		expect(result.data).toStrictEqual([]);
		expect(result.count).toEqual(0);
	});
});

describe('userRouter', () => {
	const initialDatabase = [
		{
			id: 1,
			name: 'a',
			email: 'abc@gmail.com',
		},
	];
	beforeEach(async () => {
		const ctx = createMockContext() as unknown as Context;
		await ctx.db.insert(usersTable).values(initialDatabase);
	});

	it('deve retornar um array com usuarios é o total de usuarios cadastros', async () => {
		const ctx = createMockContext() as unknown as Context;
		const caller = appRouter.createCaller(ctx);

		const result = await caller.user.list();

		expect(result.data).toStrictEqual(initialDatabase);
		expect(result.count).toEqual(initialDatabase.length);
	});
});
