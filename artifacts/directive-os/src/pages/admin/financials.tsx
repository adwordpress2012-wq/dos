import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Download, Plus, Trash2, DollarSign, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL ?? "/api";
const secret = () => localStorage.getItem("adminSecret") || "";

function fmt(cents: number) {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", minimumFractionDigits: 0 }).format(cents / 100);
}

const EXPENSE_CATEGORIES = ["twilio", "openai", "hosting", "stripe", "marketing", "labour", "tools", "other"];

function AddExpenseForm({ onAdd }: { onAdd: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ category: "other", description: "", amount: "", expenseDate: new Date().toISOString().slice(0, 10), notes: "" });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch(`${API}/admin/expenses`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-secret": secret() },
      body: JSON.stringify({ ...form, amountCents: Math.round(parseFloat(form.amount) * 100) }),
    });
    setSaving(false);
    setOpen(false);
    setForm({ category: "other", description: "", amount: "", expenseDate: new Date().toISOString().slice(0, 10), notes: "" });
    onAdd();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold tracking-wider transition-all hover:opacity-80"
        style={{ background: "rgba(0,209,178,0.1)", border: "1px solid rgba(0,209,178,0.3)", color: "#00d1b2" }}
      >
        <Plus className="w-3.5 h-3.5" /> LOG EXPENSE
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl p-4 space-y-3" style={{ background: "rgba(5,14,26,0.95)", border: "1px solid rgba(0,209,178,0.25)" }}>
      <div className="text-xs font-mono font-bold tracking-wider mb-2" style={{ color: "#00d1b2" }}>NEW EXPENSE ENTRY</div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] font-mono" style={{ color: "rgba(0,209,178,0.6)" }}>CATEGORY</label>
          <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full mt-1 px-3 py-2 text-xs rounded-lg" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(0,209,178,0.2)", color: "white" }}>
            {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-mono" style={{ color: "rgba(0,209,178,0.6)" }}>DATE</label>
          <input type="date" value={form.expenseDate} onChange={e => setForm(f => ({ ...f, expenseDate: e.target.value }))} className="w-full mt-1 px-3 py-2 text-xs rounded-lg" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(0,209,178,0.2)", color: "white" }} />
        </div>
      </div>
      <div>
        <label className="text-[10px] font-mono" style={{ color: "rgba(0,209,178,0.6)" }}>DESCRIPTION</label>
        <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="e.g. Twilio phone number monthly fee" className="w-full mt-1 px-3 py-2 text-xs rounded-lg" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(0,209,178,0.2)", color: "white" }} required />
      </div>
      <div>
        <label className="text-[10px] font-mono" style={{ color: "rgba(0,209,178,0.6)" }}>AMOUNT (AUD)</label>
        <input type="number" step="0.01" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="0.00" className="w-full mt-1 px-3 py-2 text-xs rounded-lg font-mono" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(0,209,178,0.2)", color: "white" }} required />
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={saving} className="px-4 py-2 text-xs font-bold rounded-lg" style={{ background: "#00d1b2", color: "#040912" }}>
          {saving ? "SAVING..." : "LOG EXPENSE"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-xs font-bold rounded-lg" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)" }}>
          CANCEL
        </button>
      </div>
    </form>
  );
}

