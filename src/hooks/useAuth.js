import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { user, isLoading, login, logout, updateProfile } = useAuthStore();

  return {
    user,
    profile: user, // Alias for profile
    isAdmin: user?.isAdmin || false,
    loading: isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    updateProfile
  };
};
