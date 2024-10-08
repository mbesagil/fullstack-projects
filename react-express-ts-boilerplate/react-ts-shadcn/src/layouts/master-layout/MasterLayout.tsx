import { Link, Outlet, useNavigate } from "react-router-dom";
import { ThemeModeToggle } from "@/components/special-buttons/ThemeModeToggle";
import UserMenu from "./navbar/UserMenu.tsx";

export default function MasterLayout() {
  return (
    <div className="h-full flex flex-col relative">
      <div className="h-12 bg-slate-300 dark:bg-slate-800  flex items-center justify-between px-5 py-2">
        <div>SELAM</div>
        <div className="flex items-center gap-3">
          <Link to={"/stories"}>Stories</Link>
          <ThemeModeToggle></ThemeModeToggle>
          <UserMenu></UserMenu>
        </div>
      </div>
      <div className="flex-1 px-5 py-2">
        <Outlet></Outlet>
      </div>
    </div>
  );
}
