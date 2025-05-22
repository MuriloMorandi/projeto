import { describe, expect, it } from 'vitest';
import { formatCurrency } from '../../src/number/formatCurrency';

describe('formatCurrency', () => {
	it('deve formatar número em BRL (pt-BR) por padrão', () => {
		expect(formatCurrency(1234.56)).toBe('R$ 1.234,56');
	});

	it('deve formatar número em USD (en-US)', () => {
		expect(formatCurrency(1234.56, 'en-US', 'USD')).toBe('$1,234.56');
	});

	it('deve formatar número em EUR (de-DE)', () => {
		expect(formatCurrency(1234.56, 'de-DE', 'EUR')).toBe('1.234,56 €');
	});

	it('deve aceitar valores inteiros e formatar corretamente', () => {
		expect(formatCurrency(5000)).toBe('R$ 5.000,00');
	});

	it('deve aceitar valores bigint', () => {
		expect(formatCurrency(10_000_000_000n)).toBe('R$ 10.000.000.000,00');
	});

	it('deve lidar com valor zero', () => {
		expect(formatCurrency(0)).toBe('R$ 0,00');
	});

	it('deve lidar com valores negativos', () => {
		expect(formatCurrency(-1234.56)).toBe('-R$ 1.234,56');
	});
});
