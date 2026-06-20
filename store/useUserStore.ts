import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from '../lib/apiClient';
import type { UserProfile } from '../types';

interface UserState {
  user: UserProfile | null;
  isLoading: boolean;

  fetchProfile: () => Promise<void>;
  updateDisplayName: (name: string) => Promise<void>;
  clearProfile: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,

      fetchProfile: async () => {
        set({ isLoading: true });
        try {
          const user = await apiFetch<UserProfile>('/user/me');
          set({ user, isLoading: false });
        } catch (err) {
          console.warn('fetchProfile failed:', err);
          set({ isLoading: false });
        }
      },

      updateDisplayName: async (displayName) => {
        set((state) => ({
          user: state.user ? { ...state.user, displayName } : null,
        }));
        try {
          const user = await apiFetch<UserProfile>('/user/me', {
            method: 'PATCH',
            body: { displayName },
          });
          set({ user });
        } catch (err) {
          console.warn('updateDisplayName sync failed:', err);
        }
      },

      clearProfile: () => set({ user: null }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
