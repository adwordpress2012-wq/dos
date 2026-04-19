import { Link } from "wouter";
import { Bed, Bath, Car, MapPin, Calendar } from "lucide-react";
import type { Listing } from "@/data/listings";

const statusLabel: Record<Listing["status"], { label: string; color: string }> = {
  active: { label: "For Sale", color: "bg-emerald-100 text-emerald-800" },
  under_offer: { label: "Under Offer", color: "bg-amber-100 text-amber-800" },
  sold: { label: "Sold", color: "bg-red-100 text-red-800" },
  leased: { label: "Leased", color: "bg-blue-100 text-blue-800" },
};

const rentalStatus: Record<Listing["status"], { label: string; color: string }> = {
  active: { label: "For Rent", color: "bg-emerald-100 text-emerald-800" },
  under_offer: { label: "Under Offer", color: "bg-amber-100 text-amber-800" },
  sold: { label: "Sold", color: "bg-red-100 text-red-800" },
  leased: { label: "Leased", color: "bg-blue-100 text-blue-800" },
};

interface Props {
  listing: Listing;
}

export default function PropertyCard({ listing }: Props) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const statusMap = listing.type === "rental" ? rentalStatus : statusLabel;
  const { label, color } = statusMap[listing.status];

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group block bg-card rounded-xl overflow-hidden border border-border property-card shadow-sm hover:shadow-md transition-shadow"
    >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={listing.heroImage}
            alt={`${listing.address}, ${listing.suburb}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${color}`}>
            {label}
          </span>
          {listing.type === "rental" && listing.inspectionTimes.length > 0 && (
            <span className="absolute top-3 right-3 text-xs font-medium bg-white/90 text-foreground px-2.5 py-1 rounded-full flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Inspection
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Price */}
          <p className="font-serif text-xl font-bold text-foreground mb-0.5">{listing.price}</p>

          {/* Address */}
          <div className="flex items-start gap-1 text-sm text-muted-foreground mb-3">
            <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-gold" />
            <span>{listing.address}, {listing.suburb} {listing.state} {listing.postcode}</span>
          </div>

          {/* Features */}
          <div className="flex items-center gap-4 text-sm text-foreground/70 border-t border-border pt-3">
            <span className="flex items-center gap-1.5">
              <Bed className="w-4 h-4 text-gold" />
              <span className="font-medium">{listing.bedrooms}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Bath className="w-4 h-4 text-gold" />
              <span className="font-medium">{listing.bathrooms}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Car className="w-4 h-4 text-gold" />
              <span className="font-medium">{listing.carspaces}</span>
            </span>
            {listing.landSize && (
              <span className="ml-auto text-xs text-muted-foreground">{listing.landSize}</span>
            )}
          </div>

          {/* Agent */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
            <img
              src={listing.agentPhoto}
              alt={listing.agentName}
              className="w-7 h-7 rounded-full border border-border bg-muted"
            />
            <span className="text-xs text-muted-foreground">{listing.agentName}</span>
          </div>
        </div>
    </Link>
  );
}
