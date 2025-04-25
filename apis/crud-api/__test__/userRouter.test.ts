import { Context } from '../src/context';
import { dbTest } from '../src/database';
import { usersTable } from '../src/database/schema';
import { appRouter } from './../src/router';
import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest';
import { faker } from '@faker-js/faker';
import { nanoid } from 'nanoid';
import { TRPCError } from '@trpc/server';

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
      email: faker.internet.email(),
      name: faker.person.fullName(),
      id: nanoid()
    })
  });

  describe("List", () => {
    let isFirstTestDone = false;

    beforeEach(async () => {
      if (!isFirstTestDone) return;

      const ctx = createMockContext() as unknown as Context;
      await ctx.db.insert(usersTable).values(initialDatabase);
    });

    it('Valida retorno da API', async () => {
      const ctx = createMockContext() as unknown as Context; 
      const caller = appRouter.createCaller(ctx);

      const result = await caller.user.list();

      expect(result.data).toStrictEqual([]);
      expect(result.count).toEqual(0);
      isFirstTestDone = true;
    });  

    it('Deve retornar os dados cadastrados seguindo a ordenação', async () => {
    const ctx = createMockContext() as unknown as Context; 
    const caller = appRouter.createCaller(ctx);

    const result = await caller.user.list();
    const expectData = initialDatabase.sort((a, b) => a.name.localeCompare(b.name));

    expect(result.data).toMatchObject(expectData);
    expect(result.count).toEqual(initialDatabase.length);
    });
  })

  describe('Cadastro', () => {
    it("Cadastro com sucesso", async () => {
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

    it("Email inválido", async () => {
      const ctx = createMockContext() as unknown as Context; 
      const caller = appRouter.createCaller(ctx);
      
      const newUser = {
        email: faker.person.firstName(),
        name: faker.person.fullName(),
      };

      try {
        await caller.user.create(newUser)
        throw new Error('Não deveria chegar aqui')
      } catch (err)
      {
        expect(err).toBeInstanceOf(TRPCError)
        expect(err.code).toBe('BAD_REQUEST')
        
        const message = JSON.parse((err as TRPCError).message);
        expect(Array.isArray(message)).toBe(true)

        expect(message[0]).toMatchObject({
          code: 'invalid_string',
          validation: 'email',
          path: ['email'],
          message: 'Invalid email',
        })  
      }      
    })

    it("Email duplicado", async () => {
      const ctx = createMockContext() as unknown as Context; 
      const caller = appRouter.createCaller(ctx);
      
      const newUser = {
        email: faker.internet.email(),
        name: faker.person.fullName(),
      };

      try {
        await caller.user.create(newUser);
        await caller.user.create(newUser);
        throw new Error('Não deveria chegar aqui')
      } catch (err)
      {
        expect(err).toBeInstanceOf(TRPCError)
        expect(err.code).toBe('BAD_REQUEST')
        expect(err.message).toEqual("E-mail já cadastrado");
      }      
    })
  })
})

