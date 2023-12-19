import { create } from "zustand";

type Store = {
  users: string[];
  add: (user: string) => void;
  remove: (user: string) => void;
};

export const useTypingUsers = create<Store>((set) => ({
  users: [],
  add: (user) =>
    set((state) => {
      if (state.users.find((u) => u === user)) return state;

      return { users: [...state.users, user] };
    }),
  remove: (user) => {
    set((state) => {
      return { users: state.users.filter((u) => u !== user) };
    });
  },
}));
