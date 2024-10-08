import { useSelector } from "react-redux";
import { RootState } from "@/stores";

import { Button, Drawer } from "antd";
import { useState } from "react";

export default function Home() {
  const userSlice = useSelector((state: RootState) => state.user);

  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <div className="h-full flex items-center justify-center">
      Home Page User Authenticated. Hello
      <span className="bg-blue-500 rounded-sm ms-2">
        {" "}
        {userSlice.currentUser?.email}
      </span>
      <div>
        <Button type="primary" onClick={showDrawer}>
          Open
        </Button>
        <Drawer title="Basic Drawer" onClose={onClose} open={open}>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Drawer>
      </div>
    </div>
  );
}
