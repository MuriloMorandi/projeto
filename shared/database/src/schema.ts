import { sql } from 'drizzle-orm';
import { check, sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';

export const usersTable = sqliteTable('users', {
	id: text()
		.primaryKey()
		.$defaultFn(() => nanoid()),
	name: text().notNull(),
	email: text().unique().notNull(),
}, (users) => []);

export const categoriesTable = sqliteTable('categories', {
	id: text()
		.primaryKey()
		.$defaultFn(() => nanoid()),
	name: text().notNull(),
}, (categories) => []);

export const personalAccountsTable = sqliteTable('personal_accounts', {
	id: text()
		.primaryKey()
		.$defaultFn(() => nanoid()),
	userId: text()
		.notNull()
		.references(() => usersTable.id ),
	name: text().notNull(),
	balance: text().notNull(),
}, (personalAccounts) => []);

export const personalTransactionsTable = sqliteTable('personal_transactions', {
	id: text()
		.primaryKey()
		.$defaultFn(() => nanoid()),
	accountId: text()
		.notNull()
		.references(() => personalAccountsTable.id),
	categoryId: text()
		.references(() => categoriesTable.id),
	type: text({ enum: ['income', 'expense']}).notNull(),
	amount: text().notNull(),
	date: integer({ mode: 'timestamp' }).notNull(),
	description: text().notNull(),
}, (personalTransactions) => [
	check('typePersonalTransactions_check', sql`${personalTransactions.type} IN ('income', 'expense')`),
]);

export const organizationTable = sqliteTable('organizations', {
	id: text()
		.primaryKey()
		.$defaultFn(() => nanoid()),
	name: text().notNull(),
	description: text().notNull(),
	ownerId: text()
		.notNull()
		.references(() => usersTable.id),
	createdAt: integer({ mode: 'timestamp' }).notNull(),
	updatedAt: integer({ mode: 'timestamp' }).notNull(),
}, (organizations) => []);

export const organizationMembersTable = sqliteTable('organization_members', {
	organizationId: text()
		.notNull()
		.references(() => organizationTable.id),
	userId: text()
		.notNull()
		.references(() => usersTable.id),

}, (organizationMembers) => [])

export const organizationAccountsTable = sqliteTable('organization_accounts', {
	id: text()
		.primaryKey()
		.$defaultFn(() => nanoid()),
	organizationId: text()
		.notNull()
		.references(() => organizationTable.id),
	name: text().notNull(),
	balance: text().notNull(),
}, (organizationAccounts) => []);

export const organizationTransactionsTable = sqliteTable('organization_transactions', {
	id: text()
		.primaryKey()
		.$defaultFn(() => nanoid()),
	accountId: text()
		.notNull()
		.references(() => organizationAccountsTable.id),
	categoryId: text()
		.references(() => categoriesTable.id),
	ownerId: text()
		.notNull()
		.references(() => usersTable.id),
	type: text({ enum: ['income', 'expense']}).notNull(),
	amount: text().notNull(),
	date: integer({ mode: 'timestamp' }).notNull(),
	description: text().notNull(),
}, (organizationTransactions) => [
	check('typeOrganizationTransactions_check', sql`${organizationTransactions.type} IN ('income', 'expense')`),
]);
