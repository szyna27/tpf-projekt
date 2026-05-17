import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { whoami, emailLogout, emailLogin } from "../services/api";

type AuthUser = { id: number; email: string; name?: string } | null;

type AuthCtx = {
  user: AuthUser;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (redirectTo?: string) => void;
  logout: (to?: string) => Promise<void>;
};

const AuthContext = createContext<AuthCtx | null>(null);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const currentUser = await whoami();
        if (!cancelled) setUser(currentUser);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const loginWithGoogle = (redirectTo?: string) => {
     localStorage.setItem("isAuthenticated", "true");
     navigate(redirectTo || "/stats");
  };

  const login = async (email: string, pass: string) => {
     const data = await emailLogin(email, pass);
     setUser(data);
  };

  const logout = async (to: string = "/login") => {
    await emailLogout();
    setUser(null);
    navigate(to);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

