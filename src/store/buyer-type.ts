import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BuyerType } from "@/lib/types";

type BuyerTypeState = {
  buyerType: BuyerType | null;
  setBuyerType: (type: BuyerType) => void;
  reset: () => void;
};

export const useBuyerTypeStore = create<BuyerTypeState>()(
  persist(
    (set) => ({
      buyerType: null,
      setBuyerType: (type) => set({ buyerType: type }),
      reset: () => set({ buyerType: null }),
    }),
    { name: "eleve-buyer-type" }
  )
);
