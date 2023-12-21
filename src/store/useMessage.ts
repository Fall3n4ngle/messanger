import { UpdateMessage } from "@/lib/actions/messages/mutations";
import { create } from "zustand";

type Store = {
  message: UpdateMessage;
  setMessage: (newMessage: UpdateMessage) => void;
};

const initialMessage: UpdateMessage = {
  content: "",
  file: "",
};

export const useMessage = create<Store>((set) => ({
  message: initialMessage,
  setMessage: (newMessage) => set(() => ({ message: newMessage })),
}));
