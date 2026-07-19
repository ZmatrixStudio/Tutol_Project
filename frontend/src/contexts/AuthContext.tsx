import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import LoadingScreen from "../components/common/Loading";
import api from "../api/axios";

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthOnRefresh = async () => {
      try {
        const res = await api.post("/api/v1/auth/session-renew", {}, {withCredentials: true});
        if (res.status === 200){
          setAccessToken(res.data.accessToken);
        }
        // await new Promise(resolve => setTimeout(resolve, 100000));
      } catch (error) {
        console.error("Xảy ra lỗi trong quá trình refresh token:", error);
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthOnRefresh();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};