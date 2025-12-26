"use client";

import { authService, LoginCredentials, User } from "@/services/auth";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkAuth = async () => {
    const token = Cookies.get("token");
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const userData = await authService.getProfile();
      setUser(userData);
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      Cookies.remove("token");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const data = await authService.login(credentials);
      if (data.token) {
        Cookies.set("token", data.token, { expires: 1 }); // 1 day
        // Optionally set user immediately if returned, or fetch profile
        if (data.user) {
          setUser(data.user);
        } else {
          await checkAuth();
        }
        router.push("/admin");
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
