import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useGetTranscripts, useGetTranscript } from "@workspace/api-client-react";
import { Phone, MessageSquare, Clock, ChevronRight, X, Mic } from "lucide-react";

function ChannelBadge({ channel }: { channel: string }) {
  if (channel === "voice") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded font-medium">
        <Phone className="w-3 h-3" /> Voice
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-medium">
      <MessageSquare className="w-3 h-3" /> Chat
    </span>
  );
}

function TranscriptDetail({ id, onClose }: { id: number; onClose: () => void }) {
  const { data: transcript, isLoading } = useGetTranscript(id);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h3 className="font-semibold text-foreground">{transcript?.leadName || "Unknown"}</h3>
            {transcript && <div className="text-xs text-muted-foreground mt-0.5">
              {new Date(transcript.createdAt).toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              {transcript.duration && ` • ${transcript.duration}s`}
            </div>}
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        {transcript?.summary && (
          <div className="px-6 py-3 bg-muted/30 border-b border-border">
            <div className="text-xs text-muted-foreground mb-1">Summary</div>
            <p className="text-sm text-foreground">{transcript.summary}</p>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-muted rounded-lg animate-pulse" />)}
            </div>
          ) : !transcript?.messages?.length ? (
            <div className="text-center py-8 text-muted-foreground text-sm">No messages recorded for this transcript.</div>
          ) : (
            transcript.messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-primary/10 border border-primary/20 text-foreground"
                    : "bg-muted text-foreground"
                }`}>
                  <div className={`text-xs font-medium mb-1 ${msg.role === "user" ? "text-primary" : "text-muted-foreground"}`}>
                    {msg.role === "user" ? "Caller" : "Station Intelligence (AI)"}
                  </div>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function Transcripts() {
  const [selected, setSelected] = useState<number | null>(null);
  const [channelFilter, setChannelFilter] = useState<"all" | "voice" | "chat">("all");
  const { data: transcripts, isLoading } = useGetTranscripts();

  const filtered = transcripts?.filter(t => channelFilter === "all" || t.channel === channelFilter) ?? [];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Communication Logs</h1>
        <p className="text-muted-foreground text-sm mt-1">All voice calls and chat sessions handled by Station Intelligence</p>
      </div>

      <div className="flex gap-2 mb-6">
        {(["all", "voice", "chat"] as const).map(ch => (
          <button
            key={ch}
            onClick={() => setChannelFilter(ch)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              channelFilter === ch
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
            }`}
          >
            {ch === "all" ? "All Channels" : ch === "voice" ? "Voice Calls" : "Chat Sessions"}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Mic className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <div className="text-muted-foreground">No transcripts yet. Station Intelligence is ready to handle calls and chats.</div>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map(t => (
              <button
                key={t.id}
                onClick={() => setSelected(t.id)}
                className="w-full flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-colors text-left"
              >
                <div className="flex-shrink-0">
                  {t.channel === "voice" ? <Phone className="w-4 h-4 text-purple-400" /> : <MessageSquare className="w-4 h-4 text-emerald-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{t.leadName || "Unknown"}</span>
                    <ChannelBadge channel={t.channel} />
                  </div>
                  {t.summary && <p className="text-xs text-muted-foreground truncate mt-0.5">{t.summary}</p>}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {t.duration && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {Math.floor(t.duration / 60)}:{String(t.duration % 60).padStart(2, "0")}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    {new Date(t.createdAt).toLocaleDateString("en-AU", { day: "numeric", month: "short" })}
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selected !== null && <TranscriptDetail id={selected} onClose={() => setSelected(null)} />}
    </DashboardLayout>
  );
}
