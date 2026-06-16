import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserProfile } from '../types';

interface UserState {
  isGuest: boolean;
  user: UserProfile | null;

  // Actions
  continueAsGuest: () => void;
  signIn: (displayName?: string) => void;
  signOut: () => void;
}

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      isGuest: true,
      user: null,

      continueAsGuest: () => {
        // Only create a guest profile if one doesn't exist yet
        if (!get().user) {
          set({
            isGuest: true,
            user: {
              id: generateId(),
              createdAt: new Date().toISOString(),
              isGuest: true,
            },
          });
        }
      },

      signIn: (displayName) =>
        set((state) => ({
          isGuest: false,
          user: state.user
            ? { ...state.user, displayName, isGuest: false }
            : {
                id: generateId(),
                displayName,
                createdAt: new Date().toISOString(),
                isGuest: false,
              },
        })),

      signOut: () =>
        set({
          isGuest: true,
          user: null,
        }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
