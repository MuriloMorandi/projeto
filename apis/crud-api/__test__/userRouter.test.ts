import type { ApiOutputType } from './../src/index';
import type { Context } from '../src/context';
import { dbTest } from '../src/database';
import { usersTable } from '../src/database/schema';
import { appRouter } from './../src/router';
import { describe, it, expect, afterAll, beforeEach, test } from 'vitest';
import { faker } from '@faker-js/faker';
import { nanoid } from 'nanoid';
import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';

type SelectUser = typeof usersTable.$inferSelect;

const createMockContext = () => {
	return {
		db: dbTest,
	};
};

describe('userRouter', () => {
	const initialDatabase: SelectUser[] = [];
	Array.from({ length: 100 }).map(() => {
		initialDatabase.push({
			id: nanoid(),
			name: faker.person.fullName(),
			email: faker.internet.email(),
		});
	});

	describe('Validando o retorno da API', () => {
		const ctx = createMockContext() as unknown as Context;

		beforeEach(async () => {
			await ctx.db.delete(usersTable).execute();
		});

		it('Cadastro', async () => {
			const userInsert = {
				email: faker.internet.email(),
				name: faker.person.fullName(),
			};

			const caller = appRouter.createCaller(ctx);
			const result = await caller.user.create(userInsert);
			expect(result).toHaveProperty('id');
			expect(result).toHaveProperty('name');
			expect(result).toHaveProperty('email');
		});

		it('Cadastro (Email duplicado)', async () => {
			const caller = appRouter.createCaller(ctx);

			const newUser = {
				email: faker.internet.email(),
				name: faker.person.fullName(),
			};

			try {
				await caller.user.create(newUser);
				await caller.user.create(newUser);
				expect.fail('Não deveria chegar aqui');
			} catch (err) {
				expect(err).toBeInstanceOf(TRPCError);
				expect(err.code).toBe('BAD_REQUEST');
				expect(err.message).toEqual('E-mail já cadastrado');
			}
		});

		it('Atualização', async () => {
			const userInsert = {
				email: faker.internet.email(),
				name: faker.person.fullName(),
			};

			const caller = appRouter.createCaller(ctx);
			const result = await caller.user.create(userInsert);
			expect(result).toHaveProperty('id');
			expect(result).toHaveProperty('name');
			expect(result).toHaveProperty('email');
		});

		it('List', async () => {
			const caller = appRouter.createCaller(ctx);

			const result = await caller.user.list({
				orderByAsc: true,
				orderColumn: 'name',
				page: 1,
				pageSize: 15,
			});
			expect(result.data).toStrictEqual([]);
			expect(result.count).toEqual(0);
		});

		it('Busca por id', async () => {
			const userInsert = initialDatabase[0];
			await ctx.db.insert(usersTable).values(userInsert).execute();

			const caller = appRouter.createCaller(ctx);

			const findUser = await caller.user.get({ id: userInsert.id });

			expect(findUser).toMatchObject(userInsert);
			expect(findUser).toHaveProperty('id');
			expect(findUser).toHaveProperty('name');
			expect(findUser).toHaveProperty('email');
		});

		it('Busca por id (não localizado)', async () => {
			const caller = appRouter.createCaller(ctx);
			try {
				await caller.user.get({ id: initialDatabase[0].id });
			} catch (error) {
				expect(error).toBeInstanceOf(TRPCError);
				expect((error as TRPCError).code).toBe('BAD_REQUEST');
				expect((error as TRPCError).message).toEqual('Usúario não localizado.');
			}
		});

		it('Delete by id', async () => {
			const userInsert = initialDatabase[0];
			await ctx.db.insert(usersTable).values(userInsert).execute();

			const caller = appRouter.createCaller(ctx);

			await caller.user.delete({ id: userInsert.id });

			const findUser = await ctx.db.query.usersTable.findFirst({
				where: eq(usersTable.id, userInsert.id),
			});

			expect(findUser).toBeUndefined();
		});
	});

	describe('List', () => {
		const ctx = createMockContext() as unknown as Context;

		beforeEach(async () => {
			await ctx.db.delete(usersTable).execute();
			await ctx.db.insert(usersTable).values(initialDatabase);
		});

		test.each([
			{
				desc: 'asc por nome - página 1, 15 itens',
				input: { orderByAsc: true, orderColumn: 'name', page: 1, pageSize: 15 },
				sortFn: (
					a: ApiOutputType['user']['list']['data'][0],
					b: ApiOutputType['user']['list']['data'][0],
				) => a.name.localeCompare(b.name),
			},
			{
				desc: 'desc por nome - página 1, 15 itens',
				input: {
					orderByAsc: false,
					orderColumn: 'name',
					page: 1,
					pageSize: 15,
				},
				sortFn: (
					a: ApiOutputType['user']['list']['data'][0],
					b: ApiOutputType['user']['list']['data'][0],
				) => b.name.localeCompare(a.name),
			},
			{
				desc: 'asc por nome - página 2, 10 itens',
				input: { orderByAsc: true, orderColumn: 'name', page: 2, pageSize: 10 },
				sortFn: (
					a: ApiOutputType['user']['list']['data'][0],
					b: ApiOutputType['user']['list']['data'][0],
				) => a.name.localeCompare(b.name),
			},
			{
				desc: 'asc por email - página 1, 15 itens',
				input: {
					orderByAsc: true,
					orderColumn: 'email',
					page: 1,
					pageSize: 15,
				},
				sortFn: (
					a: ApiOutputType['user']['list']['data'][0],
					b: ApiOutputType['user']['list']['data'][0],
				) => a.email.localeCompare(b.email),
			},
			{
				desc: 'desc por email - página 1, 15 itens',
				input: {
					orderByAsc: false,
					orderColumn: 'email',
					page: 1,
					pageSize: 15,
				},
				sortFn: (
					a: ApiOutputType['user']['list']['data'][0],
					b: ApiOutputType['user']['list']['data'][0],
				) => b.email.localeCompare(a.email),
			},
			{
				desc: 'asc por email - página 3, `15` itens',
				input: {
					orderByAsc: true,
					orderColumn: 'email',
					page: 3,
					pageSize: 30,
				},
				sortFn: (
					a: ApiOutputType['user']['list']['data'][0],
					b: ApiOutputType['user']['list']['data'][0],
				) => a.email.localeCompare(b.email),
			},
			{
				desc: 'search por nome contendo "ana"',
				input: {
					orderByAsc: true,
					orderColumn: 'name',
					page: 1,
					pageSize: 10,
					search: 'ana',
				},
				sortFn: (
					a: ApiOutputType['user']['list']['data'][0],
					b: ApiOutputType['user']['list']['data'][0],
				) => a.name.localeCompare(b.name),
				filterFn: (item: ApiOutputType['user']['list']['data'][0]) =>
					item.name.toLowerCase().includes('ana'),
			},
			{
				desc: 'search por email contendo "@gmail.com"',
				input: {
					orderByAsc: true,
					orderColumn: 'email',
					page: 1,
					pageSize: 10,
					search: '@gmail.com',
				},
				sortFn: (
					a: ApiOutputType['user']['list']['data'][0],
					b: ApiOutputType['user']['list']['data'][0],
				) => a.email.localeCompare(b.email),
				filterFn: (item: ApiOutputType['user']['list']['data'][0]) =>
					item.email.toLowerCase().includes('@gmail.com'),
			},
		])(
			'Deve retornar os dados cadastrados seguindo a ordenação: $desc',
			async ({ input, sortFn }) => {
				const caller = appRouter.createCaller(ctx);

				const result = await caller.user.list(input);

				let filteredData = initialDatabase;
				if (input.search) {
					filteredData = initialDatabase.filter((item) => {
						return (
							item.email.toLowerCase().includes(input.search.toLowerCase()) ||
							item.name.toLowerCase().includes(input.search.toLowerCase())
						);
					});
				}

				const expectData = filteredData
					.sort(sortFn)
					.slice(
						(input.page - 1) * input.pageSize,
						(input.page - 1) * input.pageSize + input.pageSize,
					);
				expect(result.data).toStrictEqual(expectData);
				expect(result.count).toEqual(filteredData.length);
			},
		);
	});

	describe('Cadastro', () => {
		const ctx = createMockContext() as unknown as Context;

		beforeEach(async () => {
			await ctx.db.delete(usersTable).execute();
			await ctx.db.insert(usersTable).values(initialDatabase);
		});

		it('Cadastro com sucesso', async () => {
			const caller = appRouter.createCaller(ctx);

			const newUser = {
				email: faker.internet.email(),
				name: faker.person.fullName(),
			};

			const data = await caller.user.create(newUser);
			const findNewUser = await ctx.db.query.usersTable.findFirst({
				where: eq(usersTable.id, data.id),
			});

			expect(data).toHaveProperty('id');
			expect(findNewUser).toMatchObject(newUser);
		});

		it('Email inválido', async () => {
			const caller = appRouter.createCaller(ctx);

			const newUser = {
				email: faker.person.firstName(),
				name: faker.person.fullName(),
			};

			try {
				await caller.user.create(newUser);
				expect.fail('Não deveria chegar aqui');
			} catch (err) {
				expect(err).toBeInstanceOf(TRPCError);
				expect(err.code).toBe('BAD_REQUEST');

				const message = JSON.parse((err as TRPCError).message);
				expect(Array.isArray(message)).toBe(true);

				expect(message[0]).toMatchObject({
					code: 'invalid_string',
					validation: 'email',
					path: ['email'],
					message: 'Invalid email',
				});
			}
		});
	});

	describe('Atualização', () => {
		const ctx = createMockContext() as unknown as Context;

		beforeEach(async () => {
			await ctx.db.delete(usersTable).execute();
			await ctx.db.insert(usersTable).values(initialDatabase);
		});

		it('Atualização com sucesso (E-mail)', async () => {
			const caller = appRouter.createCaller(ctx);

			const numberRandom = Math.floor(Math.random() * initialDatabase.length);

			const randomUser = initialDatabase[numberRandom];

			const updatedUser = {
				id: randomUser.id,
				email: faker.internet.email(),
				name: randomUser.name,
			};

			const data = await caller.user.update(updatedUser);
			const findUpdatedUser = await ctx.db.query.usersTable.findFirst({
				where: eq(usersTable.id, data.id),
			});

			expect(data).toHaveProperty('id');
			expect(findUpdatedUser).toMatchObject(updatedUser);
			expect(findUpdatedUser).not.toMatchObject(randomUser);
		});

		it('Atualização com sucesso (name)', async () => {
			const caller = appRouter.createCaller(ctx);

			const numberRandom = Math.floor(Math.random() * initialDatabase.length);

			const randomUser = initialDatabase[numberRandom];

			const updatedUser = {
				id: randomUser.id,
				email: randomUser.email,
				name: faker.person.fullName(),
			};

			const data = await caller.user.update(updatedUser);
			const findUpdatedUser = await ctx.db.query.usersTable.findFirst({
				where: eq(usersTable.id, data.id),
			});

			expect(data).toHaveProperty('id');
			expect(findUpdatedUser).toMatchObject(updatedUser);
			expect(findUpdatedUser).not.toMatchObject(randomUser);
		});

		it('Email inválido', async () => {
			const caller = appRouter.createCaller(ctx);

			const numberRandom = Math.floor(Math.random() * initialDatabase.length);

			const randomUser = initialDatabase[numberRandom];
			const updatedUser = {
				id: randomUser.id,
				email: faker.person.firstName(),
				name: randomUser.name,
			};

			try {
				await caller.user.update(updatedUser);
				expect.fail('Não deveria chegar aqui');
			} catch (err) {
				expect(err).toBeInstanceOf(TRPCError);
				expect(err.code).toBe('BAD_REQUEST');

				const message = JSON.parse((err as TRPCError).message);
				expect(Array.isArray(message)).toBe(true);

				expect(message[0]).toMatchObject({
					code: 'invalid_string',
					validation: 'email',
					path: ['email'],
					message: 'Invalid email',
				});
			}
		});
	});

	describe('Delete', () => {
		const ctx = createMockContext() as unknown as Context;

		it('Deletar com sucesso', async () => {
			const caller = appRouter.createCaller(ctx);

			const numberRandom = Math.floor(Math.random() * initialDatabase.length);

			const randomUser = initialDatabase[numberRandom];

			await caller.user.delete({ id: randomUser.id });

			const findDeletedUser = await ctx.db.query.usersTable.findFirst({
				where: eq(usersTable.id, randomUser.id),
			});

			expect(findDeletedUser).toBeUndefined();
		});
	});

	afterAll(async () => {
		await dbTest.delete(usersTable).execute();
	});
});
