import { Switch, Route, Router as WouterRouter } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import HomePage from "@/pages/home";
import ListingsPage from "@/pages/listings";
import ListingDetailPage from "@/pages/listing-detail";
import AboutPage from "@/pages/about";
import ContactPage from "@/pages/contact";
import NotFound from "@/pages/not-found";
import SarahChatWidget from "@/components/sarah-chat-widget";
import AgencyPromoBar from "@/components/agency-promo-bar";
import { PromoProvider } from "@/context/promo-context";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/listings" component={ListingsPage} />
      <Route path="/listings/:id" component={ListingDetailPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <PromoProvider>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <AgencyPromoBar />
        <Router />
        <SarahChatWidget />
        <Toaster />
      </WouterRouter>
    </PromoProvider>
  );
}

export default App;
