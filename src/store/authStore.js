import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const MOCK_USERS = [
  { uid: 'admin-001', username: 'keralalottery@admin', name: 'Kerala Lottery', isAdmin: true },
];

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      login: async (username, password) => {
        set({ isLoading: true });
        await new Promise(r => setTimeout(r, 800)); // Simulate delay
        
        if (username === 'keralalottery@admin' && password === 'adminkeralalottery') {
          const mockUser = MOCK_USERS[0];
          set({ user: mockUser, isLoading: false });
          return mockUser;
        } else {
          set({ isLoading: false });
          throw new Error('Invalid Credentials');
        }
      },
      logout: () => set({ user: null }),
      updateProfile: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),
      deductWallet: (amount) => set((state) => ({
        user: state.user ? { ...state.user, walletBalance: state.user.walletBalance - amount } : null
      })),
      addWallet: (amount) => set((state) => ({
        user: state.user ? { ...state.user, walletBalance: state.user.walletBalance + amount } : null
      })),
    }),
    { name: 'auth-storage' }
  )
);
