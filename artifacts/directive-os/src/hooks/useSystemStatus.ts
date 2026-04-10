import { useQuery } from "@tanstack/react-query";

interface SystemStatus {
  mode: "SIMULATION" | "LIVE";
  status: string;
  label: string;
  vaultReBridge: string;
  aiEngine: string;
  voiceEngine: string;
  infrastructure: string;
  databaseMode: string;
  mockVaultSummary: {
    totalListings: number;
    activeListings: number;
    forSale: number;
    forRent: number;
    suburbs: string[];
    agents: string[];
    lastSynced: string;
    source: string;
  } | null;
  timestamp: string;
}

export function useSystemStatus() {
  return useQuery<SystemStatus>({
    queryKey: ["system-status"],
    queryFn: async () => {
      const base = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";
      const res = await fetch(`${base}/api/system/status`);
      if (!res.ok) throw new Error("Failed to fetch system status");
      return res.json();
    },
    staleTime: 60_000,
    retry: 1,
  });
}
