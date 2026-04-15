import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useGetMyAgency, useUpdateMyAgency, getGetMyAgencyQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useClientAuth } from "@/hooks/useClientAuth";
import { Settings, Save, Bot, Phone, Globe, Smartphone, Eye, EyeOff, Copy, Check } from "lucide-react";

function MobileTokenCard({ token }: { token?: string }) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = () => {
    if (!token) return;
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!token) return <p className="text-sm text-muted-foreground">Token not yet generated. Contact support.</p>;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2.5">
        <code className="flex-1 text-xs font-mono text-foreground truncate">
          {visible ? token : "•".repeat(32)}
        </code>
        <button onClick={() => setVisible(v => !v)} className="text-muted-foreground hover:text-foreground transition-colors p-1">
          {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
        <button onClick={copy} className="text-muted-foreground hover:text-primary transition-colors p-1">
          {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
        <li>Download <strong className="text-foreground">Directive OS Command Bridge</strong> from the App Store or Google Play</li>
        <li>Tap <strong className="text-foreground">Sign In</strong> and paste this token</li>
        <li>Share with your agents — each person uses the same token</li>
      </ol>
    </div>
  );
}

export default function SettingsPage() {
  const { isAgencyOwner, loading: authLoading } = useClientAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!authLoading && !isAgencyOwner) navigate("/dashboard");
  }, [authLoading, isAgencyOwner]);

  const queryClient = useQueryClient();
  const { data: agency, isLoading } = useGetMyAgency();
  const updateAgency = useUpdateMyAgency({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetMyAgencyQueryKey() }),
    },
  });

  const [form, setForm] = useState({ name: "", contactEmail: "", contactPhone: "", address: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (agency) {
      setForm({
        name: agency.name ?? "",
        contactEmail: agency.contactEmail ?? "",
        contactPhone: agency.contactPhone ?? "",
        address: agency.address ?? "",
      });
    }
  }, [agency]);

  const save = async () => {
    await updateAgency.mutateAsync({ data: form });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Communication Protocols</h1>
        <p className="text-muted-foreground text-sm mt-1">Agency configuration and AI receptionist settings</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Agency Profile */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Settings className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-foreground">Agency Profile</h3>
          </div>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-muted rounded-lg animate-pulse" />)}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Agency Name</label>
                <input
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Contact Email</label>
                <input
                  type="email"
                  value={form.contactEmail}
                  onChange={e => setForm(p => ({ ...p, contactEmail: e.target.value }))}
                  className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Contact Phone</label>
                <input
                  value={form.contactPhone}
                  onChange={e => setForm(p => ({ ...p, contactPhone: e.target.value }))}
                  className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Office Address</label>
                <input
                  value={form.address}
                  onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                  className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={save}
                  disabled={updateAgency.isPending}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {updateAgency.isPending ? "Saving..." : "Save Changes"}
                </button>
                {saved && <span className="text-sm text-primary">Saved successfully</span>}
              </div>
            </div>
          )}
        </div>

        {/* AI Configuration */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Bot className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-foreground">Station Intelligence (AI Receptionist)</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <div className="text-sm font-medium text-foreground">AI Model</div>
                <div className="text-xs text-muted-foreground mt-0.5">Language model powering your receptionist</div>
              </div>
              <span className="text-sm text-primary font-medium">GPT-4o</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <div className="text-sm font-medium text-foreground">Voice Engine</div>
                <div className="text-xs text-muted-foreground mt-0.5">Voice synthesis for phone calls</div>
              </div>
              <span className="text-sm text-primary font-medium">Vapi.ai</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <div className="text-sm font-medium text-foreground">CRM Integration</div>
                <div className="text-xs text-muted-foreground mt-0.5">Property data source</div>
              </div>
              <span className="text-sm text-primary font-medium">VaultRE</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <div className="text-sm font-medium text-foreground">Tenant Form Delivery</div>
                <div className="text-xs text-muted-foreground mt-0.5">NSW Fair Trading Standard Tenancy Form</div>
              </div>
              <span className="text-sm text-primary font-medium">SendGrid</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <div className="text-sm font-medium text-foreground">Phone Provider</div>
                <div className="text-xs text-muted-foreground mt-0.5">Inbound call routing</div>
              </div>
              <span className="text-sm text-primary font-medium">Twilio</span>
            </div>
          </div>
          <div className="mt-4 bg-muted/30 rounded-lg p-3 text-xs text-muted-foreground">
            To modify AI behaviour, response scripts, or phone numbers, contact your Directive OS account manager or raise a support request.
          </div>
        </div>

        {/* Mobile Access */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Smartphone className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-foreground">Mobile Access — Command Bridge</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Use this token to sign in to the Directive OS Command Bridge app on your phone. Keep it private — anyone with this token can view your agency data.
          </p>
          <MobileTokenCard token={(agency as any)?.mobileToken} />
        </div>

        {/* Legal */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-foreground">Legal & Compliance</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">SaaS Terms of Service</span>
              <a href="/terms" className="text-primary hover:text-primary/80 text-xs">View</a>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Privacy Policy (APP Compliant)</span>
              <a href="/privacy" className="text-primary hover:text-primary/80 text-xs">View</a>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-muted-foreground">Terms Accepted</span>
              <span className={`text-xs font-medium ${agency?.termsAccepted ? "text-primary" : "text-amber-400"}`}>
                {agency?.termsAccepted ? "Yes" : "Pending"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
