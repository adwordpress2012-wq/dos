import { Link, useLocation } from "wouter";
import { ArrowRight } from "lucide-react";

export function SignIn() {
  const [, navigate] = useLocation();
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center font-bold text-primary-foreground text-sm">D</div>
          <span className="font-bold text-xl tracking-tight text-foreground">Directive OS</span>
        </div>
        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
          <h2 className="text-xl font-bold text-foreground mb-1">Welcome back</h2>
          <p className="text-muted-foreground text-sm mb-6">Sign in to your Command Centre</p>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Email</label>
              <input type="email" placeholder="principal@youragency.com.au"
                className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Password</label>
              <input type="password" placeholder="••••••••"
                className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              Sign In <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-4 text-center">
            <Link href="/sign-up" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Don't have an account? <span className="text-primary">Get started</span>
            </Link>
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-4">
          <Link href="/" className="hover:text-primary transition-colors">Back to Directive OS</Link>
        </p>
      </div>
    </div>
  );
}

export function SignUp() {
  const [, navigate] = useLocation();
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center font-bold text-primary-foreground text-sm">D</div>
          <span className="font-bold text-xl tracking-tight text-foreground">Directive OS</span>
        </div>
        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
          <h2 className="text-xl font-bold text-foreground mb-1">Activate your agency</h2>
          <p className="text-muted-foreground text-sm mb-6">Create your Directive OS account</p>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">First Name</label>
                <input placeholder="John"
                  className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Last Name</label>
                <input placeholder="Harrison"
                  className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Email</label>
              <input type="email" placeholder="principal@youragency.com.au"
                className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Password</label>
              <input type="password" placeholder="••••••••"
                className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <button
              onClick={() => navigate("/onboard")}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              Create Account <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-4 text-center">
            <Link href="/sign-in" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Already have an account? <span className="text-primary">Sign in</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
