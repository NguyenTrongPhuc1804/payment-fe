import { Route, Routes } from "react-router-dom";
import UserTheme from "./Theme/UserTheme";
// import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/login/LoginPage";
import { FC, useEffect, useState } from "react";
import { db } from "./firebase/firebaseConfig";
import { AuthContext } from "./context/auth.context";
import HomePage from "./pages/home/HomePage";
import AccountPage from "./pages/account/AccountPage";
import ModalDefault from "./components/Modal";
import { ModalContext } from "./context/modal.context";
import { ToastContainer } from "react-toastify";
import { collection, getDocs } from "firebase/firestore";
import LoadingSpinner from "./components/LoadingSpinner";
import { UserProfile } from "./interfaces/user.interfaces";

const App: FC<{}> = () => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [amount, setAmount] = useState<UserProfile | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //--------------------------------------------------------------------------------
  const [totalPaidSuccess, setTotalPaidSuccess] = useState<number>(0);
  const [totalPending, setTotalPending] = useState<number>(0);

  //----------------------------------------------------------------
  const handleOpen = () => setOpen(!open);

  //--------------------------------------------------------------------------------
  const handleGetAmountPayment = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));

    const newAmount = {
      amount_balance: querySnapshot.docs[0].data().amount_balance,
      total_paid: querySnapshot.docs[0].data().total_paid,
      total_pending: querySnapshot.docs[0].data().total_pending,
    };

    setAmount(newAmount);

    localStorage.setItem("amount", JSON.stringify(newAmount));
  };

  //--------------------------------------------------------------------------------
  useEffect(() => {
    const userProfile = localStorage.getItem("profile");
    if (userProfile) {
      setProfile(JSON.parse(userProfile));
    }
    localStorage.getItem("accessToken") ? setIsLogin(true) : setIsLogin(false);
  }, [isLogin]);

  //--------------------------------------------------------------------------------
  useEffect(() => {
    handleGetAmountPayment();
  }, [isLoading]);

  return (
    <AuthContext.Provider
      value={{
        isLogin,
        profile,
        amount,
        totalPaidSuccess,
        totalPending,
        setIsLogin,
        setTotalPaidSuccess,
        setTotalPending,
      }}
    >
      <ModalContext.Provider
        value={{ open, handleOpen, isLoading, setIsLoading }}
      >
        <Routes>
          {!isLogin ? (
            <Route path="" element={<LoginPage />} />
          ) : (
            <Route path="/" element={<UserTheme />}>
              <Route path="/about" element={<HomePage />} />
              <Route path="/account" element={<AccountPage />} />
            </Route>
          )}
        </Routes>

        {/* global component */}
        <ModalDefault open={open} handleOpen={handleOpen} />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <LoadingSpinner />
      </ModalContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;
