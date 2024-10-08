import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { logout } from "@/stores/userSlice";
import { useDispatch } from "react-redux";
import { removeAuth } from "@/pages/auth/authHelper";
export default function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutHandle = () => {
    try {
      removeAuth();
      dispatch(logout());
      navigate("/auth/login");
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  return (
    <Button className="w-full" onClick={logoutHandle}>
      {" "}
      <MdLogout className="font-bold pe-1" size={20} /> Logout
    </Button>
  );
}
