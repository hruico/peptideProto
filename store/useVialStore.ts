import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Vial, Blend } from '../types';

interface VialState {
  vials: Vial[];
  blends: Blend[];

  // Actions
  addVial: (vial: Vial) => void;
  removeVial: (id: string) => void;
  addCustomBlend: (blend: Blend) => void;
  removeBlend: (id: string) => void;
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

      addCustomBlend: (blend) =>
        set((state) => ({ blends: [blend, ...state.blends] })),

      removeBlend: (id) =>
        set((state) => ({ blends: state.blends.filter((b) => b.id !== id) })),
    }),
    {
      name: 'vial-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
