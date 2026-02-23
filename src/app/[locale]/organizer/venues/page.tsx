"use client";

import { useTranslations, useLocale } from "next-intl";
import { useOrganizer } from "@/lib/organizer-context";
import Link from "next/link";
import { Plus, MapPin, Pencil, Trash2, Star, Users, Calendar } from "lucide-react";

export default function OrganizerVenuesPage() {
  const t = useTranslations("OrganizerPanel");
  const locale = useLocale();
  const { organizerVenues, deleteVenue } = useOrganizer();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{t("venues.title")}</h1>
          <p className="text-white/50 text-sm mt-1">{t("venues.subtitle")}</p>
        </div>
        <Link
          href={`/${locale}/organizer/venues/new`}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FF2D55] text-white font-medium hover:bg-[#FF2D55]/80 transition-all"
        >
          <Plus className="w-5 h-5" />
          {t("venues.newVenue")}
        </Link>
      </div>

      {/* Venues Grid */}
      {organizerVenues.length === 0 ? (
        <div className="text-center py-16">
          <MapPin className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40">{t("venues.noVenues")}</p>
          <Link
            href={`/${locale}/organizer/venues/new`}
            className="inline-flex items-center gap-2 mt-4 text-[#FF2D55] hover:text-[#FF2D55]/80 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t("venues.createFirst")}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {organizerVenues.map((venue) => (
            <div
              key={venue.id}
              className="group rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl overflow-hidden hover:border-white/20 transition-all"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={venue.image}
                  alt={venue.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    venue.venueStatus === "active"
                      ? "bg-green-400/10 text-green-400 border border-green-400/20"
                      : "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20"
                  }`}>
                    {t(`venues.status.${venue.venueStatus}`)}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold">{venue.name}</h3>
                <p className="text-white/40 text-sm mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {venue.city}
                </p>
                <div className="flex items-center gap-4 mt-3 text-xs text-white/40">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {venue.capacity}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5" />
                    {venue.rating}
                  </span>
                  <span>{venue.type}</span>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
                  <Link
                    href={`/${locale}/organizer/venues/${venue.id}/edit`}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    {t("venues.edit")}
                  </Link>
                  <Link
                    href={`/${locale}/organizer/venues/${venue.id}/calendar`}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-[#FF2D55] hover:bg-[#FF2D55]/10 transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    {t("venues.calendar")}
                  </Link>
                  <Link
                    href={`/${locale}/venues/${venue.id}`}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    {t("venues.viewProfile")}
                  </Link>
                  <button
                    onClick={() => deleteVenue(venue.id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-400/10 ml-auto transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
