import { create } from "zustand";

type Data = {
  id: string | null;
  file?: string | null;
  content: string | null;
  isEditing: boolean;
  fileKey: string | null;
};

type Store = {
  messageData: Data;
  setMessageData: (newData: Partial<Data>) => void;
  resetMessageData: () => void;
};

const defaultMessageData: Data = {
  content: null,
  id: null,
  isEditing: false,
  file: null,
  fileKey: null,
};

export const useMessageForm = create<Store>((set) => ({
  messageData: defaultMessageData,
  setMessageData: (newData) =>
    set((state) => ({ messageData: { ...state.messageData, ...newData } })),
  resetMessageData: () => set(() => ({ messageData: defaultMessageData })),
}));
