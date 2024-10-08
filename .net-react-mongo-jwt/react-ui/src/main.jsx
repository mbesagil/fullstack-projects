import "bootstrap/dist/css/bootstrap.min.css"

import React from "react";
import ReactDOM from "react-dom/client";

import { Provider as ReduxProvider } from "react-redux";
import store from "./stores/index";

import { AppRoutes } from "./routes/AppRoutes";
import "./index.css";



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <ReduxProvider store={store}>
        <AppRoutes />
      </ReduxProvider>
  </React.StrictMode>
);
