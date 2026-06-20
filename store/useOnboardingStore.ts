// ─── useOnboardingStore.ts ────────────────────────────────────────────────────
// Tracks onboarding state. On completion, also persists to backend via
// PATCH /user/me/onboarding so the profile survives reinstalls.
// ─────────────────────────────────────────────────────────────────────────────
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from '../lib/apiClient';
import type { Sex, AgeRange, OnboardingPath } from '../types';

interface OnboardingState {
  sex: Sex | null;
  ageRange: AgeRange | null;
  selectedPath: OnboardingPath | null;
  goal: string | null;
  interestedPeptideId: string | null;
  interestReasons: string[];
  hasCompletedOnboarding: boolean;

  setSex: (sex: Sex) => void;
  setAgeRange: (ageRange: AgeRange) => void;
  setSelectedPath: (path: OnboardingPath) => void;
  setGoal: (goal: string) => void;
  setInterestedPeptideId: (id: string) => void;
  setInterestReasons: (reasons: string[]) => void;
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      sex: null,
      ageRange: null,
      selectedPath: null,
      goal: null,
      interestedPeptideId: null,
      interestReasons: [],
      hasCompletedOnboarding: false,

      setSex: (sex) => set({ sex }),
      setAgeRange: (ageRange) => set({ ageRange }),
      setSelectedPath: (selectedPath) => set({ selectedPath }),
      setGoal: (goal) => set({ goal }),
      setInterestedPeptideId: (interestedPeptideId) => set({ interestedPeptideId }),
      setInterestReasons: (interestReasons) => set({ interestReasons }),

      completeOnboarding: async () => {
        set({ hasCompletedOnboarding: true });
        const { sex, ageRange, selectedPath, goal, interestedPeptideId, interestReasons } = get();
        try {
          await apiFetch('/user/me/onboarding', {
            method: 'PATCH',
            body: {
              sex,
              ageRange,
              selectedPath,
              goal,
              interestedPeptideId,
              interestReasons,
              hasCompleted: true,
            },
          });
        } catch (err) {
          console.warn('completeOnboarding sync failed:', err);
        }
      },

      resetOnboarding: () =>
        set({
          sex: null,
          ageRange: null,
          selectedPath: null,
          goal: null,
          interestedPeptideId: null,
          interestReasons: [],
          hasCompletedOnboarding: false,
        }),
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
