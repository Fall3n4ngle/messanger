import { create } from "zustand";

type Store = {
  usersIds: string[];
  add: (userId: string) => void;
  remove: (userId: string) => void;
  set: (usersIds: string[]) => void;
};

export const useActiveUsers = create<Store>((set) => ({
  usersIds: [],
  add: (userId) => set((state) => ({ usersIds: [...state.usersIds, userId] })),
  remove: (userId) =>
    set((state) => ({
      usersIds: state.usersIds.filter((id) => id !== userId),
    })),
  set: (usersIds) => set(() => ({ usersIds })),
}));
