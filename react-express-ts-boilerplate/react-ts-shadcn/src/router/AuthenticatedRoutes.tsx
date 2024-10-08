import MasterLayout from "@/layouts/master-layout/MasterLayout";
import Home from "@/pages/home/Home";
import StoryIndex from "@/pages/story/Index";
import { Route, Routes } from "react-router-dom";

export default function AuthenticatedRoutes() {
  return (
    <Routes>
      <Route element={<MasterLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="stories" element={<StoryIndex />} />
      </Route>
    </Routes>
  );
}
