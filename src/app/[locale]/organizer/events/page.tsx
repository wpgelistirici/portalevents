"use client";

import { useTranslations, useLocale } from "next-intl";
import { useOrganizer } from "@/lib/organizer-context";
import Link from "next/link";
import { useState } from "react";
import {
  Plus,
  Search,
  CalendarPlus,
  MoreVertical,
  Pencil,
  Trash2,
  Zap,
  Send,
  Eye,
  Copy,
  LayoutGrid,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { EventStatus } from "@/lib/data";

const statusTabs: (EventStatus | "all")[] = ["all", "draft", "pending_approval", "approved", "rejected", "cancelled"];

export default function OrganizerEventsPage() {
  const t = useTranslations("OrganizerPanel");
  const locale = useLocale();
  const { organizerEvents, deleteEvent, submitForApproval, cloneEvent } = useOrganizer();
  const [activeTab, setActiveTab] = useState<EventStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "calendar">("grid");
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const filtered = organizerEvents.filter((e) => {
    const matchTab = activeTab === "all" || e.status === activeTab;
    const q = search.toLowerCase();
    const matchSearch = !search || e.title.toLowerCase().includes(q) || e.artist.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  const statusColors: Record<string, string> = {
    draft: "text-white/50 bg-white/5 border-white/10",
    pending_approval: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    approved: "text-green-400 bg-green-400/10 border-green-400/20",
    rejected: "text-red-400 bg-red-400/10 border-red-400/20",
    cancelled: "text-white/30 bg-white/5 border-white/10",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{t("events.title")}</h1>
          <p className="text-white/50 text-sm mt-1">{t("events.subtitle")}</p>
        </div>
        <Link
          href={`/${locale}/organizer/events/new`}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FF2D55] text-white font-medium hover:bg-[#FF2D55]/80 transition-all"
        >
          <Plus className="w-5 h-5" />
          {t("events.newEvent")}
        </Link>
      </div>

      {/* Search & View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("events.searchPlaceholder")}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF2D55]/50 transition-colors"
          />
        </div>
        <div className="flex rounded-xl border border-white/10 overflow-hidden">
          <button onClick={() => setViewMode("grid")} className={`px-3 py-2 flex items-center gap-1.5 text-sm transition-colors ${viewMode === "grid" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"}`}>
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button onClick={() => setViewMode("calendar")} className={`px-3 py-2 flex items-center gap-1.5 text-sm transition-colors ${viewMode === "calendar" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"}`}>
            <CalendarDays className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {statusTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab
                ? "bg-white/10 text-white border border-white/20"
                : "text-white/40 hover:text-white/60 hover:bg-white/5"
            }`}
          >
            {t(`status.${tab}`)}
            {tab !== "all" && (
              <span className="ml-2 text-xs opacity-60">
                ({organizerEvents.filter((e) => e.status === tab).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Calendar View */}
      {viewMode === "calendar" && (() => {
        const year = calendarMonth.getFullYear();
        const month = calendarMonth.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const offset = firstDay === 0 ? 6 : firstDay - 1;
        const cells = Array.from({ length: 42 }, (_, i) => {
          const day = i - offset + 1;
          if (day < 1 || day > daysInMonth) return null;
          return day;
        });
        const calStatusColors: Record<string, string> = { draft: "bg-white/20", pending_approval: "bg-yellow-400", approved: "bg-green-400", rejected: "bg-red-400", cancelled: "bg-white/10" };

        return (
          <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setCalendarMonth(new Date(year, month - 1))} className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5"><ChevronLeft className="w-4 h-4" /></button>
              <span className="text-white font-semibold">{calendarMonth.toLocaleString("tr-TR", { month: "long", year: "numeric" })}</span>
              <button onClick={() => setCalendarMonth(new Date(year, month + 1))} className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5"><ChevronRight className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-xs text-white/30 mb-2">
              {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((d) => (<div key={d} className="text-center py-1">{d}</div>))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, i) => {
                if (day === null) return <div key={i} />;
                const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const dayEvents = organizerEvents.filter((e) => e.date?.includes(String(day)) || e.createdAt?.startsWith(dateStr));
                return (
                  <div key={i} className={`min-h-[60px] rounded-lg p-1 text-xs ${day === new Date().getDate() && month === new Date().getMonth() ? "bg-[#FF2D55]/10 border border-[#FF2D55]/20" : "bg-white/[0.02] border border-white/5"}`}>
                    <span className="text-white/50">{day}</span>
                    <div className="mt-0.5 space-y-0.5">
                      {dayEvents.slice(0, 2).map((ev) => (
                        <div key={ev.id} className="flex items-center gap-1">
                          <div className={`w-1.5 h-1.5 rounded-full ${calStatusColors[ev.status] || "bg-white/10"}`} />
                          <span className="text-[9px] text-white/60 truncate">{ev.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Events Grid */}
      {viewMode === "grid" && (filtered.length === 0 ? (
        <div className="text-center py-16">
          <CalendarPlus className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40">{t("events.noEvents")}</p>
          <Link
            href={`/${locale}/organizer/events/new`}
            className="inline-flex items-center gap-2 mt-4 text-[#FF2D55] hover:text-[#FF2D55]/80 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t("events.createFirst")}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((event) => (
            <div
              key={event.id}
              className="group rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl overflow-hidden hover:border-white/20 transition-all"
            >
              {/* Image */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium border ${statusColors[event.status]}`}>
                    {t(`status.${event.status}`)}
                  </span>
                </div>
                {event.dopings.filter((d) => d.status === "active").length > 0 && (
                  <div className="absolute top-3 right-3">
                    <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-[#7B61FF]/20 text-[#7B61FF] border border-[#7B61FF]/30">
                      <Zap className="w-3 h-3" />
                      Doping
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-white font-semibold truncate">{event.title}</h3>
                <p className="text-white/40 text-sm mt-1">{event.artist} — {event.venue}</p>
                <p className="text-white/30 text-xs mt-1">{event.date} · {event.time}</p>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
                  <Link
                    href={`/${locale}/organizer/events/${event.id}/edit`}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    {t("events.edit")}
                  </Link>
                  {event.status === "approved" && (
                    <Link
                      href={`/${locale}/organizer/events/${event.id}/doping`}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-[#7B61FF] hover:bg-[#7B61FF]/10 transition-colors"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      Doping
                    </Link>
                  )}
                  {event.status === "draft" && (
                    <button
                      onClick={() => submitForApproval(event.id)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-yellow-400 hover:bg-yellow-400/10 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {t("events.submitApproval")}
                    </button>
                  )}
                  <div className="relative ml-auto">
                    <button
                      onClick={() => setMenuOpen(menuOpen === event.id ? null : event.id)}
                      className="p-2 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {menuOpen === event.id && (
                      <div className="absolute right-0 top-full mt-1 w-40 rounded-xl bg-[#111] border border-white/10 shadow-xl z-10 overflow-hidden">
                        <Link
                          href={`/${locale}/events/${event.id}`}
                          className="flex items-center gap-2 px-4 py-3 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          {t("events.preview")}
                        </Link>
                        <button
                          onClick={() => {
                            cloneEvent(event.id);
                            setMenuOpen(null);
                          }}
                          className="flex items-center gap-2 px-4 py-3 text-sm text-white/60 hover:text-white hover:bg-white/5 w-full transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                          {t("events.clone")}
                        </button>
                        <button
                          onClick={() => {
                            deleteEvent(event.id);
                            setMenuOpen(null);
                          }}
                          className="flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-400/10 w-full transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          {t("events.delete")}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
