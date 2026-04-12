import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? "https://directiveos.com.au/api";

export interface AgencyInfo {
  id: number;
  name: string;
  contactPhone?: string | null;
  subscriptionStatus: string;
  aiMinutesUsed: number;
  aiMinutesIncluded: number;
}

interface AuthState {
  token: string | null;
  agency: AgencyInfo | null;
  loading: boolean;
  login: (token: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  token: null,
  agency: null,
  loading: true,
  login: async () => ({ ok: false }),
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [agency, setAgency] = useState<AgencyInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem("mobile_token").then(async (stored) => {
      if (stored) {
        const result = await verifyToken(stored);
        if (result.ok && result.agency) {
          setToken(stored);
          setAgency(result.agency);
        } else {
          await AsyncStorage.removeItem("mobile_token");
        }
      }
      setLoading(false);
    });
  }, []);

  async function verifyToken(t: string): Promise<{ ok: boolean; agency?: AgencyInfo }> {
    try {
      const res = await fetch(`${API_BASE}/mobile/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: t }),
      });
      if (!res.ok) return { ok: false };
      const data = await res.json();
      return { ok: true, agency: data.agency };
    } catch {
      return { ok: false };
    }
  }

  async function login(t: string): Promise<{ ok: boolean; error?: string }> {
    const result = await verifyToken(t);
    if (result.ok && result.agency) {
      await AsyncStorage.setItem("mobile_token", t);
      setToken(t);
      setAgency(result.agency);
      return { ok: true };
    }
    return { ok: false, error: "Invalid access token. Check your Directive OS dashboard." };
  }

  async function logout() {
    await AsyncStorage.removeItem("mobile_token");
    setToken(null);
    setAgency(null);
  }

  return (
    <AuthContext.Provider value={{ token, agency, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export { API_BASE };
