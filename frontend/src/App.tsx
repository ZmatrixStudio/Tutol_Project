import { lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const LoginPage = lazy(() => import("./pages/Login/Login"));
const RegisterPage = lazy(() => import("./pages/Register/Register"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword/forgot-password"))

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
    </Router>
  );
}

export default App;