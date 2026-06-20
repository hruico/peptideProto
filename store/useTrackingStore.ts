import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from '../lib/apiClient';

export interface TrackedMetric {
  id: string;
  name: string;
  category: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  baselineValue?: number;
  unit?: string;
}

export interface TrackingSession {
  id: string;
  peptideId: string;
  metrics: TrackedMetric[];
  durationWeeks: number;
  startDate: string;
  endDate: string;
  baselinePhotoUri?: string;
}

interface TrackingState {
  sessions: TrackingSession[];
  isSynced: boolean;

  addSession: (s: TrackingSession) => Promise<void>;
  removeSession: (id: string) => Promise<void>;
  updateBaselinePhoto: (sessionId: string, uri: string) => Promise<void>;
  syncFromServer: () => Promise<void>;
}

export const useTrackingStore = create<TrackingState>()(
  persist(
    (set) => ({
      sessions: [],
      isSynced: false,

      addSession: async (s) => {
        set((state) => ({ sessions: [s, ...state.sessions.filter((x) => x.id !== s.id)] }));
        try {
          await apiFetch('/tracking', { method: 'POST', body: s });
        } catch (err) {
          console.warn('addSession sync failed:', err);
        }
      },

      removeSession: async (id) => {
        set((state) => ({ sessions: state.sessions.filter((s) => s.id !== id) }));
        try {
          await apiFetch(`/tracking/${id}`, { method: 'DELETE' });
        } catch (err) {
          console.warn('removeSession sync failed:', err);
        }
      },

      updateBaselinePhoto: async (sessionId, uri) => {
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === sessionId ? { ...s, baselinePhotoUri: uri } : s
          ),
        }));
        try {
          await apiFetch(`/tracking/${sessionId}/photo`, {
            method: 'PATCH',
            body: { baselinePhotoUri: uri },
          });
        } catch (err) {
          console.warn('updateBaselinePhoto sync failed:', err);
        }
      },

      syncFromServer: async () => {
        try {
          const sessions = await apiFetch<TrackingSession[]>('/tracking');
          set({ sessions, isSynced: true });
        } catch (err) {
          console.warn('tracking syncFromServer failed:', err);
        }
      },
    }),
    {
      name: 'tracking-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
