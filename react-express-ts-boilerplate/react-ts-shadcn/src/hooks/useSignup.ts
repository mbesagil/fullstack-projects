import { useState } from "react";
import toast from "react-hot-toast";
import ApiService from "@/core/ApiService";
import { useNavigate } from "react-router-dom";

const useSignup = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const signup = async (email: string, password: string) => {
    setLoading(true);
    try {
      await ApiService.post("auth/signup", {
        email,
        password,
      });

      toast.success("User CreatedSuccessfully. Please Login !");
      navigate("/auth/login");
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, signup };
};
export default useSignup;
