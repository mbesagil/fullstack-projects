import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";

import App from "../App";
import Home from "@/pages/home/Home";
import NotFound from "@/pages/error/NotFound";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import MasterLayout from "@/layouts/master-layout/MasterLayout";
import AuthLayout from "@/layouts/AuthLayout";
import { useSelector } from "react-redux";
import { RootState } from "@/stores";
import StoryIndex from "@/pages/story/Index";
import AuthenticatedRoutes from "./AuthenticatedRoutes";

const { BASE_URL } = import.meta.env;

const AppRoutes = () => {
  const userSlice = useSelector((state: RootState) => state.user);
  console.log("App Routes Render");

  console.log("userSlice.authenticated :>> ", userSlice.authenticated);
  return (
    <BrowserRouter basename={BASE_URL}>
      <Routes>
        <Route path="/" element={<App />}>
        <Route element={<MasterLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="stories" element={<StoryIndex />} />
      </Route>
        <Route path="/*" element={<AuthenticatedRoutes />} />
          {userSlice.authenticated ? (
            <>
            </>
          ) : (
            <>
              <Route path="/auth" element={<AuthLayout />}>
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />
              </Route>
            </>
          )}
        </Route>
        <Route path="*" element={<NotFound />} />{" "}
      </Routes>
      {/* <Routes>
        <Route path="/" element={<App />}>
          <Route
            path="/"
            element={
              userSlice.authenticated ? (
                <MasterLayout />
              ) : (
                <Navigate to="/auth/login" />
              )
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/stories" element={<StoryIndex />} />
          </Route>
          <Route
            path="/auth"
            element={
              !userSlice.authenticated ? <AuthLayout /> : <Navigate to="/" />
            }
          >
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />{" "}
      </Routes> */}
    </BrowserRouter>
  );
};

export { AppRoutes };
