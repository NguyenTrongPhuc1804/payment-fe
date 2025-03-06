import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";

const UserTheme = () => {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
};

export default UserTheme;