export default function AdminFinancials() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch(`${API}/admin/financials`, { headers: { "x-admin-secret": secret() } });
    setData(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function deleteExpense(id: number) {
    await fetch(`${API}/admin/expenses/${id}`, { method: "DELETE", headers: { "x-admin-secret": secret() } });
    load();
  }

  const profit = data?.netProfit || 0;
  const profitPositive = profit >= 0;

  return (
    <AdminLayout title="FINANCIAL OPS">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono font-bold tracking-wider" style={{ color: "rgba(0,209,178,0.6)" }}>PROFIT & LOSS · FINANCIAL TELEMETRY</div>
          <button
            onClick={() => window.open(`${API}/admin/financials/export-csv`, "_blank")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold tracking-wider"
            style={{ background: "rgba(0,209,178,0.1)", border: "1px solid rgba(0,209,178,0.3)", color: "#00d1b2" }}
          >
            <Download className="w-3.5 h-3.5" /> EXPORT CSV
          </button>
        </div>

        {/* P&L Summary pods */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "MONTHLY REVENUE", value: fmt(data?.mrr || 0), icon: DollarSign, color: "#00d1b2", sub: "Active subscriptions" },
            { label: "SETUP FEES", value: fmt(data?.setupRevenue || 0), icon: TrendingUp, color: "#6366f1", sub: "One-time onboarding" },
            { label: "TOTAL EXPENSES", value: fmt(data?.totalExpenses || 0), icon: TrendingDown, color: "#f59e0b", sub: "All logged costs" },
            { label: "NET PROFIT", value: fmt(profit), icon: profitPositive ? TrendingUp : AlertTriangle, color: profitPositive ? "#10b981" : "#ef4444", sub: profitPositive ? "In the black" : "NEGATIVE — review costs" },
          ].map(p => {
            const Icon = p.icon;
            return (
              <div key={p.label} className="rounded-xl p-4" style={{ background: "rgba(5,14,26,0.9)", border: `1px solid ${p.color}20` }}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-3.5 h-3.5" style={{ color: p.color }} />
                  <span className="text-[10px] font-mono font-bold tracking-wider" style={{ color: `${p.color}80` }}>{p.label}</span>
                </div>
                <div className="text-xl font-bold font-mono" style={{ color: p.label === "NET PROFIT" ? p.color : "white" }}>{p.value}</div>
                <div className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>{p.sub}</div>
              </div>
            );
          })}
        </div>

        {/* Revenue chart */}
        {data?.months?.length > 0 && (
          <div className="rounded-xl p-5" style={{ background: "rgba(5,14,26,0.9)", border: "1px solid rgba(0,209,178,0.12)" }}>
            <div className="text-xs font-mono font-bold tracking-wider mb-4" style={{ color: "#00d1b2" }}>MONTHLY REVENUE VS EXPENSES</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.months} barCategoryGap="30%">
                <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={v => `$${(v / 100).toFixed(0)}`} tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#040912", border: "1px solid rgba(0,209,178,0.3)", borderRadius: 8, fontSize: 11 }}
                  formatter={(v: number) => [fmt(v), ""]}
                />
                <Bar dataKey="revenue" fill="#00d1b2" radius={[3, 3, 0, 0]} opacity={0.8} name="Revenue" />
                <Bar dataKey="expenses" fill="#ef4444" radius={[3, 3, 0, 0]} opacity={0.6} name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Add expense + list */}
        <div className="rounded-xl p-5 space-y-4" style={{ background: "rgba(5,14,26,0.9)", border: "1px solid rgba(0,209,178,0.12)" }}>
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono font-bold tracking-wider" style={{ color: "#00d1b2" }}>EXPENSE LOG</div>
            <AddExpenseForm onAdd={load} />
          </div>

          {!loading && data?.expenses?.length === 0 && (
            <div className="text-center py-8 text-xs font-mono" style={{ color: "rgba(255,255,255,0.2)" }}>
              NO EXPENSES LOGGED — CLICK "LOG EXPENSE" TO ADD COSTS
            </div>
          )}

          {data?.expenses?.map((e: any) => (
            <div key={e.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="text-[10px] font-mono px-1.5 py-0.5 rounded uppercase" style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)" }}>
                {e.category}
              </div>
              <div className="flex-1">
                <div className="text-xs text-white">{e.description}</div>
                <div className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>{e.expenseDate}</div>
              </div>
              <div className="text-sm font-mono font-bold" style={{ color: "#ef4444" }}>−{fmt(e.amountCents)}</div>
              <button onClick={() => deleteExpense(e.id)} className="p-1 rounded hover:bg-red-500/10 transition-colors">
                <Trash2 className="w-3.5 h-3.5" style={{ color: "rgba(239,68,68,0.5)" }} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
