import { Link } from "wouter";
import { Home } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center pt-16 px-4">
        <div className="text-center max-w-md">
          <p className="font-serif text-8xl font-bold text-gold/30 leading-none mb-4">404</p>
          <h1 className="font-serif text-2xl font-bold mb-2">Page Not Found</h1>
          <p className="text-muted-foreground text-sm mb-8">
            The page you're looking for doesn't exist or has moved.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-white text-sm font-medium px-6 py-3 rounded-lg transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
