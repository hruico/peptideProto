// ─── useOnboardingStore.ts ────────────────────────────────────────────────────
// Tracks onboarding state. The most critical field is `hasCompletedOnboarding`
// which the root _layout.tsx checks on every launch to decide whether to show
// the onboarding flow or go straight to tabs.
//
// Reset flow: calling resetOnboarding() sets hasCompletedOnboarding = false,
// which causes the root layout useEffect to redirect to /onboarding/splash.
// ─────────────────────────────────────────────────────────────────────────────
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Sex, AgeRange, OnboardingPath } from '../types';

interface OnboardingState {
  sex: Sex | null;
  ageRange: AgeRange | null;
  selectedPath: OnboardingPath | null;
  goal: string | null;
  interestedPeptideId: string | null;
  interestReasons: string[];
  hasCompletedOnboarding: boolean;

  // Actions
  setSex: (sex: Sex) => void;
  setAgeRange: (ageRange: AgeRange) => void;
  setSelectedPath: (path: OnboardingPath) => void;
  setGoal: (goal: string) => void;
  setInterestedPeptideId: (id: string) => void;
  setInterestReasons: (reasons: string[]) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
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
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
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
