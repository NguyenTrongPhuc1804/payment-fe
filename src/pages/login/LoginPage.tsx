import { Button } from "@material-tailwind/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebaseConfig";
import { AuthContext } from "../../context/auth.context";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { UserAuth } from "../../interfaces/user.interfaces";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("admin123@gmail.com");
  const [password, setPassword] = useState<string>("admin123");

  //--------------------------------------------------------------------------------
  const { isLogin, setIsLogin } = useContext(AuthContext);

  //--------------------------------------------------------------------------------
  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user as UserAuth;

      const querySnapshot = await getDocs(collection(db, "users"));

      const profile = {
        uid: user.uid,
        email: user.email,
      };

      const amount = {
        amount_balance: querySnapshot.docs[0].data().amount_balance,
        total_paid: querySnapshot.docs[0].data().total_paid,
        total_pending: querySnapshot.docs[0].data().total_pending,
      };

      localStorage.setItem("accessToken", await user.getIdToken());
      localStorage.setItem("profile", JSON.stringify(profile));
      localStorage.setItem("amount", JSON.stringify(amount));

      setIsLogin?.(true);

      navigate("/about");
    } catch (error: any) {
      console.error("Error signing in:", error.message);
    }
  };

  return (
    <div className="">
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a
            href="#"
            className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
          ></a>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>
              <form className="space-y-4 md:space-y-6" action="#">
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="admin123@gmail.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>

                <Button
                  onClick={() => signIn(email, password)}
                  className="w-full"
                >
                  Sign in
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
