import type { SQLiteSelect } from 'drizzle-orm/sqlite-core';

export function withPagination<T extends SQLiteSelect>(
	qb: T,
	page = 1,
	pageSize = 10,
) {
	if (page < 1) {
		throw new Error('Page less than 1');
	}

	if (pageSize < 1) {
		throw new Error('PageSize less than 1');
	}

	return qb.limit(pageSize).offset((page - 1) * pageSize);
}
