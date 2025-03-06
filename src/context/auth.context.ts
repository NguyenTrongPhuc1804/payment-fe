import { createContext, Dispatch, SetStateAction } from "react";
import { UserProfile } from "../interfaces/user.interfaces";

//--------------------------------------------------
export const AuthContext = createContext<{
  isLogin: boolean;
  setIsLogin?: (isLogin: boolean) => void;

  profile?: UserProfile | null;
  amount?: Omit<UserProfile, "uid" | "email"> | null;

  totalPaidSuccess?: number;
  setTotalPaidSuccess?: Dispatch<SetStateAction<number>>;

  totalPending?: number;
  setTotalPending?: Dispatch<SetStateAction<number>>;
}>({
  isLogin: false,
  profile: {} as UserProfile,
  totalPaidSuccess: 0,
  totalPending: 0,
});
