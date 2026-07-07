// Formats a number as Indian-style currency digits (e.g. 12345.5 -> "12,345.50")
// Does NOT include the ₹ symbol or sign — add those where you display it.
export const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  return num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Turns a transaction's id (a Date.now() timestamp) into a short display date.
export const formatEntryDate = (id) => {
  const d = new Date(id);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short' });
};
