import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from '../lib/apiClient';
import type { Vial, Blend } from '../types';

interface VialState {
  vials: Vial[];
  blends: Blend[];
  isSynced: boolean;

  addVial: (vial: Vial) => Promise<void>;
  removeVial: (id: string) => Promise<void>;
  updateVial: (id: string, updates: Partial<Vial>) => Promise<void>;
  addCustomBlend: (blend: Blend) => Promise<void>;
  removeBlend: (id: string) => Promise<void>;
  addPeptideToBlend: (
    blendId: string,
    peptide: { peptideId: string; peptideName: string; amountMg: number }
  ) => Promise<void>;
  syncFromServer: () => Promise<void>;
}

export const useVialStore = create<VialState>()(
  persist(
    (set) => ({
      vials: [],
      blends: [],
      isSynced: false,

      addVial: async (vial) => {
        set((state) => ({ vials: [vial, ...state.vials] }));
        try {
          await apiFetch('/vials', { method: 'POST', body: vial });
        } catch (err) {
          console.warn('addVial sync failed:', err);
        }
      },

      removeVial: async (id) => {
        set((state) => ({ vials: state.vials.filter((v) => v.id !== id) }));
        try {
          await apiFetch(`/vials/${id}`, { method: 'DELETE' });
        } catch (err) {
          console.warn('removeVial sync failed:', err);
        }
      },

      updateVial: async (id, updates) => {
        set((state) => ({
          vials: state.vials.map((v) => (v.id === id ? { ...v, ...updates } : v)),
        }));
        try {
          await apiFetch(`/vials/${id}`, { method: 'PATCH', body: updates });
        } catch (err) {
          console.warn('updateVial sync failed:', err);
        }
      },

      addCustomBlend: async (blend) => {
        set((state) => ({ blends: [blend, ...state.blends] }));
        try {
          await apiFetch('/vials/blends', { method: 'POST', body: blend });
        } catch (err) {
          console.warn('addCustomBlend sync failed:', err);
        }
      },

      removeBlend: async (id) => {
        set((state) => ({ blends: state.blends.filter((b) => b.id !== id) }));
        try {
          await apiFetch(`/vials/blends/${id}`, { method: 'DELETE' });
        } catch (err) {
          console.warn('removeBlend sync failed:', err);
        }
      },

      addPeptideToBlend: async (blendId, peptide) => {
        set((state) => ({
          blends: state.blends.map((b) =>
            b.id === blendId ? { ...b, peptides: [...b.peptides, peptide] } : b
          ),
        }));
        try {
          await apiFetch(`/vials/blends/${blendId}/peptides`, { method: 'POST', body: peptide });
        } catch (err) {
          console.warn('addPeptideToBlend sync failed:', err);
        }
      },

      syncFromServer: async () => {
        try {
          const [vials, blends] = await Promise.all([
            apiFetch<Vial[]>('/vials'),
            apiFetch<Blend[]>('/vials/blends'),
          ]);
          set({ vials, blends, isSynced: true });
        } catch (err) {
          console.warn('vials syncFromServer failed:', err);
        }
      },
    }),
    {
      name: 'vial-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
