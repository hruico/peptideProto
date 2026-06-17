import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  addSession: (s: TrackingSession) => void;
  removeSession: (id: string) => void;
  updateBaselinePhoto: (sessionId: string, uri: string) => void;
}

export const useTrackingStore = create<TrackingState>()(
  persist(
    (set) => ({
      sessions: [],

      addSession: (s) =>
        set((state) => ({ sessions: [s, ...state.sessions.filter((x) => x.id !== s.id)] })),

      removeSession: (id) =>
        set((state) => ({ sessions: state.sessions.filter((s) => s.id !== id) })),

      updateBaselinePhoto: (sessionId, uri) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === sessionId ? { ...s, baselinePhotoUri: uri } : s
          ),
        })),
    }),
    {
      name: 'tracking-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
