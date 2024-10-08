import { Outlet } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "react-hot-toast";
import { AuthInit } from "./pages/auth/Auth";

function App() {
  console.log("App Rendered");
  
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthInit>
          <Outlet></Outlet>
        </AuthInit>
      </ThemeProvider>
      <Toaster />
    </>
  );
}

export default App;
