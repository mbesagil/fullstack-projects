import { useEffect, ReactNode, useState } from "react";
import { setCurrentUser } from "../../stores/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { logout as logoutStore } from "../../stores/userSlice";
import { RootState } from "../../stores"; // Assuming you have a RootState type defined for your Redux state
import { getUserByToken, removeAuth } from "./authHelper";
import { useNavigate } from "react-router-dom";
import ApiService from "@/core/ApiService";
import SplashScreen from "./splashscreen/SplashScreen";

interface AuthInitProps {
  children: ReactNode;
}

const AuthInit: React.FC<AuthInitProps> = ({ children }) => {
  console.log("Auth Render");

  const userSlice = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showSplashScreen, setShowSplashScreen] = useState(true);

  const logout = () => {
    removeAuth();
    dispatch(logoutStore());
    navigate("/auth/login");
  };

  const requestUser = async (apiToken: string) => {
    try {
      if (!userSlice.currentUser) {
        const verifyResponse: any = await getUserByToken(apiToken);

        if (verifyResponse) {
          dispatch(setCurrentUser(verifyResponse.data.data)); // Ensure to dispatch the action
          ApiService.setHeader();
        }
      }
    } catch (error) {
      console.error(error);
      logout();
    } finally {
      setTimeout(() => {
        setShowSplashScreen(false);
      }, 1000);
    }
  };

  useEffect(() => {
    setShowSplashScreen(true);

    if (userSlice && userSlice.token) {
      requestUser(userSlice.token);
    } else {
      logout();
      setShowSplashScreen(false);
    }
    // eslint-disable-next-line
  }, []);

  return showSplashScreen ? <SplashScreen></SplashScreen> : <>{children}</>;
};

export { AuthInit };
