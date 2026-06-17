// ─── useScheduleStore.ts ──────────────────────────────────────────────────────
// Manages the user's active peptide schedules and dose-taken history.
//
// Key design decisions:
//   - Each ScheduledPeptide has an id, so multiple peptides can coexist
//   - takenDoses uses string keys: `${peptideId}-${date}-${time}` to uniquely
//     identify each dose instance without a separate log table
//   - Persisted via AsyncStorage so schedules survive app restarts
// ─────────────────────────────────────────────────────────────────────────────
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ScheduledPeptide {
  id: string;
  peptideId: string;
  label?: string;
  dose: number;
  unit: 'mg' | 'mcg';
  frequency: 'once' | 'twice' | 'custom';
  times: string[];             // ["09:00", "21:00"]
  days: number[];              // [0,1,2,3,4,5,6] (0=Sun)
  durationValue?: number;
  durationUnit?: 'days' | 'weeks' | 'months';
  runIndefinitely: boolean;
  startDate: string;           // ISO
  endDate?: string;            // computed ISO
  titrationMode?: 'titrate' | 'fixed';
}

interface ScheduleState {
  scheduledPeptides: ScheduledPeptide[];
  takenDoses: string[];        // doseKeys: `${peptideId}-${date}-${time}`

  addScheduledPeptide: (p: ScheduledPeptide) => void;
  removeScheduledPeptide: (id: string) => void;
  markDoseTaken: (doseKey: string) => void;
  unmarkDoseTaken: (doseKey: string) => void;
  clearAll: () => void;
}

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set) => ({
      scheduledPeptides: [],
      takenDoses: [],

      addScheduledPeptide: (p) =>
        set((state) => {
          const filtered = state.scheduledPeptides.filter((s) => s.id !== p.id);
          return { scheduledPeptides: [p, ...filtered] };
        }),

      removeScheduledPeptide: (id) =>
        set((state) => ({
          scheduledPeptides: state.scheduledPeptides.filter((s) => s.id !== id),
        })),

      markDoseTaken: (doseKey) =>
        set((state) => ({
          takenDoses: state.takenDoses.includes(doseKey)
            ? state.takenDoses
            : [...state.takenDoses, doseKey],
        })),

      unmarkDoseTaken: (doseKey) =>
        set((state) => ({
          takenDoses: state.takenDoses.filter((k) => k !== doseKey),
        })),

      clearAll: () => set({ scheduledPeptides: [], takenDoses: [] }),
    }),
    {
      name: 'schedule-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
