"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  isAdmin: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  
  useEffect(() => {
    let mounted = true;
    const probe = async () => {
      try {
        const res = await axios.get("/api/auth/me", { withCredentials: true }); 
        if (!mounted) return;
        setLoggedIn(true);
        setIsAdmin(res.data?.isAdmin || false);
      } catch {
        if (!mounted) return;
        setLoggedIn(false);
        setIsAdmin(false);
      }
    };
    probe();
    return () => { mounted = false; };
  }, []);

  const login = () => setLoggedIn(true);

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoggedIn(false);
      setIsAdmin(false);
      router.push("/auth/login");
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
