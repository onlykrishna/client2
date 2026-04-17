export const MOCK_USER_TICKETS = [
  { id: 't1', ticketNumber: 'KL253828', drawDate: '2026-04-17', 
    purchasedAt: '2026-04-17T08:30:00', status: 'active', prize: null },
  { id: 't2', ticketNumber: 'KL579443', drawDate: '2026-04-17',
    purchasedAt: '2026-04-17T09:15:00', status: 'active', prize: null },
  { id: 't3', ticketNumber: 'KL788291', drawDate: '2026-04-16',
    purchasedAt: '2026-04-16T10:00:00', status: 'winner', prize: { tier: '8th', amount: 25000 } },
  { id: 't4', ticketNumber: 'KL334521', drawDate: '2026-04-16',
    purchasedAt: '2026-04-16T11:30:00', status: 'expired', prize: null },
  { id: 't5', ticketNumber: 'KL901234', drawDate: '2026-04-15',
    purchasedAt: '2026-04-15T09:00:00', status: 'expired', prize: null },
];

export const PACKAGES = [
  { id: 1, count: 1, price: 149, label: 'Single Ticket', tag: null,
    perTicket: 149, savings: 0 },
  { id: 2, count: 3, price: 399, label: 'Triple Pack', tag: 'MOST POPULAR',
    perTicket: 133, savings: 48 },
  { id: 3, count: 6, price: 596, label: 'Mega Pack', tag: 'BEST VALUE',
    perTicket: 99, savings: 298 },
];

export const PRIZE_STRUCTURE = [
  { tier: '1st', amount: '₹25 Crore', winners: 1, highlight: true },
  { tier: '2nd', amount: '₹10 Crore', winners: 1, highlight: false },
  { tier: '3rd', amount: '₹75 Lakh', winners: 1, highlight: false },
  { tier: '4th', amount: '₹25 Lakh', winners: 12, highlight: false },
  { tier: '5th', amount: '₹12 Lakh', winners: 36, highlight: false },
  { tier: '6th', amount: '₹1 Lakh', winners: 40, highlight: false },
  { tier: '7th', amount: '₹75,000', winners: 99, highlight: false },
  { tier: '8th', amount: '₹25,000', winners: 120, highlight: false },
  { tier: '9th', amount: '₹10,000', winners: 179, highlight: false },
  { tier: '10th', amount: '₹5,000', winners: 200, highlight: false },
  { tier: 'Consolation', amount: 'varies', winners: 665, highlight: false },
];

export const MOCK_DRAWS = [
  {
    id: '2026-04-17',
    drawDate: '2026-04-17',
    status: 'live', // upcoming | live | completed
    resultTime: '15:00',
    results: [
      { tier: '1st', amount: '₹25 Crore', winners: 1,
        winningNumbers: ['KL788291'] },
      { tier: '2nd', amount: '₹10 Crore', winners: 1,
        winningNumbers: ['KL445521'] },
      { tier: '3rd', amount: '₹75 Lakh', winners: 1,
        winningNumbers: ['KL332211'] },
      { tier: '4th', amount: '₹25 Lakh', winners: 12,
        winningNumbers: ['KL253828','KL579443','KL334567','KL998877',
                         'KL112233','KL445566','KL778899','KL223344',
                         'KL556677','KL889900','KL001122','KL334455'] },
      { tier: '5th', amount: '₹12 Lakh', winners: 36,
        winningNumbers: Array.from({length:36}, (_,i) => `KL${String(100000+i*1234).padStart(6,'0')}`) },
      { tier: '6th', amount: '₹1 Lakh', winners: 40,
        winningNumbers: Array.from({length:40}, (_,i) => `KL${String(200000+i*987).padStart(6,'0')}`) },
      { tier: '7th', amount: '₹75,000', winners: 99,
        winningNumbers: Array.from({length:99}, (_,i) => `KL${String(300000+i*543).padStart(6,'0')}`) },
      { tier: '8th', amount: '₹25,000', winners: 120,
        winningNumbers: ['KL788291', ...Array.from({length:119}, (_,i) => `KL${String(400000+i*321).padStart(6,'0')}`)] },
      { tier: '9th', amount: '₹10,000', winners: 179,
        winningNumbers: Array.from({length:179}, (_,i) => `KL${String(500000+i*234).padStart(6,'0')}`) },
      { tier: '10th', amount: '₹5,000', winners: 200,
        winningNumbers: Array.from({length:200}, (_,i) => `KL${String(600000+i*123).padStart(6,'0')}`) },
    ]
  },
  {
    id: '2026-04-16',
    drawDate: '2026-04-16',
    status: 'completed',
    resultTime: '15:00',
    results: [
      { tier: '1st', amount: '₹25 Crore', winners: 1, winningNumbers: ['KL123456'] },
      // ... simplified for brevity but structure is same
    ]
  }
];
