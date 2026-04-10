import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Inbox, 
  FileAudio, 
  Building2, 
  Users, 
  CreditCard, 
  Settings,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Command Centre", href: "/dashboard", icon: LayoutDashboard },
  { name: "Lead Inbox", href: "/dashboard/leads", icon: Inbox },
  { name: "Communication Logs", href: "/dashboard/transcripts", icon: FileAudio },
  { name: "Property Intelligence", href: "/dashboard/listings", icon: Building2 },
  { name: "Seat Management", href: "/dashboard/staff", icon: Users },
  { name: "Billing Command", href: "/dashboard/billing", icon: CreditCard },
  { name: "Protocols", href: "/dashboard/settings", icon: Settings },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border/50 bg-card hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded bg-primary flex items-center justify-center font-bold text-primary-foreground">
              D
            </div>
            <span className="font-bold tracking-tight">Directive OS</span>
          </div>
        </div>

        <div className="p-4">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
            Agency Name
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location === item.href || (item.href !== "/dashboard" && location.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className={cn("size-4", isActive ? "text-primary" : "text-muted-foreground")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/50">
          <button className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors w-full">
            <LogOut className="size-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border/50 bg-background/95 backdrop-blur flex items-center px-6 md:hidden">
           <span className="font-bold tracking-tight">Directive OS</span>
        </header>
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
