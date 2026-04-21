import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function SignUpSuccess() {
  const [params] = useSearchParams();
  const name = params.get("name") ?? "there";

  return (
    <div className="pt-28 pb-20 min-h-screen flex items-start justify-center">
      <div className="max-w-md w-full px-4 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "rgba(0,201,167,0.12)", border: "1px solid rgba(0,201,167,0.3)" }}>
          <CheckCircle className="w-8 h-8" style={{ color: "#00c9a7" }} />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">Payment confirmed!</h1>
        <p className="text-base mb-8" style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>
          Thanks {name}! We've received your payment. Jayson will have Sarah live on your number within 15 minutes — you'll receive an email with your login details shortly.
        </p>
        <div className="p-5 rounded-2xl border mb-8" style={{ background: "rgba(10,28,48,0.6)", borderColor: "rgba(0,201,167,0.15)" }}>
          <div className="text-xs font-bold tracking-wider mb-3" style={{ color: "rgba(0,201,167,0.7)" }}>WHAT HAPPENS NEXT</div>
          <ul className="text-sm space-y-2 text-left" style={{ color: "rgba(255,255,255,0.6)" }}>
            {[
              "Jayson provisions your dedicated phone number",
              "Sarah is configured for your business type",
              "You receive login credentials via email",
              "Your first call is answered within 15 minutes",
            ].map(item => (
              <li key={item} className="flex items-start gap-2">
                <span style={{ color: "#00c9a7" }}>✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <Link to="/" className="text-sm" style={{ color: "#00c9a7" }}>← Back to BookOS</Link>
      </div>
    </div>
  );
}
