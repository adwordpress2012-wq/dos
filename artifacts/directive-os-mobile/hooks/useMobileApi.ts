import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth, API_BASE } from "./useAuth";

function useMobileHeaders() {
  const { token } = useAuth();
  return { "Content-Type": "application/json", "x-mobile-token": token ?? "" };
}

export function useDashboard() {
  const { token } = useAuth();
  const headers = useMobileHeaders();
  return useQuery({
    queryKey: ["mobile-dashboard", token],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/mobile/dashboard`, { headers });
      if (!res.ok) throw new Error("Failed to load dashboard");
      return res.json() as Promise<{
        agencyName: string;
        leadsThisMonth: number;
        hotLeads: number;
        aiCallsHandled: number;
        newLastNight: number;
        aiMinutesUsed: number;
        aiMinutesIncluded: number;
        estimatedValue: string | null;
      }>;
    },
    enabled: !!token,
    refetchInterval: 60_000,
  });
}

export interface Lead {
  id: number;
  name: string;
  leadType: string;
  status: string;
  channel: string;
  hotLead: boolean;
  phone?: string | null;
  email?: string | null;
  notes?: string | null;
  createdAt: string;
}

export function useLeads() {
  const { token } = useAuth();
  const headers = useMobileHeaders();
  return useQuery({
    queryKey: ["mobile-leads", token],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/mobile/leads`, { headers });
      if (!res.ok) throw new Error("Failed to load leads");
      return res.json() as Promise<Lead[]>;
    },
    enabled: !!token,
    refetchInterval: 30_000,
  });
}

export function useUpdateLeadStatus() {
  const qc = useQueryClient();
  const { token } = useAuth();
  const headers = useMobileHeaders();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await fetch(`${API_BASE}/mobile/leads/${id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Update failed");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mobile-leads", token] });
      qc.invalidateQueries({ queryKey: ["mobile-dashboard", token] });
    },
  });
}

export interface Transcript {
  id: number;
  channel: string;
  callerName?: string | null;
  summary?: string | null;
  duration?: number | null;
  createdAt: string;
  leadType?: string | null;
}

export function useTranscripts() {
  const { token } = useAuth();
  const headers = useMobileHeaders();
  return useQuery({
    queryKey: ["mobile-transcripts", token],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/mobile/transcripts`, { headers });
      if (!res.ok) throw new Error("Failed to load transcripts");
      return res.json() as Promise<Transcript[]>;
    },
    enabled: !!token,
    refetchInterval: 30_000,
  });
}

export interface TranscriptDetail {
  transcript: Transcript;
  messages: { id: number; role: string; content: string; createdAt: string }[];
}

export function useTranscriptDetail(id: number | null) {
  const { token } = useAuth();
  const headers = useMobileHeaders();
  return useQuery({
    queryKey: ["mobile-transcript-detail", id, token],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/mobile/transcripts/${id}/messages`, { headers });
      if (!res.ok) throw new Error("Failed to load transcript");
      return res.json() as Promise<TranscriptDetail>;
    },
    enabled: !!token && id !== null,
  });
}

export interface ActivityItem {
  id: string;
  type: string;
  description: string;
  detail?: string;
  time: string;
  channel: string;
}

export function useActivity() {
  const { token } = useAuth();
  const headers = useMobileHeaders();
  return useQuery({
    queryKey: ["mobile-activity", token],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/mobile/activity`, { headers });
      if (!res.ok) throw new Error("Failed to load activity");
      return res.json() as Promise<ActivityItem[]>;
    },
    enabled: !!token,
    refetchInterval: 30_000,
  });
}
