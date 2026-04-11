import { useState } from "react";
import { useParams, Link } from "wouter";
import {
  Bed, Bath, Car, MapPin, Calendar, Phone, Mail,
  ChevronLeft, ChevronRight, Share2, Heart, CheckCircle
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { getListingById, listings } from "@/data/listings";
import PropertyCard from "@/components/property-card";

const statusBadge: Record<string, { label: string; color: string }> = {
  active_sale: { label: "For Sale", color: "bg-emerald-100 text-emerald-800" },
  active_rental: { label: "For Rent", color: "bg-emerald-100 text-emerald-800" },
  under_offer: { label: "Under Offer", color: "bg-amber-100 text-amber-800" },
  sold: { label: "Sold", color: "bg-red-100 text-red-800" },
  leased: { label: "Leased", color: "bg-blue-100 text-blue-800" },
};

export default function ListingDetailPage() {
  const params = useParams<{ id: string }>();
  const listing = getListingById(params.id);
  const [imageIdx, setImageIdx] = useState(0);
  const [saved, setSaved] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });

  if (!listing) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-16">
          <div className="text-center">
            <p className="font-serif text-2xl font-bold mb-2">Property not found</p>
            <Link href="/listings">
              <a className="text-gold text-sm hover:underline">← Back to listings</a>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusKey =
    listing.status === "active"
      ? `active_${listing.type}`
      : listing.status;
  const { label, color } = statusBadge[statusKey] ?? { label: listing.status, color: "bg-gray-100 text-gray-800" };

  const similar = listings
    .filter((l) => l.id !== listing.id && l.type === listing.type && l.status === "active")
    .slice(0, 3);

  function prevImage() {
    setImageIdx((i) => (i - 1 + listing!.images.length) % listing!.images.length);
  }
  function nextImage() {
    setImageIdx((i) => (i + 1) % listing!.images.length);
  }

  function handleEnquiry(e: React.FormEvent) {
    e.preventDefault();
    setFormSent(true);
  }

  const base = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Breadcrumb */}
      <div className="pt-20 pb-2 px-4 bg-muted/40 border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-muted-foreground">
          <a href={`${base}/`} className="hover:text-foreground transition-colors">Home</a>
          <ChevronRight className="w-3 h-3" />
          <a href={`${base}/listings`} className="hover:text-foreground transition-colors">Properties</a>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground truncate">{listing.address}, {listing.suburb}</span>
        </div>
      </div>

      {/* Gallery */}
      <div className="relative aspect-[16/7] bg-muted overflow-hidden max-h-[520px]">
        <img
          src={listing.images[imageIdx]}
          alt={`${listing.address} image ${imageIdx + 1}`}
          className="w-full h-full object-cover"
        />
        {listing.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md transition"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md transition"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {listing.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setImageIdx(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === imageIdx ? "bg-white scale-125" : "bg-white/50"}`}
                />
              ))}
            </div>
          </>
        )}
        <span className={`absolute top-4 left-4 text-xs font-semibold px-3 py-1.5 rounded-full ${color}`}>
          {label}
        </span>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Title block */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
                  {listing.price}
                </h1>
                <div className="flex items-center gap-1.5 text-muted-foreground mt-1">
                  <MapPin className="w-4 h-4 text-gold shrink-0" />
                  <span className="text-base">{listing.address}, {listing.suburb} {listing.state} {listing.postcode}</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => setSaved(!saved)}
                  className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors ${
                    saved ? "bg-red-50 border-red-200 text-red-500" : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${saved ? "fill-red-500" : ""}`} />
                </button>
                <button className="w-9 h-9 rounded-full border border-border text-muted-foreground hover:text-foreground flex items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Specs */}
            <div className="flex flex-wrap items-center gap-6 mt-5 pb-5 border-b border-border">
              <span className="flex items-center gap-2 text-foreground">
                <Bed className="w-5 h-5 text-gold" />
                <span className="font-semibold">{listing.bedrooms}</span>
                <span className="text-muted-foreground text-sm">Beds</span>
              </span>
              <span className="flex items-center gap-2 text-foreground">
                <Bath className="w-5 h-5 text-gold" />
                <span className="font-semibold">{listing.bathrooms}</span>
                <span className="text-muted-foreground text-sm">Baths</span>
              </span>
              <span className="flex items-center gap-2 text-foreground">
                <Car className="w-5 h-5 text-gold" />
                <span className="font-semibold">{listing.carspaces}</span>
                <span className="text-muted-foreground text-sm">Cars</span>
              </span>
              {listing.landSize && (
                <span className="text-muted-foreground text-sm">
                  <span className="font-semibold text-foreground">{listing.landSize}</span> land
                </span>
              )}
            </div>
          </div>

          {/* Inspections */}
          {listing.inspectionTimes.length > 0 && (
            <div className="bg-gold/8 border border-gold/20 rounded-xl p-5">
              <h3 className="font-serif text-base font-bold mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gold" />
                Upcoming Inspections
              </h3>
              <div className="space-y-2">
                {listing.inspectionTimes.map((time) => (
                  <div key={time} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{time}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Can't make it? Chat with Sarah below to arrange a private viewing.
              </p>
            </div>
          )}

          {/* Description */}
          <div>
            <h2 className="font-serif text-xl font-bold mb-4">About This Property</h2>
            <div className="space-y-3 text-foreground/80 leading-relaxed text-sm">
              {listing.description.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <h2 className="font-serif text-xl font-bold mb-4">Property Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {listing.features.map((f) => (
                <div key={f} className="flex items-start gap-2 text-sm text-foreground/80">
                  <CheckCircle className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — enquiry & agent */}
        <div className="space-y-5">
          {/* Agent card */}
          <div className="bg-white border border-border rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={listing.agentPhoto}
                alt={listing.agentName}
                className="w-14 h-14 rounded-full border-2 border-border bg-muted"
              />
              <div>
                <p className="font-semibold text-sm">{listing.agentName}</p>
                <p className="text-xs text-gold">Meridian Property Group</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <a
                href={`tel:${listing.agentPhone.replace(/\s/g, "")}`}
                className="flex items-center gap-2 bg-gold hover:bg-gold-dark text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors"
              >
                <Phone className="w-4 h-4" />
                {listing.agentPhone}
              </a>
              <a
                href={`mailto:${listing.agentEmail}`}
                className="flex items-center gap-2 border border-border text-foreground text-sm font-medium py-2.5 px-4 rounded-lg hover:bg-muted transition-colors"
              >
                <Mail className="w-4 h-4 text-gold" />
                {listing.agentEmail}
              </a>
            </div>
          </div>

          {/* Enquiry form */}
          <div className="bg-white border border-border rounded-xl p-5 shadow-sm">
            <h3 className="font-serif text-base font-bold mb-4">Enquire About This Property</h3>
            {formSent ? (
              <div className="text-center py-6">
                <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                <p className="font-semibold text-sm mb-1">Enquiry Sent!</p>
                <p className="text-xs text-muted-foreground">
                  Our team will be in touch shortly. Or chat with Sarah for an instant response.
                </p>
              </div>
            ) : (
              <form onSubmit={handleEnquiry} className="space-y-3">
                {[
                  { key: "name", label: "Full Name", type: "text", placeholder: "Jane Smith" },
                  { key: "email", label: "Email", type: "email", placeholder: "jane@example.com" },
                  { key: "phone", label: "Phone", type: "tel", placeholder: "04xx xxx xxx" },
                ].map(({ key, label, type, placeholder }) => (
                  <div key={key}>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">{label}</label>
                    <input
                      type={type}
                      value={formData[key as keyof typeof formData]}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      placeholder={placeholder}
                      required={key !== "phone"}
                      className="w-full text-sm bg-muted rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-gold/40 placeholder:text-muted-foreground"
                    />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={`I'm interested in ${listing.address}…`}
                    rows={3}
                    className="w-full text-sm bg-muted rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-gold/40 placeholder:text-muted-foreground resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gold hover:bg-gold-dark text-white text-sm font-medium py-3 rounded-lg transition-colors"
                >
                  Send Enquiry
                </button>
              </form>
            )}
          </div>

          {/* Office contact */}
          <div className="bg-muted/50 border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-2 font-medium">Meridian Property Group</p>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-3.5 h-3.5 text-gold" />
              <a href="tel:0258504038" className="hover:text-gold transition-colors">02 5850 4038</a>
            </div>
            <div className="flex items-center gap-2 text-sm mt-1.5">
              <MapPin className="w-3.5 h-3.5 text-gold" />
              <span className="text-muted-foreground text-xs">Level 2, 36 Terminus St, Castle Hill</span>
            </div>
          </div>
        </div>
      </div>

      {/* Similar properties */}
      {similar.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="font-serif text-2xl font-bold mb-6">Similar Properties</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similar.map((l) => (
              <PropertyCard key={l.id} listing={l} />
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
