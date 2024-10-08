import React from "react";
import ReactDOM from "react-dom/client";
import { AppRoutes } from "./router/AppRoutes";
import { Provider as ReduxProvider } from "react-redux";
import "./index.css";
import store from "@/stores/index.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
    <ReduxProvider store={store}>
        <AppRoutes></AppRoutes>
    </ReduxProvider>
  // </React.StrictMode>
);
