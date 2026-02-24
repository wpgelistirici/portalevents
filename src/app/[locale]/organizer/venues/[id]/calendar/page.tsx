"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useOrganizer } from "@/lib/organizer-context";
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, Music } from "lucide-react";
import Link from "next/link";

export default function VenueCalendarPage() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("OrganizerPanel.venueCalendar");
  const { organizerVenues, organizerEvents } = useOrganizer();

  const venue = organizerVenues.find((v) => v.id === params.id);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const venueEvents = useMemo(() => {
    if (!venue) return [];
    return organizerEvents.filter((e) => e.venue === venue.name);
  }, [venue, organizerEvents]);

  if (!venue) {
    return (
      <div className="text-center py-16">
        <p className="text-white/40">{t("venueNotFound")}</p>
      </div>
    );
  }

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const cells = Array.from({ length: 42 }, (_, i) => {
    const day = i - offset + 1;
    return day >= 1 && day <= daysInMonth ? day : null;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Calendar className="w-7 h-7 text-[#7B61FF]" />
            {t("title")}
          </h1>
          <p className="text-white/50 mt-1">{venue.name} — {t("subtitle")}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setCurrentMonth(new Date(year, month - 1))} className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5"><ChevronLeft className="w-5 h-5" /></button>
          <span className="text-lg font-semibold text-white">{currentMonth.toLocaleString("tr-TR", { month: "long", year: "numeric" })}</span>
          <button onClick={() => setCurrentMonth(new Date(year, month + 1))} className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5"><ChevronRight className="w-5 h-5" /></button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-sm text-white/30 mb-2">
          {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((d) => (<div key={d} className="text-center py-2">{d}</div>))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (day === null) return <div key={i} />;
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const dayEvents = venueEvents.filter((e) => {
              return e.date?.includes(String(day)) || e.createdAt?.startsWith(dateStr);
            });
            const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
            return (
              <div key={i} className={`min-h-[80px] rounded-xl p-2 ${isToday ? "bg-[#7B61FF]/10 border border-[#7B61FF]/20" : "bg-white/[0.02] border border-white/5"}`}>
                <span className={`text-xs ${isToday ? "text-[#7B61FF] font-bold" : "text-white/40"}`}>{day}</span>
                <div className="mt-1 space-y-1">
                  {dayEvents.map((ev) => (
                    <div key={ev.id} className="flex items-center gap-1.5 px-1.5 py-1 rounded bg-white/[0.04]">
                      <Music className="w-3 h-3 text-[#7B61FF] flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] text-white truncate">{ev.artist}</p>
                        <p className="text-[9px] text-white/30">{ev.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Events List */}
      <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4">{t("upcomingEvents")}</h3>
        {venueEvents.length === 0 ? (
          <p className="text-white/30 text-sm py-4 text-center">{t("noEvents")}</p>
        ) : (
          <div className="space-y-2">
            {venueEvents.map((ev) => (
              <div key={ev.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02]">
                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                  <img src={ev.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{ev.title}</p>
                  <p className="text-xs text-white/40">{ev.artist} · {ev.date} · {ev.time}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${ev.status === "approved" ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-white/40"}`}>{ev.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
