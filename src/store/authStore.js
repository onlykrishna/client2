import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const MOCK_USERS = [
  { uid: 'user-001', phone: '9999999999', name: 'Rajan Kumar', walletBalance: 1250, kycStatus: 'verified', isAdmin: false },
  { uid: 'admin-001', phone: '0000000000', name: 'Admin User', walletBalance: 0, kycStatus: 'verified', isAdmin: true },
];

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      login: async (phone, otp) => {
        set({ isLoading: true });
        await new Promise(r => setTimeout(r, 800)); // Simulate delay
        
        const mockUser = MOCK_USERS.find(u => u.phone === phone);
        if (!mockUser) {
          set({ isLoading: false });
          throw new Error('User not found. Try 9999999999');
        }

        const validOtp = mockUser.isAdmin ? '000000' : '123456';
        if (otp !== validOtp) {
          set({ isLoading: false });
          throw new Error('Invalid OTP. Try ' + validOtp);
        }

        set({ user: mockUser, isLoading: false });
        return mockUser;
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
