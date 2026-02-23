"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useOrganizer } from "@/lib/organizer-context";
import { events as publicEvents } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Search,
  CalendarCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  ChevronDown,
  MapPin,
  Calendar,
  AlertCircle,
  Filter,
  X,
} from "lucide-react";
import type { EventStatus } from "@/lib/data";

export default function AdminEventsPage() {
  const t = useTranslations("AdminPanel.events");
  const { organizerEvents, updateEvent } = useOrganizer();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<EventStatus | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);

  // Combine organizer events + public events mapped as approved
  const allEvents = useMemo(() => {
    const orgIds = new Set(organizerEvents.map((e) => e.id));
    const publicMapped = publicEvents
      .filter((e) => !orgIds.has(e.id))
      .map((e) => ({
        ...e,
        status: "approved" as EventStatus,
        createdAt: "2026-01-15T10:00:00Z",
        updatedAt: "2026-01-15T10:00:00Z",
        artistIds: [] as string[],
        missingArtists: [] as string[],
        dopings: [] as never[],
      }));
    return [...organizerEvents, ...publicMapped];
  }, [organizerEvents]);

  const filtered = useMemo(() => {
    return allEvents.filter((e) => {
      const matchSearch = !search || e.title.toLowerCase().includes(search.toLowerCase()) || e.venue.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || e.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [allEvents, search, statusFilter]);

  const counts = useMemo(() => ({
    all: allEvents.length,
    pending_approval: allEvents.filter((e) => e.status === "pending_approval").length,
    approved: allEvents.filter((e) => e.status === "approved").length,
    rejected: allEvents.filter((e) => e.status === "rejected").length,
    draft: allEvents.filter((e) => e.status === "draft").length,
  }), [allEvents]);

  const handleApprove = (id: string) => {
    updateEvent(id, { status: "approved" });
  };

  const handleReject = (id: string) => {
    updateEvent(id, { status: "rejected" });
    setShowRejectModal(null);
    setRejectReason("");
  };

  const statusBadge = (status: EventStatus) => {
    const map: Record<EventStatus, { bg: string; text: string; label: string }> = {
      draft: { bg: "bg-white/10", text: "text-white/50", label: t("statusDraft") },
      pending_approval: { bg: "bg-amber-500/10", text: "text-amber-400", label: t("statusPending") },
      approved: { bg: "bg-emerald-500/10", text: "text-emerald-400", label: t("statusApproved") },
      rejected: { bg: "bg-red-500/10", text: "text-red-400", label: t("statusRejected") },
      cancelled: { bg: "bg-gray-500/10", text: "text-gray-400", label: t("statusCancelled") },
    };
    const s = map[status];
    return (
      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold ${s.bg} ${s.text}`}>
        {s.label}
      </span>
    );
  };

  const filterTabs: { key: EventStatus | "all"; count: number }[] = [
    { key: "all", count: counts.all },
    { key: "pending_approval", count: counts.pending_approval },
    { key: "approved", count: counts.approved },
    { key: "rejected", count: counts.rejected },
    { key: "draft", count: counts.draft },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <CalendarCheck className="w-7 h-7 text-red-400" />
          {t("title")}
        </h1>
        <p className="text-white/40 text-sm mt-1">{t("subtitle")}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-red-500/50 text-sm"
          />
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              statusFilter === tab.key
                ? "bg-red-500/10 text-red-400 border border-red-500/20"
                : "bg-white/[0.03] text-white/40 border border-white/[0.06] hover:text-white/60"
            }`}
          >
            {tab.key === "all" ? t("filterAll") : tab.key === "pending_approval" ? t("filterPending") : tab.key === "approved" ? t("filterApproved") : tab.key === "rejected" ? t("filterRejected") : t("filterDraft")}
            <span className={`min-w-[18px] h-[18px] flex items-center justify-center px-1 rounded-full text-[9px] font-bold ${statusFilter === tab.key ? "bg-red-500/20" : "bg-white/5"}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Events List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <CalendarCheck className="w-12 h-12 text-white/10 mx-auto mb-4" />
          <p className="text-white/30 text-sm">{t("noEvents")}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((event) => {
            const isExpanded = expandedId === event.id;
            return (
              <motion.div
                key={event.id}
                layout
                className="rounded-xl bg-white/[0.02] border border-white/[0.06] overflow-hidden"
              >
                {/* Row */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : event.id)}
                  className="w-full flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors text-left"
                >
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                    <Image src={event.image} alt={event.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-white truncate">{event.title}</p>
                      {statusBadge(event.status)}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-white/30">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {event.venue}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {event.date}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {event.status === "pending_approval" && (
                      <>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleApprove(event.id); }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-[11px] font-semibold hover:bg-emerald-500/20 transition-colors"
                        >
                          {t("approve")}
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setShowRejectModal(event.id); }}
                          className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-[11px] font-semibold hover:bg-red-500/20 transition-colors"
                        >
                          {t("reject")}
                        </button>
                      </>
                    )}
                    <ChevronDown className={`w-4 h-4 text-white/20 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </div>
                </button>

                {/* Expanded Detail */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-3">
                        <div className="h-px bg-white/5" />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">{t("genre")}</p>
                            <p className="text-white/70">{event.genre}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">{t("city")}</p>
                            <p className="text-white/70">{event.city}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">{t("price")}</p>
                            <p className="text-white/70">{event.price}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">{t("time")}</p>
                            <p className="text-white/70">{event.time}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">{t("artist")}</p>
                          <p className="text-white/70 text-sm">{event.artist}</p>
                        </div>
                        {event.status === "pending_approval" && (
                          <div className="flex gap-2 pt-2">
                            <button
                              onClick={() => handleApprove(event.id)}
                              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-colors"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              {t("approveEvent")}
                            </button>
                            <button
                              onClick={() => setShowRejectModal(event.id)}
                              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-colors"
                            >
                              <XCircle className="w-4 h-4" />
                              {t("rejectEvent")}
                            </button>
                          </div>
                        )}
                        {event.status === "approved" && (
                          <div className="flex items-center gap-2 text-emerald-400 text-xs">
                            <CheckCircle2 className="w-4 h-4" />
                            {t("eventLive")}
                          </div>
                        )}
                        {event.status === "rejected" && (
                          <div className="flex items-center gap-2 text-red-400 text-xs">
                            <XCircle className="w-4 h-4" />
                            {t("eventRejected")}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowRejectModal(null)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-2xl bg-[#0A0A0B] border border-white/10 p-6"
            >
              <button onClick={() => setShowRejectModal(null)} className="absolute top-4 right-4 text-white/30 hover:text-white">
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{t("rejectTitle")}</h3>
                  <p className="text-[11px] text-white/40">{t("rejectDesc")}</p>
                </div>
              </div>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder={t("rejectReasonPlaceholder")}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-red-500/50 resize-none mb-4"
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowRejectModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-white/50 hover:text-white transition-colors"
                >
                  {t("cancel")}
                </button>
                <button
                  onClick={() => handleReject(showRejectModal)}
                  className="px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors"
                >
                  {t("confirmReject")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
