import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Onboard from "@/pages/onboard";
import { SignIn, SignUp } from "@/pages/auth";
import Terms from "@/pages/terms";
import Privacy from "@/pages/privacy";
import Resources from "@/pages/resources";
import Dashboard from "@/pages/dashboard/index";
import Leads from "@/pages/dashboard/leads";
import Transcripts from "@/pages/dashboard/transcripts";
import Listings from "@/pages/dashboard/listings";
import Staff from "@/pages/dashboard/staff";
import Billing from "@/pages/dashboard/billing";
import Settings from "@/pages/dashboard/settings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/sign-in" component={SignIn} />
      <Route path="/sign-up" component={SignUp} />
      <Route path="/onboard" component={Onboard} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/resources" component={Resources} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dashboard/leads" component={Leads} />
      <Route path="/dashboard/transcripts" component={Transcripts} />
      <Route path="/dashboard/listings" component={Listings} />
      <Route path="/dashboard/staff" component={Staff} />
      <Route path="/dashboard/billing" component={Billing} />
      <Route path="/dashboard/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
