import { Outlet } from "react-router-dom";
import { ThemeModeToggle } from "@/components/special-buttons/ThemeModeToggle";

export default function AuthLayout() {
  return (
    <div className="h-full flex flex-col relative">
      <div className="absolute top-2 right-2">
        <ThemeModeToggle></ThemeModeToggle>
      </div>
      <div className="flex-1">
        <Outlet></Outlet>
      </div>
    </div>
  );
}
