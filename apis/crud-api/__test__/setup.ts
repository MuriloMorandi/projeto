import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const dbPath = path.resolve(__dirname, '../teste.db');
console.warn(dbPath);

// Remove o arquivo de testes antes de rodar, caso exista
if (fs.existsSync(dbPath)) {
	fs.unlinkSync(dbPath);
	execSync('pnpm db:push:test', { stdio: 'inherit' });
}
