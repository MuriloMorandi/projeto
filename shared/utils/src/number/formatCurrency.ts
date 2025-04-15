
export const  formatCurrency = (value: number | bigint, locale = 'pt-BR', currency = 'BRL')=> {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(value);
}
