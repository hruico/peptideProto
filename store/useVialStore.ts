import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Vial, Blend } from '../types';

interface VialState {
  vials: Vial[];
  blends: Blend[];

  addVial: (vial: Vial) => void;
  removeVial: (id: string) => void;
  updateVial: (id: string, updates: Partial<Vial>) => void;
  addCustomBlend: (blend: Blend) => void;
  removeBlend: (id: string) => void;
  addPeptideToBlend: (blendId: string, peptide: { peptideId: string; peptideName: string; amountMg: number }) => void;
}

export const useVialStore = create<VialState>()(
  persist(
    (set) => ({
      vials: [],
      blends: [],

      addVial: (vial) =>
        set((state) => ({ vials: [vial, ...state.vials] })),

      removeVial: (id) =>
        set((state) => ({ vials: state.vials.filter((v) => v.id !== id) })),

      updateVial: (id, updates) =>
        set((state) => ({
          vials: state.vials.map((v) => (v.id === id ? { ...v, ...updates } : v)),
        })),

      addCustomBlend: (blend) =>
        set((state) => ({ blends: [blend, ...state.blends] })),

      removeBlend: (id) =>
        set((state) => ({ blends: state.blends.filter((b) => b.id !== id) })),

      addPeptideToBlend: (blendId, peptide) =>
        set((state) => ({
          blends: state.blends.map((b) =>
            b.id === blendId
              ? { ...b, peptides: [...b.peptides, peptide] }
              : b
          ),
        })),
    }),
    {
      name: 'vial-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
