import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Protocol, ActivityLogEntry } from '../types';

interface ActiveProtocol extends Protocol {
  startedAt: string; // ISO date string
}

interface ProtocolState {
  myProtocols: ActiveProtocol[];
  activityLog: ActivityLogEntry[];

  // Actions
  startProtocol: (protocol: Protocol) => void;
  removeProtocol: (id: string) => void;
  logActivity: (entry: ActivityLogEntry) => void;
  clearActivityLog: () => void;
}

export const useProtocolStore = create<ProtocolState>()(
  persist(
    (set) => ({
      myProtocols: [],
      activityLog: [],

      startProtocol: (protocol) =>
        set((state) => {
          // Prevent duplicate — replace if already exists
          const filtered = state.myProtocols.filter((p) => p.id !== protocol.id);
          const active: ActiveProtocol = {
            ...protocol,
            startedAt: new Date().toISOString(),
          };
          return { myProtocols: [active, ...filtered] };
        }),

      removeProtocol: (id) =>
        set((state) => ({
          myProtocols: state.myProtocols.filter((p) => p.id !== id),
        })),

      logActivity: (entry) =>
        set((state) => ({
          activityLog: [entry, ...state.activityLog],
        })),

      clearActivityLog: () => set({ activityLog: [] }),
    }),
    {
      name: 'protocol-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
