export const generateTicketNumber = () => {
  const num = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
  return `KL${num}`;
};

export const generateTicketBatch = (count) =>
  Array.from({ length: count }, generateTicketNumber);
