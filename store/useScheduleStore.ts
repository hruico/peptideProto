// ─── useScheduleStore.ts ──────────────────────────────────────────────────────
// Local Zustand cache + backend sync via REST API.
// takenDoses are stored as string keys: `${peptideId}-${date}-${time}`
// ─────────────────────────────────────────────────────────────────────────────
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from '../lib/apiClient';

export interface ScheduledPeptide {
  id: string;
  peptideId: string;
  label?: string;
  dose: number;
  unit: 'mg' | 'mcg';
  frequency: 'once' | 'twice' | 'custom';
  times: string[];
  days: number[];
  durationValue?: number;
  durationUnit?: 'days' | 'weeks' | 'months';
  runIndefinitely: boolean;
  startDate: string;
  endDate?: string;
  titrationMode?: 'titrate' | 'fixed';
}

interface ScheduleState {
  scheduledPeptides: ScheduledPeptide[];
  takenDoses: string[];
  isSynced: boolean;

  addScheduledPeptide: (p: ScheduledPeptide) => Promise<void>;
  removeScheduledPeptide: (id: string) => Promise<void>;
  markDoseTaken: (doseKey: string) => Promise<void>;
  unmarkDoseTaken: (doseKey: string) => Promise<void>;
  clearAll: () => void;
  syncFromServer: () => Promise<void>;
}

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set) => ({
      scheduledPeptides: [],
      takenDoses: [],
      isSynced: false,

      addScheduledPeptide: async (p) => {
        set((state) => {
          const filtered = state.scheduledPeptides.filter((s) => s.id !== p.id);
          return { scheduledPeptides: [p, ...filtered] };
        });
        try {
          await apiFetch('/schedule', { method: 'POST', body: p });
        } catch (err) {
          console.warn('addScheduledPeptide sync failed:', err);
        }
      },

      removeScheduledPeptide: async (id) => {
        set((state) => ({
          scheduledPeptides: state.scheduledPeptides.filter((s) => s.id !== id),
        }));
        try {
          await apiFetch(`/schedule/${id}`, { method: 'DELETE' });
        } catch (err) {
          console.warn('removeScheduledPeptide sync failed:', err);
        }
      },

      markDoseTaken: async (doseKey) => {
        set((state) => ({
          takenDoses: state.takenDoses.includes(doseKey)
            ? state.takenDoses
            : [...state.takenDoses, doseKey],
        }));
        try {
          await apiFetch('/schedule/doses', { method: 'POST', body: { doseKey } });
        } catch (err) {
          console.warn('markDoseTaken sync failed:', err);
        }
      },

      unmarkDoseTaken: async (doseKey) => {
        set((state) => ({
          takenDoses: state.takenDoses.filter((k) => k !== doseKey),
        }));
        try {
          await apiFetch(`/schedule/doses/${encodeURIComponent(doseKey)}`, { method: 'DELETE' });
        } catch (err) {
          console.warn('unmarkDoseTaken sync failed:', err);
        }
      },

      clearAll: () => set({ scheduledPeptides: [], takenDoses: [] }),

      syncFromServer: async () => {
        try {
          const data = await apiFetch<{
            scheduledPeptides: ScheduledPeptide[];
            takenDoses: string[];
          }>('/schedule');
          set({ ...data, isSynced: true });
        } catch (err) {
          console.warn('schedule syncFromServer failed:', err);
        }
      },
    }),
    {
      name: 'schedule-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
