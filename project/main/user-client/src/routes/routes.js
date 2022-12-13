import { BrowserRouter, Routes, Route } from "react-router-dom";

export const AllRoutes = () => {
  <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<NavPage />}></Route>
    </Routes>
  </BrowserRouter>;
};
