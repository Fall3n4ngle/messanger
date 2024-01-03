import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

type Data = {
  name: string;
  image: string;
  members: { id: string }[];
};

type Value = {
  data: Data;
  setData: Dispatch<SetStateAction<Data>>;
};

const Context = createContext<Value | null>(null);

export const GroupFormProvider = ({ children }: PropsWithChildren) => {
  const [data, setData] = useState<Data>({
    name: "",
    image: "",
    members: [],
  });

  return (
    <Context.Provider value={{ data, setData }}>{children}</Context.Provider>
  );
};

export const useGroupForm = () => {
  const value = useContext(Context);

  if (!value) {
    throw new Error(
      "Cannot access group form context outside group form provider"
    );
  }

  return value;
};
