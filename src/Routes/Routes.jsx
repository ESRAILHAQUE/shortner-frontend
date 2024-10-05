import { createBrowserRouter } from "react-router-dom";

import Shorter from "../Components/Shorter";
import Dashboard from "../Pages/Dashboard/Dashboard";
import { Home } from "../Components/Home";
import Signup from "../Pages/SignUp/SignUp";
import Login from "../Pages/Login/Login";
import ManageUser from "../Components/ManageUser";
import Payment from "../Components/Payment";
import ShortURL from "../Pages/ShortURL/ShortURL";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/shorter",
        element: <Shorter />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/manageuser",
        element: <ManageUser />,
      },
      {
        path: "/payment",
        element: <Payment />,
      },
    ],
  },
  {
    path: "/:shortURL",
    element: <ShortURL />,
  },
]);
