import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from '../lib/apiClient';
import {
  scheduleProtocolNotifications,
  cancelNotifications,
} from '../lib/notifications';
import type { Protocol, ActivityLogEntry } from '../types';
import type { ProtocolExtended } from '../data/protocols';

interface ActiveProtocol extends Protocol {
  startedAt: string;
  /** Expo notification IDs so we can cancel them on removal */
  notificationIds?: string[];
}

interface ProtocolState {
  myProtocols: ActiveProtocol[];
  activityLog: ActivityLogEntry[];
  isSynced: boolean;

  // Actions
  startProtocol: (protocol: ProtocolExtended) => Promise<void>;
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
        // Optimistic local update (without notification IDs yet)
        set((state) => {
          const filtered = state.myProtocols.filter((p) => p.id !== protocol.id);
          const active: ActiveProtocol = { ...protocol, startedAt: new Date().toISOString() };
          return { myProtocols: [active, ...filtered] };
        });

        // Schedule notifications and store their IDs
        const notificationIds = await scheduleProtocolNotifications(protocol);
        if (notificationIds.length > 0) {
          set((state) => ({
            myProtocols: state.myProtocols.map((p) =>
              p.id === protocol.id ? { ...p, notificationIds } : p
            ),
          }));
        }

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
        // Cancel any scheduled notifications for this protocol
        const protocol = get().myProtocols.find((p) => p.id === id);
        if (protocol?.notificationIds?.length) {
          await cancelNotifications(protocol.notificationIds);
        }

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
