import { createContext, Dispatch } from "react";

//--------------------------------------------------
export const ModalContext = createContext<{
  open: boolean;
  handleOpen?: () => void;

  isLoading: boolean;
  setIsLoading?: Dispatch<React.SetStateAction<boolean>>;
}>({ open: false, isLoading: false });
