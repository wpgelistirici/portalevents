"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useOrganizer } from "@/lib/organizer-context";
import CustomSelect from "@/components/ui/CustomSelect";
import { Radio, Users, Ticket, CheckCircle2, XCircle, Maximize2, Minimize2 } from "lucide-react";
import { motion } from "framer-motion";

export default function LiveCheckinPage() {
  const t = useTranslations("OrganizerPanel.liveCheckin");
  const { organizerEvents, validationLogs, getAllTickets } = useOrganizer();
  const [selectedEventId, setSelectedEventId] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const approvedEvents = organizerEvents.filter((e) => e.status === "approved");
  const eventOptions = approvedEvents.map((e) => ({ value: e.id, label: e.title }));

  const allTickets = useMemo(() => getAllTickets(), [getAllTickets]);

  const eventData = useMemo(() => {
    if (!selectedEventId) return null;
    const event = organizerEvents.find((e) => e.id === selectedEventId);
    const tickets = allTickets.filter((t) => t.eventId === selectedEventId);
    const logs = validationLogs.filter((l) => l.eventId === selectedEventId);

    const totalQty = tickets.reduce((s, t) => s + t.quantity, 0);
    const checkedIn = tickets.filter((t) => t.status === "used").reduce((s, t) => s + t.quantity, 0);
    const cancelled = tickets.filter((t) => t.status === "cancelled").reduce((s, t) => s + t.quantity, 0);
    const remaining = totalQty - checkedIn - cancelled;
    const checkInRate = totalQty > 0 ? (checkedIn / totalQty) * 100 : 0;

    // Ticket type breakdown
    const typeMap = new Map<string, { total: number; used: number }>();
    tickets.forEach((tk) => {
      const e = typeMap.get(tk.ticketType) || { total: 0, used: 0 };
      e.total += tk.quantity;
      if (tk.status === "used") e.used += tk.quantity;
      typeMap.set(tk.ticketType, e);
    });

    return {
      event,
      totalQty,
      checkedIn,
      cancelled,
      remaining,
      checkInRate,
      recentLogs: logs.filter((l) => l.action === "approved").slice(0, 15),
      ticketTypes: Array.from(typeMap.entries()).map(([name, data]) => ({ name, ...data })),
    };
  }, [selectedEventId, organizerEvents, allTickets, validationLogs]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Radio className="w-7 h-7 text-[#7B61FF]" />
            {t("title")}
          </h1>
          <p className="text-white/50 mt-1">{t("subtitle")}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-64">
            <CustomSelect options={eventOptions} value={selectedEventId} onChange={setSelectedEventId} placeholder={t("selectEvent")} />
          </div>
          <button onClick={toggleFullscreen} className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors">
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {!selectedEventId ? (
        <div className="text-center py-24">
          <Radio className="w-16 h-16 text-white/10 mx-auto mb-4" />
          <p className="text-white/40 text-lg">{t("selectPrompt")}</p>
          <p className="text-white/20 text-sm mt-1">{t("selectPromptDesc")}</p>
        </div>
      ) : eventData ? (
        <div className="space-y-6">
          {/* Main Progress */}
          <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-8">
            <div className="text-center mb-6">
              <p className="text-white/50 text-sm">{eventData.event?.title}</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 text-sm font-medium">{t("live")}</span>
              </div>
            </div>

            {/* Big number */}
            <div className="text-center mb-8">
              <p className="text-7xl font-black text-white">{eventData.checkedIn}</p>
              <p className="text-white/40 mt-1">/ {eventData.totalQty} {t("checkedIn")}</p>
            </div>

            {/* Progress bar */}
            <div className="h-6 rounded-full bg-white/5 overflow-hidden mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${eventData.checkInRate}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-[#7B61FF] to-[#FF6B6B]"
              />
            </div>
            <p className="text-center text-white/50 text-sm">{eventData.checkInRate.toFixed(1)}% {t("checkInRate")}</p>
          </div>

          {/* KPI Row */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: t("remaining"), value: eventData.remaining, icon: Ticket, color: "text-amber-400", bg: "bg-amber-500/10" },
              { label: t("entered"), value: eventData.checkedIn, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
              { label: t("cancelledTickets"), value: eventData.cancelled, icon: XCircle, color: "text-red-400", bg: "bg-red-500/10" },
            ].map((kpi, i) => (
              <div key={i} className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-5 text-center">
                <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center mx-auto mb-3`}>
                  <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
                <p className={`text-3xl font-bold ${kpi.color}`}>{kpi.value}</p>
                <p className="text-xs text-white/40 mt-1">{kpi.label}</p>
              </div>
            ))}
          </div>

          {/* Ticket Type Distribution + Recent Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ticket Types */}
            <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6">
              <h3 className="text-sm font-semibold text-white mb-4">{t("byTicketType")}</h3>
              <div className="space-y-3">
                {eventData.ticketTypes.map((tt) => {
                  const pct = tt.total > 0 ? (tt.used / tt.total) * 100 : 0;
                  return (
                    <div key={tt.name}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-white">{tt.name}</span>
                        <span className="text-white/40">{tt.used}/{tt.total}</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-[#7B61FF]" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Check-ins */}
            <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#7B61FF]" />
                {t("recentEntries")}
              </h3>
              {eventData.recentLogs.length === 0 ? (
                <p className="text-white/30 text-sm py-4 text-center">{t("noEntries")}</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
                  {eventData.recentLogs.map((log) => (
                    <div key={log.id} className="flex items-center gap-3 py-2 px-3 rounded-lg bg-white/[0.02]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{log.ticketHolderName}</p>
                        <p className="text-[10px] text-white/30">{log.ticketType}</p>
                      </div>
                      <span className="text-[10px] text-white/20">
                        {new Date(log.validatedAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
