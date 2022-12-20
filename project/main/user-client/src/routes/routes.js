import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavPage } from "../pages";

export const AllRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<NavPage />}></Route>
    </Routes>
  </BrowserRouter>
);
