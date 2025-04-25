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
import { fa, faker } from '@faker-js/faker';
import { nanoid } from 'nanoid';
import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';

type SelectUser = typeof usersTable.$inferSelect;

export const createMockContext = () => {
	return {
		db: dbTest,
	};
};

describe('userRouter', () => {
	let initialDatabase: SelectUser[] = [];
	Array.from({ length: 100 }).map((value, idx) => {
		initialDatabase.push({
			id: nanoid(),
			name: faker.person.fullName(),
			email: faker.internet.email(),
		});
	});

	describe('Validando o retorno da API', () => { 
		const ctx = createMockContext() as unknown as Context;
		
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

			const result = await caller.user.list();
			expect(result.data).toStrictEqual([]);
			expect(result.count).toEqual(0);
		});

		it('Busca por id', async () => {
			const userInsert = initialDatabase[0];
			await ctx.db.insert(usersTable).values(userInsert).execute();

			const caller = appRouter.createCaller(ctx);
			
			const findUser =await caller.user.get({ id: userInsert.id });
			
			expect(findUser).toMatchObject(userInsert);
			expect(findUser).toHaveProperty('id');
			expect(findUser).toHaveProperty('name');
			expect(findUser).toHaveProperty('email');
		});

		it('Busca por id (não localizado)', async () => {
			const caller = appRouter.createCaller(ctx);
			
			await expect(
    			caller.user.get({ id: initialDatabase[0].id })
  			).rejects.toThrow('Usuário não localizado.');
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

		it('Deve retornar os dados cadastrados seguindo a ordenação', async () => {
			const caller = appRouter.createCaller(ctx);

			const result = await caller.user.list();
			const expectData = initialDatabase.sort((a, b) =>
				a.name.localeCompare(b.name),
			);

			expect(result.data).toMatchObject(expectData);
			expect(result.count).toEqual(initialDatabase.length);
		});
	});

	describe('Cadastro', () => {
		it('Cadastro com sucesso', async () => {
			const ctx = createMockContext() as unknown as Context;
			const caller = appRouter.createCaller(ctx);

			const newUser = {
				email: faker.internet.email(),
				name: faker.person.fullName(),
			};

			const { data } = await caller.user.create(newUser);
			const findNewUser = await caller.user.get({ id: data[0].id });

			expect(data[0]).toHaveProperty('id');
			expect(findNewUser).toMatchObject(newUser);
		});

		it('Email inválido', async () => {
			const ctx = createMockContext() as unknown as Context;
			const caller = appRouter.createCaller(ctx);

			const newUser = {
				email: faker.person.firstName(),
				name: faker.person.fullName(),
			};

			try {
				await caller.user.create(newUser);
				throw new Error('Não deveria chegar aqui');
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

		it('Email duplicado', async () => {
			const ctx = createMockContext() as unknown as Context;
			const caller = appRouter.createCaller(ctx);

			const newUser = {
				email: faker.internet.email(),
				name: faker.person.fullName(),
			};

			try {
				await caller.user.create(newUser);
				await caller.user.create(newUser);
				throw new Error('Não deveria chegar aqui');
			} catch (err) {
				expect(err).toBeInstanceOf(TRPCError);
				expect(err.code).toBe('BAD_REQUEST');
				expect(err.message).toEqual('E-mail já cadastrado');
			}
		});
	});


});
