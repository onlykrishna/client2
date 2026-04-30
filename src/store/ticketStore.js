import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MOCK_USER_TICKETS, PACKAGES } from '../utils/mockData';
import { generateTicketBatch } from '../utils/ticketGenerator';
import { useAuthStore } from './authStore';

export const useTicketStore = create(
  persist(
    (set, get) => ({
      tickets: MOCK_USER_TICKETS,
      orders: [],
      isLoading: false,
      purchasing: false,

      purchaseTickets: async (packageId) => {
        const pkg = PACKAGES.find(p => p.id === packageId);
        if (!pkg) throw new Error('Invalid package');

        const { user, deductWallet } = useAuthStore.getState();
        if (!user) throw new Error('Please login to purchase');
        if (user.walletBalance < pkg.price) throw new Error('Insufficient wallet balance');

        set({ purchasing: true });
        await new Promise(r => setTimeout(r, 1500)); // Simulate payment processing

        const newTickets = generateTicketBatch(pkg.count).map(num => ({
          id: `t-${Math.random().toString(36).substr(2, 9)}`,
          ticketNumber: num,
          drawDate: '2026-04-17',
          purchasedAt: new Date().toISOString(),
          status: 'active',
          prize: null
        }));

        deductWallet(pkg.price);
        set(state => ({
          tickets: [...newTickets, ...state.tickets],
          purchasing: false
        }));

        return { success: true, tickets: newTickets };
      },

      loadUserTickets: () => {
        return get().tickets;
      }
    }),
    { name: 'ticket-storage' }
  )
);
