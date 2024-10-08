import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeModeToggle } from "@/components/special-buttons/ThemeModeToggle";
import Logout from "./Logout";

export default function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="w-10 h-10 rounded-full bg-blue-400"></div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="me-2 mt-1">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Logout></Logout>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
