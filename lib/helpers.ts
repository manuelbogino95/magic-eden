export const formatCurrencyUSD = (number: number) =>
  Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(Number(number));
