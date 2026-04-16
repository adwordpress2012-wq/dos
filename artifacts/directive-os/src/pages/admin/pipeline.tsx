import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Plus, Phone, Mail, Trash2, Edit3, Check, X, GitBranch } from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL ?? "/api";
const secret = () => localStorage.getItem("adminSecret") || "";

const STAGES = [
  { id: "lead", label: "LEAD", color: "#6366f1" },
  { id: "called", label: "CONTACTED", color: "#f59e0b" },
  { id: "proposal", label: "PROPOSAL SENT", color: "#06b6d4" },
  { id: "won", label: "WON", color: "#10b981" },
  { id: "lost", label: "LOST", color: "#ef4444" },
];

function AddProspectForm({ onAdd }: { onAdd: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ agencyName: "", contactName: "", contactEmail: "", contactPhone: "", stage: "lead", source: "direct", notes: "", estimatedValue: "" });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch(`${API}/admin/pipeline`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-secret": secret() },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setOpen(false);
    setForm({ agencyName: "", contactName: "", contactEmail: "", contactPhone: "", stage: "lead", source: "direct", notes: "", estimatedValue: "" });
    onAdd();
  }

  if (!open) return (
    <button onClick={() => setOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold tracking-wider" style={{ background: "rgba(0,209,178,0.1)", border: "1px solid rgba(0,209,178,0.3)", color: "#00d1b2" }}>
      <Plus className="w-3.5 h-3.5" /> ADD PROSPECT
    </button>
  );

  return (
    <form onSubmit={handleSubmit} className="rounded-xl p-4 space-y-3 mb-4" style={{ background: "rgba(5,14,26,0.95)", border: "1px solid rgba(0,209,178,0.25)" }}>
      <div className="text-xs font-mono font-bold tracking-wider" style={{ color: "#00d1b2" }}>NEW PROSPECT</div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] font-mono" style={{ color: "rgba(0,209,178,0.6)" }}>AGENCY NAME *</label>
          <input value={form.agencyName} onChange={e => setForm(f => ({ ...f, agencyName: e.target.value }))} className="w-full mt-1 px-3 py-2 text-xs rounded-lg" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(0,209,178,0.2)", color: "white" }} required />
        </div>
        <div>
          <label className="text-[10px] font-mono" style={{ color: "rgba(0,209,178,0.6)" }}>CONTACT NAME *</label>
          <input value={form.contactName} onChange={e => setForm(f => ({ ...f, contactName: e.target.value }))} className="w-full mt-1 px-3 py-2 text-xs rounded-lg" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(0,209,178,0.2)", color: "white" }} required />
        </div>
        <div>
          <label className="text-[10px] font-mono" style={{ color: "rgba(0,209,178,0.6)" }}>EMAIL</label>
          <input type="email" value={form.contactEmail} onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))} className="w-full mt-1 px-3 py-2 text-xs rounded-lg" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(0,209,178,0.2)", color: "white" }} />
        </div>
        <div>
          <label className="text-[10px] font-mono" style={{ color: "rgba(0,209,178,0.6)" }}>PHONE</label>
          <input value={form.contactPhone} onChange={e => setForm(f => ({ ...f, contactPhone: e.target.value }))} className="w-full mt-1 px-3 py-2 text-xs rounded-lg" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(0,209,178,0.2)", color: "white" }} />
        </div>
        <div>
          <label className="text-[10px] font-mono" style={{ color: "rgba(0,209,178,0.6)" }}>STAGE</label>
          <select value={form.stage} onChange={e => setForm(f => ({ ...f, stage: e.target.value }))} className="w-full mt-1 px-3 py-2 text-xs rounded-lg" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(0,209,178,0.2)", color: "white" }}>
            {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-mono" style={{ color: "rgba(0,209,178,0.6)" }}>EST. VALUE (AUD/yr)</label>
          <input type="number" value={form.estimatedValue} onChange={e => setForm(f => ({ ...f, estimatedValue: e.target.value }))} placeholder="3588" className="w-full mt-1 px-3 py-2 text-xs rounded-lg font-mono" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(0,209,178,0.2)", color: "white" }} />
        </div>
      </div>
      <div>
        <label className="text-[10px] font-mono" style={{ color: "rgba(0,209,178,0.6)" }}>NOTES</label>
        <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="w-full mt-1 px-3 py-2 text-xs rounded-lg resize-none" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(0,209,178,0.2)", color: "white" }} />
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={saving} className="px-4 py-2 text-xs font-bold rounded-lg" style={{ background: "#00d1b2", color: "#040912" }}>{saving ? "SAVING..." : "ADD TO PIPELINE"}</button>
        <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-xs font-bold rounded-lg" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)" }}>CANCEL</button>
      </div>
    </form>
  );
}

