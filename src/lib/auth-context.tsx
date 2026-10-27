"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { UserProfile, UserRole, LoginRequest, RegisterRequest } from "@/types/api";
import {
  api,
  getStoredAccessToken,
  getStoredRefreshToken,
  storeTokens,
  clearStoredTokens,
} from "./api-client";

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<UserProfile>;
  register: (data: RegisterRequest) => Promise<UserProfile>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  isStudent: boolean;
  isClubAdmin: boolean;
  isFaculty: boolean;
  isSuperAdmin: boolean;
  canManageEvents: boolean;
  canModerate: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCurrentUser = useCallback(async () => {
    const token = getStoredAccessToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await api.auth.me();
      if (response && response.data) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch {
      // If fetching fails with stored token, token might be invalid
      clearStoredTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = async (credentials: LoginRequest): Promise<UserProfile> => {
    setLoading(true);
    try {
      const response = await api.auth.login(credentials);
      const authData = response.data;
      storeTokens(authData.accessToken, authData.refreshToken);
      setUser(authData.user);
      return authData.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterRequest): Promise<UserProfile> => {
    setLoading(true);
    try {
      const response = await api.auth.register(data);
      // Automatically log the user in after registration
      const loginRes = await api.auth.login({
        email: data.email,
        password: data.password,
      });
      storeTokens(loginRes.data.accessToken, loginRes.data.refreshToken);
      setUser(loginRes.data.user);
      return loginRes.data.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const refreshToken = getStoredRefreshToken();
    try {
      if (refreshToken) {
        await api.auth.logout({ refreshToken });
      }
    } catch {
      // Ignore backend logout error, clear local state regardless
    } finally {
      clearStoredTokens();
      setUser(null);
    }
  };

  const refreshProfile = async () => {
    try {
      const response = await api.auth.me();
      if (response?.data) {
        setUser(response.data);
      }
    } catch {
      // silent
    }
  };

  const hasRole = useCallback(
    (role: UserRole) => {
      return !!user?.roles?.includes(role);
    },
    [user]
  );

  const isStudent = hasRole("STUDENT");
  const isClubAdmin = hasRole("CLUB_ADMIN");
  const isFaculty = hasRole("FACULTY_COORDINATOR");
  const isSuperAdmin = hasRole("SUPER_ADMIN");
  const canManageEvents = isClubAdmin || isFaculty || isSuperAdmin;
  const canModerate = isFaculty || isSuperAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshProfile,
        hasRole,
        isStudent,
        isClubAdmin,
        isFaculty,
        isSuperAdmin,
        canManageEvents,
        canModerate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
