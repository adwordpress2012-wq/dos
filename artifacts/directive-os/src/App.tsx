import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Onboard from "@/pages/onboard";
import OnboardSubscribe from "@/pages/onboard-subscribe";
import { SignIn, SignUp } from "@/pages/auth";
import Terms from "@/pages/terms";
import Privacy from "@/pages/privacy";
import Resources from "@/pages/resources";
import BookConsultation from "@/pages/book";
import Dashboard from "@/pages/dashboard/index";
import Leads from "@/pages/dashboard/leads";
import Transcripts from "@/pages/dashboard/transcripts";
import Listings from "@/pages/dashboard/listings";
import Staff from "@/pages/dashboard/staff";
import Billing from "@/pages/dashboard/billing";
import BillingSuccess from "@/pages/dashboard/billing-success";
import Settings from "@/pages/dashboard/settings";
import AdminLogin from "@/pages/admin/index";
import AdminBridge from "@/pages/admin/bridge";
import AdminClients from "@/pages/admin/clients";
import AdminListings from "@/pages/admin/listings";
import AdminFinancials from "@/pages/admin/financials";
import AdminPipeline from "@/pages/admin/pipeline";
import AdminActivity from "@/pages/admin/activity";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog-post";
import ThankYou from "@/pages/thank-you";
import Demo from "@/pages/demo";
import Pay from "@/pages/pay";
import Welcome from "@/pages/welcome";
import BoulevardGroup from "@/pages/boulevard-group";
import EliteSydney from "@/pages/elite-sydney";
import Demos from "@/pages/demos";
import EliteProposal from "@/pages/proposals/elite";
import VideoAd from "@/pages/video-ad";

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
      <Route path="/onboard/subscribe" component={OnboardSubscribe} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/resources" component={Resources} />
      <Route path="/book" component={BookConsultation} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/blog" component={Blog} />
      <Route path="/thank-you" component={ThankYou} />
      <Route path="/demo" component={Demo} />
      <Route path="/pay/:slug" component={Pay} />
      <Route path="/pay" component={Pay} />
      <Route path="/welcome" component={Welcome} />
      <Route path="/boulevard-group" component={BoulevardGroup} />
      <Route path="/elite-sydney" component={EliteSydney} />
      <Route path="/demos" component={Demos} />
      <Route path="/proposals/elite" component={EliteProposal} />
      <Route path="/video-ad" component={VideoAd} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dashboard/leads" component={Leads} />
      <Route path="/dashboard/transcripts" component={Transcripts} />
      <Route path="/dashboard/listings" component={Listings} />
      <Route path="/dashboard/staff" component={Staff} />
      <Route path="/dashboard/billing" component={Billing} />
      <Route path="/dashboard/billing/success" component={BillingSuccess} />
      <Route path="/dashboard/settings" component={Settings} />
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/bridge" component={AdminBridge} />
      <Route path="/admin/clients" component={AdminClients} />
      <Route path="/admin/listings" component={AdminListings} />
      <Route path="/admin/financials" component={AdminFinancials} />
      <Route path="/admin/pipeline" component={AdminPipeline} />
      <Route path="/admin/activity" component={AdminActivity} />
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
