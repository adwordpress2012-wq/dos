import { useState, useEffect } from "react";
import { useLocation } from "wouter";

const API = import.meta.env.VITE_API_BASE_URL ?? "/api";

export interface ClientAgency {
  id: number;
  name: string;
  contactEmail: string;
  subscriptionStatus: string;
  clerkOrgId: string;
}

export interface ClientStaff {
  id: number;
  name: string;
  role: string;
  status: string;
}

export function useClientAuth() {
  const [agency, setAgency] = useState<ClientAgency | null>(null);
  const [staff, setStaff] = useState<ClientStaff | null>(null);
  const [userType, setUserType] = useState<"agency" | "staff" | null>(null);
  const [loading, setLoading] = useState(true);
  const [, navigate] = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("clientToken");
    if (!token) {
      navigate("/dashboard/login");
      setLoading(false);
      return;
    }

    fetch(`${API}/client/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        if (data.ok) {
          setAgency(data.agency);
          setUserType(data.userType ?? "agency");
          setStaff(data.staff ?? null);
        } else {
          localStorage.removeItem("clientToken");
          navigate("/dashboard/login");
        }
      })
      .catch(() => {
        localStorage.removeItem("clientToken");
        navigate("/dashboard/login");
      })
      .finally(() => setLoading(false));
  }, []);

  function signOut() {
    localStorage.removeItem("clientToken");
    navigate("/dashboard/login");
  }

  const isAgencyOwner = userType === "agency";

  return { agency, staff, userType, isAgencyOwner, loading, signOut };
}
