import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Inbox,
  FileAudio,
  Building2,
  Users,
  CreditCard,
  Settings,
  LogOut,
  FlaskConical,
  Wifi,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetMyAgency } from "@workspace/api-client-react";
import { useSystemStatus } from "@/hooks/useSystemStatus";
import { useClientAuth } from "@/hooks/useClientAuth";

type NavItem = {
  name: string;
  href: string;
  icon: React.ElementType;
  allowedRoles: string[] | null;
};

const ALL_NAV: NavItem[] = [
  { name: "Command Centre",        href: "/dashboard",              icon: LayoutDashboard, allowedRoles: null },
  { name: "Lead Inbox",            href: "/dashboard/leads",        icon: Inbox,           allowedRoles: null },
  { name: "Communication Logs",    href: "/dashboard/transcripts",  icon: FileAudio,       allowedRoles: null },
  { name: "Property Intelligence", href: "/dashboard/listings",     icon: Building2,       allowedRoles: ["principal", "admin", "sales_executive"] },
  { name: "Billing Command",       href: "/dashboard/billing",      icon: CreditCard,      allowedRoles: ["principal", "admin"] },
  { name: "Seat Management",       href: "/dashboard/staff",        icon: Users,           allowedRoles: ["principal"] },
  { name: "Protocols",             href: "/dashboard/settings",     icon: Settings,        allowedRoles: ["principal"] },
];

const ROLE_LABELS: Record<string, string> = {
  principal: "Principal",
  admin: "Admin",
  sales_executive: "Sales Executive",
  sales_support: "Sales Support",
};

function SystemStatusBadge() {
  const { data: status, isLoading, isError } = useSystemStatus();

  if (isLoading) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50 border border-border">
        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse" />
        <span className="text-xs text-muted-foreground font-mono">Checking...</span>
      </div>
    );
  }

  if (isError || !status) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50 border border-border">
        <AlertCircle className="w-3 h-3 text-muted-foreground" />
        <span className="text-xs text-muted-foreground font-mono">OFFLINE</span>
      </div>
    );
  }

  const isSimulation = status.mode === "SIMULATION";

  return (
    <div className={cn(
      "flex items-center gap-1.5 px-2 py-1.5 rounded-md border",
      isSimulation
        ? "bg-amber-500/10 border-amber-500/20"
        : "bg-primary/10 border-primary/20"
    )}>
      {isSimulation ? (
        <FlaskConical className="w-3 h-3 text-amber-400 flex-shrink-0" />
      ) : (
        <Wifi className="w-3 h-3 text-primary flex-shrink-0" />
      )}
      <span className={cn(
        "text-xs font-mono font-medium leading-none",
        isSimulation ? "text-amber-400" : "text-primary"
      )}>
        {status.label}
      </span>
    </div>
  );
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { data: agency } = useGetMyAgency();
  const { agency: clientAgency, staff, isAgencyOwner, loading: authLoading, signOut } = useClientAuth();

  const staffRole = staff?.role ?? null;

  function canSeeItem(item: NavItem): boolean {
    if (isAgencyOwner) return true;
    if (!item.allowedRoles) return true;
    if (!staffRole) return false;
    return item.allowedRoles.includes(staffRole);
  }

  const navigation = ALL_NAV.filter(canSeeItem);
  const displayName = staff ? staff.name : (clientAgency?.contactEmail ?? "");
  const roleLabel = isAgencyOwner ? "Owner" : (staffRole ? (ROLE_LABELS[staffRole] ?? staffRole) : "Staff");

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#060d1a" }}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#00d1b2" }} />
          <p className="text-sm font-mono" style={{ color: "rgba(0,209,178,0.6)" }}>LOADING COMMAND BRIDGE...</p>
        </div>
      </div>
    );
  }

  if (!clientAgency) return null;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border/50 bg-card hidden md:flex flex-col">
        <div className="h-16 flex items-center px-5 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded bg-primary flex items-center justify-center font-bold text-primary-foreground flex-shrink-0">
              D
            </div>
            <span className="font-bold tracking-tight text-foreground">Directive OS</span>
          </div>
        </div>

        {/* Agency Name + Status */}
        <div className="px-4 pt-4 pb-2 space-y-2">
          <div className="px-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
              Agency
            </div>
            <div className="text-sm font-medium text-foreground truncate">
              {agency?.name ?? "Loading..."}
            </div>
          </div>
          <SystemStatusBadge />
        </div>

        <nav className="flex-1 px-4 space-y-0.5 mt-2">
          {navigation.map((item) => {
            const isActive = location === item.href || (item.href !== "/dashboard" && location.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
                )}
              >
                <item.icon className={cn("size-4", isActive ? "text-primary" : "text-muted-foreground")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/50 space-y-1">
          <div className="px-3 py-1.5">
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
              {roleLabel}
            </div>
            <div className="text-xs font-medium text-foreground truncate">{displayName}</div>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors w-full"
          >
            <LogOut className="size-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-col flex-1 min-w-0">
        <header className="h-14 border-b border-border/50 bg-background/95 backdrop-blur flex items-center justify-between px-4 md:hidden">
          <span className="font-bold tracking-tight">Directive OS</span>
          <SystemStatusBadge />
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
