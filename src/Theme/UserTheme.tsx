import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import LoadingSpinner from "../components/LoadingSpinner";
import { ToastContainer } from "react-toastify";

const UserTheme = () => {
  return (
    <div>
      <Header />
      <Outlet />

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
    </div>
  );
};

export default UserTheme;
