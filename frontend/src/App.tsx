import { lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import HomePage from "./pages/Main/Home";

const LoginPage = lazy(() => import("./pages/Login/Login"));
const RegisterPage = lazy(() => import("./pages/Register/Register"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword/forgot-password"))

import "./index.css";

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<NotFound />} />

          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<HomePage />} />
          </Route>
        </Routes>
    </Router>
  );
}

export default App;