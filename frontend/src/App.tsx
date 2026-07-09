import { lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import HomePage from "./pages/Main/Home/Home";
import WalletPage from "./pages/Main/Wallet/Wallet";
import ProtectedRoute from "./routes/ProtectedRoute";
import IndexAuthentication from "./pages/Authentication/IndexAuthentication";
import AuthRoute from "./routes/AuthRoute";

const NotFound = lazy(() => import("./pages/NotFound/NotFound"));

export default function App() {
  return (
    <Router>
        <Routes>
          <Route path="/authentication" element={<AuthRoute><IndexAuthentication/></AuthRoute>} />
          
          <Route path="*" element={<NotFound />} />
          
          <Route element={<ProtectedRoute> <MainLayout/> </ProtectedRoute>}>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/wallet" element={<WalletPage />} />
          </Route>
        </Routes>
    </Router>
  );
}