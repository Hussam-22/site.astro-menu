import { create } from "zustand";

export const useGlobalStore = create((set) => ({
  isYearly: false,
  togglePlan: () => set((state) => ({ isYearly: !state.isYearly })),
}));
