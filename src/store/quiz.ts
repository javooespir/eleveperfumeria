import { create } from "zustand";

type QuizState = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const useQuizStore = create<QuizState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));
