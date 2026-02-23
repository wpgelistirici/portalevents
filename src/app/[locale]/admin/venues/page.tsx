"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useOrganizer } from "@/lib/organizer-context";
import { venues as publicVenues } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Search,
  MapPin,
  ChevronDown,
  ChevronUp,
  Users as UsersIcon,
  Calendar,
  Globe,
  Phone,
  Mail,
} from "lucide-react";

export default function AdminVenuesPage() {
  const t = useTranslations("AdminPanel.venues");
  const { organizerVenues } = useOrganizer();
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Combine public + organizer venues, dedupe by id
  const allVenues = useMemo(() => {
    const orgIds = new Set(organizerVenues.map((v) => v.id));
    const pubOnly = publicVenues.filter((v) => !orgIds.has(v.id));
    const orgMapped = organizerVenues.map((v) => ({
      ...v,
      source: "organizer" as const,
    }));
    const pubMapped = pubOnly.map((v) => ({
      ...v,
      source: "system" as const,
      organizerId: undefined as string | undefined,
      venueStatus: "active" as const,
      createdAt: "2026-01-10T10:00:00Z",
    }));
    return [...orgMapped, ...pubMapped];
  }, [organizerVenues]);

  const filtered = useMemo(() => {
    return allVenues.filter((v) => {
      return !search || v.name.toLowerCase().includes(search.toLowerCase()) || v.city.toLowerCase().includes(search.toLowerCase());
    });
  }, [allVenues, search]);

  const cities = useMemo(() => [...new Set(allVenues.map((v) => v.city))], [allVenues]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <MapPin className="w-7 h-7 text-red-400" />
          {t("title")}
        </h1>
        <p className="text-white/40 text-sm mt-1">{t("subtitle")}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5">
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">{t("totalVenues")}</p>
          <p className="text-2xl font-bold text-white">{allVenues.length}</p>
        </div>
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5">
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">{t("totalCities")}</p>
          <p className="text-2xl font-bold text-white">{cities.length}</p>
        </div>
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5">
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">{t("organizerVenues")}</p>
          <p className="text-2xl font-bold text-white">{organizerVenues.length}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-red-500/50 text-sm"
        />
      </div>

      {/* Venues List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <MapPin className="w-12 h-12 text-white/10 mx-auto mb-4" />
          <p className="text-white/30 text-sm">{t("noVenues")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((venue) => {
            const isExpanded = expandedId === venue.id;
            return (
              <motion.div
                key={venue.id}
                layout
                className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden"
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : venue.id)}
                  className="w-full text-left"
                >
                  <div className="relative h-36 overflow-hidden">
                    <Image src={venue.image} alt={venue.name} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-end justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-white">{venue.name}</h3>
                          <p className="text-[11px] text-white/40 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" /> {venue.city}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-semibold ${venue.source === "organizer" ? "bg-amber-500/10 text-amber-400" : "bg-blue-500/10 text-blue-400"}`}>
                            {venue.source === "organizer" ? t("byOrganizer") : t("system")}
                          </span>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
                        </div>
                      </div>
                    </div>
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">{t("capacity")}</p>
                            <p className="text-white/70 flex items-center gap-1">
                              <UsersIcon className="w-3 h-3" /> {venue.capacity}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">{t("type")}</p>
                            <p className="text-white/70">{venue.type || "-"}</p>
                          </div>
                        </div>
                        {(() => {
                          const desc = (venue as Record<string, unknown>).description as string | undefined;
                          return desc ? (
                            <div>
                              <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">{t("description")}</p>
                              <p className="text-white/50 text-xs leading-relaxed">{desc}</p>
                            </div>
                          ) : null;
                        })()}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
