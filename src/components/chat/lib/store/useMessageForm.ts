import { UpdateMessage } from "@/lib/actions/messages/mutations";
import { create } from "zustand";

type State = {
  isUpdating: boolean;
  message: UpdateMessage;
};

type Store = {
  message: UpdateMessage;
  isUpdating: boolean;
  setMessage: (newMessage: UpdateMessage) => void;
  setIsUpdating: (isUpdating: boolean) => void;
};

const defaultMessage: UpdateMessage = {
  file: null,
  content: null,
};

export const useMessageForm = create<Store>((set) => ({
  message: defaultMessage,
  isUpdating: false,
  setMessage: (newMessage: UpdateMessage) =>
    set(() => ({ message: newMessage })),
  setIsUpdating: (isUpdating) => set(() => ({ isUpdating })),
}));
