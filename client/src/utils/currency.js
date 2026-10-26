export const currencySymbols = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'C$',
  AUD: 'A$',
  SGD: 'S$',
  JPY: '¥',
};

export const getCurrencySymbol = (currency = 'INR') => {
  return currencySymbols[currency] || currency;
};

export const formatCurrency = (amount, currency = 'INR', showDecimals = true) => {
  const num = Number(amount);
  if (isNaN(num)) return `${getCurrencySymbol(currency)}0.00`;

  const symbol = getCurrencySymbol(currency);
  const isNegative = num < 0;
  const absNum = Math.abs(num);

  const formattedNumber = absNum.toLocaleString(currency === 'INR' ? 'en-IN' : 'en-US', {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  });

  return `${isNegative ? '-' : ''}${symbol}${formattedNumber}`;
};

export default formatCurrency;
