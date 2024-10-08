import { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import ApiService from "@/core/ApiService";
import { setCurrentUser, setToken } from "../stores/userSlice";
import { useNavigate } from "react-router-dom";
import { getUserByToken, setAuth } from "@/pages/auth/authHelper";

const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const loginData: any = await ApiService.post("auth/login", {
        email,
        password,
      });

      setAuth(loginData.data.user.token.access_token);
      dispatch(setToken(loginData.data.user.token.access_token));
      const verifyResponse: any = await getUserByToken(
        loginData.data.user.token.access_token
      );

      if (verifyResponse) {
        dispatch(setCurrentUser(verifyResponse.data.data)); // Ensure to dispatch the action
      }

      //1- set ApiService Header.
      ApiService.setHeader();
      //2- push main page
      navigate("/");
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, login };
};
export default useLogin;
