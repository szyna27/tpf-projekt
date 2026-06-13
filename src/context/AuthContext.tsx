import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { whoami, emailLogout, emailLogin, googleLogin, type AppUser } from "../services/api";
import { firebaseAuth } from "../services/firebase";

type AuthUser = AppUser | null;

type AuthCtx = {
  user: AuthUser;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (redirectTo?: string) => Promise<void>;
  logout: (to?: string) => Promise<void>;
};

const AuthContext = createContext<AuthCtx | null>(null);
// eslint-disable-next-line react-refresh/only-export-components
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
    const unsubscribe = onAuthStateChanged(firebaseAuth, async () => {
      try {
        const currentUser = await whoami();
        if (!cancelled) setUser(currentUser);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const loginWithGoogle = async (redirectTo?: string) => {
     const data = await googleLogin();
     setUser(data);
     navigate(redirectTo || "/plans");
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
