const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

export function formatDateLabel(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) return isoDate;
  return `${day}/${month}/${year}`;
}

export function summarizeDateRange(checkInDate: string, checkOutDate: string): string {
  return `${formatDateLabel(checkInDate)} - ${formatDateLabel(checkOutDate)}`;
}
