import { useState } from "react";
import { Phone, Mail, MapPin, Clock, CheckCircle } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    enquiryType: "appraisal",
    message: "",
    suburb: "",
  });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  const enquiryTypes = [
    { value: "appraisal", label: "Free Property Appraisal" },
    { value: "buy", label: "I'm Looking to Buy" },
    { value: "rent", label: "I'm Looking to Rent" },
    { value: "landlord", label: "Landlord / Property Management" },
    { value: "other", label: "General Enquiry" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <div className="bg-[#0F1623] pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-2">Get in Touch</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white max-w-xl">
            We'd Love to Hear From You
          </h1>
          <p className="text-white/60 mt-4 max-w-xl text-sm leading-relaxed">
            Whether you're ready to sell, looking to buy, or just want a no-obligation market update — our team is here to help.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Contact details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
            <h2 className="font-serif text-xl font-bold mb-5">Contact Us</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Main Office</p>
                  <a href="tel:0258504038" className="font-semibold text-sm hover:text-gold transition-colors">
                    02 5850 4038
                  </a>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Or chat with Sarah 24/7 using the widget below
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Email</p>
                  <a href="mailto:hello@meridianproperty.com.au" className="font-semibold text-sm hover:text-gold transition-colors">
                    hello@meridianproperty.com.au
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Office Address</p>
                  <p className="font-semibold text-sm">Level 2, 36 Terminus Street</p>
                  <p className="text-sm text-muted-foreground">Castle Hill NSW 2154</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Office Hours</p>
                  <p className="text-sm font-medium">Mon – Fri: 9:00am – 5:30pm</p>
                  <p className="text-sm text-muted-foreground">Saturday: 9:00am – 1:00pm</p>
                  <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Sarah available 24/7
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Agents */}
          <div className="bg-white border border-border rounded-xl p-5 shadow-sm">
            <h3 className="font-serif text-sm font-bold mb-4">Our Agents</h3>
            <div className="space-y-3">
              {[
                { name: "James Whitfield", role: "Principal", phone: "0412 345 678", seed: "James", bg: "b6e3f4" },
                { name: "Sophie Chen", role: "Senior Sales Agent", phone: "0423 456 789", seed: "Sophie", bg: "ffdfbf" },
                { name: "Michael Torres", role: "Property Management", phone: "0434 567 890", seed: "Michael", bg: "c0aede" },
              ].map((a) => (
                <div key={a.name} className="flex items-center gap-3">
                  <img
                    src={`https://api.dicebear.com/8.x/avataaars/svg?seed=${a.seed}&backgroundColor=${a.bg}&size=80`}
                    alt={a.name}
                    className="w-10 h-10 rounded-full border border-border bg-muted"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{a.name}</p>
                    <p className="text-xs text-muted-foreground">{a.role}</p>
                  </div>
                  <a
                    href={`tel:${a.phone.replace(/\s/g, "")}`}
                    className="text-xs text-gold hover:underline shrink-0"
                  >
                    {a.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Sarah callout */}
          <div className="bg-gradient-to-br from-[#0F1623] to-[#1a2435] rounded-xl p-5 text-center">
            <div className="w-12 h-12 rounded-full bg-gold/20 border-2 border-gold/40 flex items-center justify-center mx-auto mb-3">
              <span className="font-serif text-2xl font-bold text-gold">S</span>
            </div>
            <p className="text-white font-semibold text-sm mb-1">Chat with Sarah now</p>
            <p className="text-white/55 text-xs mb-3">Get an instant response, any time of day</p>
            <button
              onClick={() => {
                const btn = document.querySelector<HTMLButtonElement>('[aria-label="Chat with Sarah"]');
                btn?.click();
              }}
              className="bg-gold hover:bg-gold-dark text-white text-xs font-medium px-5 py-2 rounded-lg transition-colors"
            >
              Open Chat
            </button>
          </div>
        </div>

        {/* Enquiry form */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-border rounded-xl p-6 sm:p-8 shadow-sm">
            <h2 className="font-serif text-2xl font-bold mb-6">Send Us a Message</h2>

            {sent ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-2">Message Sent!</h3>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
                  Thank you for reaching out. A member of our team will be in touch within 2 business hours. In the meantime, chat with Sarah for an instant response.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-6 text-sm text-gold hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Smith"
                      className="w-full text-sm bg-muted rounded-lg px-3 py-3 outline-none focus:ring-2 focus:ring-gold/40 placeholder:text-muted-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@example.com"
                      className="w-full text-sm bg-muted rounded-lg px-3 py-3 outline-none focus:ring-2 focus:ring-gold/40 placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="04xx xxx xxx"
                      className="w-full text-sm bg-muted rounded-lg px-3 py-3 outline-none focus:ring-2 focus:ring-gold/40 placeholder:text-muted-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Suburb of Interest</label>
                    <input
                      type="text"
                      value={formData.suburb}
                      onChange={(e) => setFormData({ ...formData, suburb: e.target.value })}
                      placeholder="e.g. Castle Hill"
                      className="w-full text-sm bg-muted rounded-lg px-3 py-3 outline-none focus:ring-2 focus:ring-gold/40 placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Enquiry Type *</label>
                  <div className="flex flex-wrap gap-2">
                    {enquiryTypes.map((t) => (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, enquiryType: t.value })}
                        className={`text-xs px-3 py-2 rounded-lg border transition-colors ${
                          formData.enquiryType === t.value
                            ? "bg-gold border-gold text-white"
                            : "border-border text-muted-foreground hover:border-gold/50 hover:text-foreground"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Message *</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us a little more about what you're looking for…"
                    rows={5}
                    className="w-full text-sm bg-muted rounded-lg px-3 py-3 outline-none focus:ring-2 focus:ring-gold/40 placeholder:text-muted-foreground resize-none"
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  By submitting this form, you agree to our Privacy Policy. Your information will not be shared with third parties.
                </p>

                <button
                  type="submit"
                  className="w-full bg-gold hover:bg-gold-dark text-white text-sm font-semibold py-3.5 rounded-lg transition-colors"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Map placeholder */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="rounded-xl overflow-hidden border border-border h-[280px] bg-muted relative">
          <img
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1600&q=80"
            alt="Castle Hill, NSW"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg px-6 py-4 text-center">
              <p className="font-serif font-bold text-sm">Meridian Property Group</p>
              <p className="text-xs text-muted-foreground">Level 2, 36 Terminus Street, Castle Hill NSW 2154</p>
              <a
                href="https://maps.google.com/?q=36+Terminus+Street+Castle+Hill+NSW"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gold hover:underline mt-1 block"
              >
                Get Directions →
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
