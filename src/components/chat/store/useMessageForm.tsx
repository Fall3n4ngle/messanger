import { create } from "zustand";

type Data = {
  id: string | null;
  file?: string | null;
  content: string | null;
  isUpdating: boolean;
};

type Store = {
  messageData: Data;
  setMessageData: (newData: Data) => void;
};

export const useMessageForm = create<Store>((set) => ({
  messageData: {
    content: null,
    file: null,
    id: null,
    isUpdating: false,
  },
  setMessageData: (newData) => set(() => ({ messageData: newData })),
}));
