"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { API_ROUTES } from "@/utils/routes";
import { apiClient, axiosInstance } from "@/lib/apiClient";

export enum UserRole {
  SuperAdmin = "SuperAdmin",
  Company = "Company",
  Ship = "Ship",
}

export interface AppUser {
  _id: string;
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  assignedShipImos: string[];
}

interface AuthContextType {
  user: AppUser | null;
  login: (creds: { email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);

  // ✅ Check session on mount
  useEffect(() => {
    apiClient<{ user: AppUser }>(API_ROUTES.auth.me)
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  // ✅ Login and store token
  const login = async (creds: { email: string; password: string }) => {
    const data = await apiClient<{ token: string }>(API_ROUTES.auth.login, {
      method: "POST",
      data: creds,
    });

    localStorage.setItem("token", data.token);
    const userData = await apiClient<{ user: AppUser }>(API_ROUTES.auth.me);
    setUser(userData.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
