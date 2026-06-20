/**
 * useAuthStore — manages JWT token + auth state.
 * This is the source of truth for whether the user is authenticated.
 * Token is stored in AsyncStorage under 'auth_token' so apiClient can read it.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch, BASE_URL } from '../lib/apiClient';

interface AuthState {
  token: string | null;
  userId: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  continueAsGuest: () => Promise<void>;
  handleOAuthRedirect: (token: string, userId: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userId: null,
      isLoading: true,
      error: null,

      continueAsGuest: async () => {
        set({ isLoading: true, error: null });
        try {
          const data = await apiFetch<{ token: string; userId: string }>(
            '/auth/guest',
            { method: 'POST', skipAuth: true }
          );
          await AsyncStorage.setItem('auth_token', data.token);
          set({ token: data.token, userId: data.userId, isLoading: false });
        } catch (err) {
          set({ error: (err as Error).message, isLoading: false });
        }
      },

      // Called after the OAuth redirect lands back in the app with ?token=...&userId=...
      handleOAuthRedirect: async (token: string, userId: string) => {
        await AsyncStorage.setItem('auth_token', token);
        set({ token, userId });
      },

      signOut: async () => {
        await AsyncStorage.removeItem('auth_token');
        set({ token: null, userId: null });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ token: state.token, userId: state.userId }),
      onRehydrateStorage: () => (state) => {
        if (state) state.isLoading = false;
      },
    }
  )
);

/**
 * Returns the OAuth redirect URL so screens can open it in a browser.
 */
export const oauthUrls = {
  google: `${BASE_URL}/auth/google`,
};