function ProspectCard({ p, onUpdate, onDelete }: { p: any; onUpdate: () => void; onDelete: (id: number) => void }) {
  const stage = STAGES.find(s => s.id === p.stage) || STAGES[0];
  const [editing, setEditing] = useState(false);
  const [newStage, setNewStage] = useState(p.stage);
  const [newNotes, setNewNotes] = useState(p.notes || "");

  async function saveEdit() {
    await fetch(`${API}/admin/pipeline/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-secret": secret() },
      body: JSON.stringify({ stage: newStage, notes: newNotes }),
    });
    setEditing(false);
    onUpdate();
  }

  return (
    <div className="rounded-xl p-4" style={{ background: "rgba(5,14,26,0.9)", border: `1px solid ${stage.color}20` }}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="text-xs font-bold text-white">{p.agencyName}</div>
          <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.5)" }}>{p.contactName}</div>
        </div>
        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded" style={{ background: `${stage.color}15`, color: stage.color, border: `1px solid ${stage.color}30` }}>
          {stage.label}
        </span>
      </div>

      {p.contactEmail && (
        <div className="flex items-center gap-1.5 mb-1">
          <Mail className="w-3 h-3" style={{ color: "rgba(0,209,178,0.4)" }} />
          <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>{p.contactEmail}</span>
        </div>
      )}
      {p.contactPhone && (
        <div className="flex items-center gap-1.5 mb-2">
          <Phone className="w-3 h-3" style={{ color: "rgba(0,209,178,0.4)" }} />
          <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>{p.contactPhone}</span>
        </div>
      )}

      {editing ? (
        <div className="space-y-2 mt-2">
          <select value={newStage} onChange={e => setNewStage(e.target.value)} className="w-full px-2 py-1.5 text-xs rounded" style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(0,209,178,0.2)", color: "white" }}>
            {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
          <textarea value={newNotes} onChange={e => setNewNotes(e.target.value)} rows={2} className="w-full px-2 py-1.5 text-xs rounded resize-none" style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(0,209,178,0.2)", color: "white" }} placeholder="Notes..." />
          <div className="flex gap-1.5">
            <button onClick={saveEdit} className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold rounded" style={{ background: "#00d1b2", color: "#040912" }}><Check className="w-3 h-3" />SAVE</button>
            <button onClick={() => setEditing(false)} className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold rounded" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)" }}><X className="w-3 h-3" />CANCEL</button>
          </div>
        </div>
      ) : (
        <>
          {p.notes && <div className="text-[10px] mt-2 p-2 rounded" style={{ background: "rgba(0,0,0,0.3)", color: "rgba(255,255,255,0.5)" }}>{p.notes}</div>}
          {p.estimatedValue > 0 && (
            <div className="text-[10px] font-mono mt-2" style={{ color: "#10b981" }}>
              Est. ${(p.estimatedValue / 100).toLocaleString()} AUD/yr
            </div>
          )}
          <div className="flex items-center gap-1.5 mt-3">
            <button onClick={() => setEditing(true)} className="flex items-center gap-1 px-2 py-1 text-[10px] rounded hover:bg-white/5" style={{ color: "rgba(0,209,178,0.6)", border: "1px solid rgba(0,209,178,0.15)" }}>
              <Edit3 className="w-2.5 h-2.5" />EDIT
            </button>
            <button onClick={() => onDelete(p.id)} className="flex items-center gap-1 px-2 py-1 text-[10px] rounded hover:bg-red-500/10" style={{ color: "rgba(239,68,68,0.5)", border: "1px solid rgba(239,68,68,0.15)" }}>
              <Trash2 className="w-2.5 h-2.5" />REMOVE
            </button>
            <span className="ml-auto text-[9px] font-mono" style={{ color: "rgba(255,255,255,0.2)" }}>
              {new Date(p.createdAt).toLocaleDateString("en-AU")}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

export default function AdminPipeline() {
  const [prospects, setProspects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch(`${API}/admin/pipeline`, { headers: { "x-admin-secret": secret() } });
    setProspects(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function deleteProspect(id: number) {
    await fetch(`${API}/admin/pipeline/${id}`, { method: "DELETE", headers: { "x-admin-secret": secret() } });
    load();
  }

  const wonCount = prospects.filter(p => p.stage === "won").length;
  const totalCount = prospects.filter(p => p.stage !== "lead").length;
  const conversionRate = totalCount > 0 ? Math.round((wonCount / totalCount) * 100) : 0;

  return (
    <AdminLayout title="STRATEGIC COMMAND">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-mono font-bold tracking-wider mb-1" style={{ color: "rgba(0,209,178,0.6)" }}>PROSPECT INTELLIGENCE · CRM</div>
            <div className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              {prospects.length} tracked · <span className="text-white font-bold">{conversionRate}%</span> conversion rate
            </div>
          </div>
          <AddProspectForm onAdd={load} />
        </div>

        {loading ? (
          <div className="text-center py-12 text-xs font-mono" style={{ color: "rgba(0,209,178,0.4)" }}>SCANNING PIPELINE...</div>
        ) : prospects.length === 0 ? (
          <div className="text-center py-16">
            <GitBranch className="w-10 h-10 mx-auto mb-3" style={{ color: "rgba(0,209,178,0.2)" }} />
            <div className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>NO PROSPECTS IN PIPELINE</div>
            <div className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.2)" }}>Add your first prospect to begin tracking</div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {STAGES.map(stage => {
              const stageProspects = prospects.filter(p => p.stage === stage.id);
              return (
                <div key={stage.id}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full" style={{ background: stage.color }} />
                    <span className="text-[10px] font-mono font-bold tracking-wider" style={{ color: stage.color }}>{stage.label}</span>
                    <span className="text-[10px] font-mono ml-auto" style={{ color: "rgba(255,255,255,0.3)" }}>{stageProspects.length}</span>
                  </div>
                  <div className="space-y-2">
                    {stageProspects.map(p => (
                      <ProspectCard key={p.id} p={p} onUpdate={load} onDelete={deleteProspect} />
                    ))}
                    {stageProspects.length === 0 && (
                      <div className="text-center py-6 rounded-xl text-[10px] font-mono" style={{ border: `1px dashed ${stage.color}20`, color: "rgba(255,255,255,0.2)" }}>EMPTY</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
