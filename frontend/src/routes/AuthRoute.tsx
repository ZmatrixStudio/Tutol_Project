import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function AuthRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { accessToken, loading } = useAuth();

  if (loading) {
    return null; 
  }

  if (accessToken) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}