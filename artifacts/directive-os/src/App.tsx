import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Onboard from "@/pages/onboard";
import OnboardSubscribe from "@/pages/onboard-subscribe";
import DashboardLogin from "@/pages/dashboard/login";
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
import AdminQuote from "@/pages/admin/quote";
import AdminGoals from "@/pages/admin/goals";
import SetPassword from "@/pages/dashboard/set-password";
import { SignUp } from "@/pages/auth";
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
import RayWhiteUG from "@/pages/ray-white-ug";
import RayWhiteRH from "@/pages/ray-white-rh";
import DemoStandard from "@/pages/demo-standard";
import DemoTwo from "@/pages/demo-two";
import DemoThree from "@/pages/demo-three";
import Partners from "@/pages/partners";
import Launch from "@/pages/launch";
import MarketingHub from "@/pages/marketing/index";
import BusinessCard from "@/pages/marketing/business-card";
import OnePager from "@/pages/marketing/one-pager";
import EmailCampaign from "@/pages/marketing/email-campaign";
import EmailSignature from "@/pages/marketing/email-signature";
import ProposalTemplate from "@/pages/marketing/proposal";
import WebQuote from "@/pages/marketing/web-quote";
import HealthCheck from "@/pages/marketing/health-check";
import Brochure from "@/pages/marketing/brochure";
import ReferralSchedule from "@/pages/marketing/referral-schedule";
import LeaveBehind from "@/pages/marketing/leave-behind";
import Signature from "@/pages/signature";
import SignatureCard from "@/pages/signature-card";
import QuoteRedirect from "@/pages/q";
import CosPage from "@/pages/cos";
import BosPage from "@/pages/bos";
import MicahPage from "@/pages/micah";
import WebsiteRebuildsPage from "@/pages/website-rebuilds";
import ContactPage from "@/pages/contact";
import AcceptableUsePage from "@/pages/acceptable-use";
import NumberPolicyPage from "@/pages/number-policy";
import CancellationPolicyPage from "@/pages/cancellation-policy";

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
      <Route path="/pricing" component={Home} />
      <Route path="/dashboard/login" component={DashboardLogin} />
      <Route path="/command-centre" component={DashboardLogin} />
      <Route path="/sign-up" component={SignUp} />
      <Route path="/onboard" component={Onboard} />
      <Route path="/onboarding" component={Onboard} />
      <Route path="/onboard/subscribe" component={OnboardSubscribe} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/acceptable-use" component={AcceptableUsePage} />
      <Route path="/number-policy" component={NumberPolicyPage} />
      <Route path="/cancellation-policy" component={CancellationPolicyPage} />
      <Route path="/contact" component={ContactPage} />
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
      <Route path="/ray-white-ug" component={RayWhiteUG} />
      <Route path="/ray-white-rh" component={RayWhiteRH} />
      <Route path="/demo" component={DemoStandard} />
      <Route path="/demo-2" component={DemoTwo} />
      <Route path="/demo-3" component={DemoThree} />
      <Route path="/partners" component={Partners} />
      <Route path="/launch" component={Launch} />
      <Route path="/demos" component={Demos} />
      <Route path="/proposals/elite" component={EliteProposal} />
      <Route path="/video-ad" component={VideoAd} />
      <Route path="/marketing" component={MarketingHub} />
      <Route path="/marketing/business-card" component={BusinessCard} />
      <Route path="/marketing/one-pager" component={OnePager} />
      <Route path="/marketing/email-campaign" component={EmailCampaign} />
      <Route path="/marketing/email-signature" component={EmailSignature} />
      <Route path="/marketing/proposal" component={ProposalTemplate} />
      <Route path="/marketing/web-quote" component={WebQuote} />
      <Route path="/marketing/health-check" component={HealthCheck} />
      <Route path="/marketing/brochure" component={Brochure} />
      <Route path="/marketing/referral-schedule" component={ReferralSchedule} />
      <Route path="/marketing/leave-behind" component={LeaveBehind} />
      <Route path="/cos" component={CosPage} />
      <Route path="/bos" component={BosPage} />
      <Route path="/micah" component={MicahPage} />
      <Route path="/website-rebuilds" component={WebsiteRebuildsPage} />
      <Route path="/signature" component={Signature} />
      <Route path="/signature-card" component={SignatureCard} />
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
      <Route path="/admin/quote" component={AdminQuote} />
      <Route path="/admin/goals" component={AdminGoals} />
      <Route path="/dashboard/set-password" component={SetPassword} />
      <Route path="/q/:code" component={QuoteRedirect} />
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
