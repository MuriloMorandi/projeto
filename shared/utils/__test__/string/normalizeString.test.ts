import { describe, expect, it } from 'vitest';
import { normalizeString } from '../../src/string/normalizeString';

describe('normalizeString', () => {
	it('deve remover acentos', () => {
		expect(normalizeString('ação')).toBe('acao');
		expect(normalizeString('café')).toBe('cafe');
		expect(normalizeString('pão')).toBe('pao');
	});

	it('deve converter para minúsculas', () => {
		expect(normalizeString('TEXTO EM MAIÚSCULO')).toBe('texto em maiusculo');
	});

	it('deve remover espaços extras no início e no fim', () => {
		expect(normalizeString('   espaço   no início e fim   ')).toBe(
			'espaco no inicio e fim',
		);
	});

	it('deve substituir múltiplos espaços por um único', () => {
		expect(normalizeString('muitos     espaços   no    meio')).toBe(
			'muitos espacos no meio',
		);
	});

	it('deve lidar com string vazia', () => {
		expect(normalizeString('')).toBe('');
	});

	it('deve lidar com string contendo apenas espaços', () => {
		expect(normalizeString('     ')).toBe('');
	});

	it('deve combinar tudo junto', () => {
		expect(normalizeString('   Éxêmplô   DÊ   Texto   ')).toBe(
			'exemplo de texto',
		);
	});
});
