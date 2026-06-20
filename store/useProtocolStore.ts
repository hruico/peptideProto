import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from '../lib/apiClient';
import type { Protocol, ActivityLogEntry } from '../types';

interface ActiveProtocol extends Protocol {
  startedAt: string;
}

interface ProtocolState {
  myProtocols: ActiveProtocol[];
  activityLog: ActivityLogEntry[];
  isSynced: boolean;

  // Actions
  startProtocol: (protocol: Protocol) => Promise<void>;
  removeProtocol: (id: string) => Promise<void>;
  logActivity: (entry: ActivityLogEntry) => void;
  clearActivityLog: () => void;
  syncFromServer: () => Promise<void>;
}

export const useProtocolStore = create<ProtocolState>()(
  persist(
    (set, get) => ({
      myProtocols: [],
      activityLog: [],
      isSynced: false,

      startProtocol: async (protocol) => {
        // Optimistic local update
        set((state) => {
          const filtered = state.myProtocols.filter((p) => p.id !== protocol.id);
          const active: ActiveProtocol = { ...protocol, startedAt: new Date().toISOString() };
          return { myProtocols: [active, ...filtered] };
        });

        try {
          await apiFetch('/protocols', {
            method: 'POST',
            body: { protocolId: protocol.id, name: protocol.name },
          });
        } catch (err) {
          console.warn('startProtocol sync failed:', err);
        }
      },

      removeProtocol: async (id) => {
        set((state) => ({ myProtocols: state.myProtocols.filter((p) => p.id !== id) }));
        try {
          await apiFetch(`/protocols/${id}`, { method: 'DELETE' });
        } catch (err) {
          console.warn('removeProtocol sync failed:', err);
        }
      },

      logActivity: (entry) =>
        set((state) => ({ activityLog: [entry, ...state.activityLog] })),

      clearActivityLog: () => set({ activityLog: [] }),

      syncFromServer: async () => {
        try {
          const [protocols, activity] = await Promise.all([
            apiFetch<ActiveProtocol[]>('/protocols'),
            apiFetch<ActivityLogEntry[]>('/protocols/activity'),
          ]);
          set({ myProtocols: protocols, activityLog: activity, isSynced: true });
        } catch (err) {
          console.warn('protocol syncFromServer failed:', err);
        }
      },
    }),
    {
      name: 'protocol-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
