import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
} from "react";

type ContextValue = {
  isUploading: boolean;
  setIsUploading: Dispatch<SetStateAction<boolean>>;
};

const Context = createContext<ContextValue | null>(null);

export default function IsUploadingProvider({
  isUploading,
  setIsUploading,
  children,
}: ContextValue & PropsWithChildren) {
  return (
    <Context.Provider value={{ isUploading, setIsUploading }}>
      {children}
    </Context.Provider>
  );
}

export const useIsUploading = () => {
  const value = useContext(Context);

  if (!value) {
    throw new Error("Cannot access isUploading context value outside provider");
  }

  return value;
};
