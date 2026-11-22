// Whole Kenyan shillings, e.g. "KES 1,500"
export const formatKES = (amount) => `KES ${Number(amount || 0).toLocaleString('en-KE')}`
