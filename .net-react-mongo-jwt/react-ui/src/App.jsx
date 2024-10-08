import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import "./App.css";
import "primereact/resources/themes/saga-blue/theme.css"; // tema dosyası
import "primereact/resources/primereact.min.css"; // temel CSS
import "primeicons/primeicons.css"; // PrimeIcons
import "primeflex/primeflex.css"; // PrimeFlex

function App() {
  return (
    <>
        <Outlet></Outlet>
    </>
  );
}

export default App;
