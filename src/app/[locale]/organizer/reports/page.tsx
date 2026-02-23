"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useOrganizer } from "@/lib/organizer-context";
import CustomSelect from "@/components/ui/CustomSelect";
import {
  BarChart3,
  Ticket,
  Users,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Calendar,
  Clock,
  Download,
  ChevronDown,
  ChevronUp,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  PieChart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ============================================
   HELPERS
   ============================================ */

function parseCurrencyToNumber(price: string): number {
  // Remove everything except digits — commas/dots are thousands separators, not decimals
  return parseInt(price.replace(/[^\d]/g, ""), 10) || 0;
}

function formatCurrency(amount: number): string {
  return `₺${amount.toLocaleString("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function formatPercent(value: number): string {
  if (isNaN(value) || !isFinite(value)) return "0%";
  return `${value.toFixed(1)}%`;
}

/* ============================================
   PAGE
   ============================================ */

export default function ReportsPage() {
  const t = useTranslations("OrganizerPanel.reports");
  const {
    organizerEvents,
    validationLogs,
    getAllTickets,
  } = useOrganizer();

  const [selectedEventId, setSelectedEventId] = useState<string>("all");
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  const allTickets = useMemo(() => getAllTickets(), [getAllTickets]);

  // Filter by selected event
  const filteredTickets = useMemo(() => {
    if (selectedEventId === "all") return allTickets;
    return allTickets.filter((t) => t.eventId === selectedEventId);
  }, [allTickets, selectedEventId]);

  const filteredLogs = useMemo(() => {
    if (selectedEventId === "all") return validationLogs;
    return validationLogs.filter((l) => l.eventId === selectedEventId);
  }, [validationLogs, selectedEventId]);

  /* ---- GLOBAL STATS ---- */
  const globalStats = useMemo(() => {
    const totalTickets = filteredTickets.reduce((s, tk) => s + tk.quantity, 0);
    const totalRevenue = filteredTickets.reduce((s, tk) => s + parseCurrencyToNumber(tk.totalPaid), 0);
    const activeTickets = filteredTickets.filter((tk) => tk.status === "active");
    const usedTickets = filteredTickets.filter((tk) => tk.status === "used");
    const cancelledTickets = filteredTickets.filter((tk) => tk.status === "cancelled");

    const approvedLogs = filteredLogs.filter((l) => l.action === "approved");
    const cancelledLogs = filteredLogs.filter((l) => l.action === "cancelled");
    const refundedLogs = filteredLogs.filter((l) => l.action === "refunded");

    const checkInRate = totalTickets > 0
      ? (usedTickets.reduce((s, tk) => s + tk.quantity, 0) / totalTickets) * 100
      : 0;

    return {
      totalTickets,
      totalRevenue,
      activeCount: activeTickets.reduce((s, tk) => s + tk.quantity, 0),
      usedCount: usedTickets.reduce((s, tk) => s + tk.quantity, 0),
      cancelledCount: cancelledTickets.reduce((s, tk) => s + tk.quantity, 0),
      approvedLogs: approvedLogs.length,
      cancelledLogs: cancelledLogs.length,
      refundedLogs: refundedLogs.length,
      checkInRate,
      uniqueBuyers: new Set(filteredTickets.map((tk) => tk.buyerEmail)).size,
    };
  }, [filteredTickets, filteredLogs]);

  /* ---- PER-EVENT BREAKDOWN ---- */
  const eventBreakdown = useMemo(() => {
    const eventIds = selectedEventId === "all"
      ? [...new Set(allTickets.map((t) => t.eventId))]
      : [selectedEventId];

    return eventIds.map((eventId) => {
      const eventTickets = allTickets.filter((t) => t.eventId === eventId);
      const eventLogs = validationLogs.filter((l) => l.eventId === eventId);
      const firstTicket = eventTickets[0];
      const orgEvent = organizerEvents.find((e) => e.id === eventId);

      const totalQty = eventTickets.reduce((s, tk) => s + tk.quantity, 0);
      const revenue = eventTickets.reduce((s, tk) => s + parseCurrencyToNumber(tk.totalPaid), 0);
      const activeQty = eventTickets.filter((tk) => tk.status === "active").reduce((s, tk) => s + tk.quantity, 0);
      const usedQty = eventTickets.filter((tk) => tk.status === "used").reduce((s, tk) => s + tk.quantity, 0);
      const cancelledQty = eventTickets.filter((tk) => tk.status === "cancelled").reduce((s, tk) => s + tk.quantity, 0);
      const checkInRate = totalQty > 0 ? (usedQty / totalQty) * 100 : 0;

      // Ticket type breakdown
      const typeMap = new Map<string, { qty: number; revenue: number }>();
      eventTickets.forEach((tk) => {
        const existing = typeMap.get(tk.ticketType) || { qty: 0, revenue: 0 };
        typeMap.set(tk.ticketType, {
          qty: existing.qty + tk.quantity,
          revenue: existing.revenue + parseCurrencyToNumber(tk.totalPaid),
        });
      });

      return {
        eventId,
        eventTitle: firstTicket?.eventTitle || orgEvent?.title || eventId,
        venue: firstTicket?.venue || orgEvent?.venue || "-",
        date: firstTicket?.date || "-",
        image: firstTicket?.image || orgEvent?.image || "",
        status: orgEvent?.status || "approved",
        totalQty,
        revenue,
        activeQty,
        usedQty,
        cancelledQty,
        checkInRate,
        uniqueBuyers: new Set(eventTickets.map((tk) => tk.buyerEmail)).size,
        ticketTypes: Array.from(typeMap.entries()).map(([name, data]) => ({
          name,
          ...data,
        })),
        logs: eventLogs,
      };
    }).sort((a, b) => b.revenue - a.revenue);
  }, [allTickets, validationLogs, organizerEvents, selectedEventId]);

  /* ---- TICKET TYPE DISTRIBUTION ---- */
  const ticketTypeDistribution = useMemo(() => {
    const typeMap = new Map<string, { qty: number; revenue: number }>();
    filteredTickets.forEach((tk) => {
      const existing = typeMap.get(tk.ticketType) || { qty: 0, revenue: 0 };
      typeMap.set(tk.ticketType, {
        qty: existing.qty + tk.quantity,
        revenue: existing.revenue + parseCurrencyToNumber(tk.totalPaid),
      });
    });
    return Array.from(typeMap.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.qty - a.qty);
  }, [filteredTickets]);

  /* ---- RECENT ACTIVITY ---- */
  const recentActivity = useMemo(() => {
    return filteredLogs.slice(0, 10);
  }, [filteredLogs]);

  /* ---- EVENT SELECT OPTIONS ---- */
  const eventOptions = useMemo(() => {
    const uniqueEvents = new Map<string, string>();
    allTickets.forEach((t) => uniqueEvents.set(t.eventId, t.eventTitle));
    organizerEvents.forEach((e) => uniqueEvents.set(e.id, e.title));
    return [
      { value: "all", label: t("allEvents") },
      ...Array.from(uniqueEvents.entries()).map(([id, title]) => ({
        value: id,
        label: title,
      })),
    ];
  }, [allTickets, organizerEvents, t]);

  /* ---- CSV EXPORT ---- */
  const exportCSV = () => {
    const headers = [
      t("csv.eventTitle"),
      t("csv.ticketId"),
      t("csv.buyerName"),
      t("csv.buyerEmail"),
      t("csv.ticketType"),
      t("csv.price"),
      t("csv.quantity"),
      t("csv.totalPaid"),
      t("csv.purchaseDate"),
      t("csv.status"),
    ];
    const rows = filteredTickets.map((tk) => [
      tk.eventTitle,
      tk.id,
      tk.buyerName,
      tk.buyerEmail,
      tk.ticketType,
      tk.ticketPrice,
      tk.quantity,
      tk.totalPaid,
      tk.purchaseDate,
      tk.status,
    ]);

    const csvContent = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const bom = "\uFEFF";
    const blob = new Blob([bom + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rapor_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ---- STATUS BAR COLORS ---- */
  const statusColors = {
    active: "bg-emerald-500",
    used: "bg-blue-500",
    cancelled: "bg-red-500",
  };

  const TYPE_COLORS = [
    "bg-[#FF2D55]",
    "bg-violet-500",
    "bg-amber-500",
    "bg-emerald-500",
    "bg-cyan-500",
    "bg-rose-500",
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-[#FF2D55]" />
            {t("title")}
          </h1>
          <p className="text-white/50 mt-1">{t("subtitle")}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-64">
            <CustomSelect
              options={eventOptions}
              value={selectedEventId}
              onChange={(v) => setSelectedEventId(v)}
              searchable={false}
            />
          </div>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-colors"
          >
            <Download className="w-4 h-4" />
            {t("exportCsv")}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: t("kpi.totalSold"),
            value: globalStats.totalTickets.toString(),
            icon: Ticket,
            color: "text-[#FF2D55]",
            bgColor: "bg-[#FF2D55]/10",
          },
          {
            label: t("kpi.totalRevenue"),
            value: formatCurrency(globalStats.totalRevenue),
            icon: DollarSign,
            color: "text-emerald-400",
            bgColor: "bg-emerald-500/10",
          },
          {
            label: t("kpi.checkInRate"),
            value: formatPercent(globalStats.checkInRate),
            icon: TrendingUp,
            color: "text-blue-400",
            bgColor: "bg-blue-500/10",
          },
          {
            label: t("kpi.uniqueBuyers"),
            value: globalStats.uniqueBuyers.toString(),
            icon: Users,
            color: "text-violet-400",
            bgColor: "bg-violet-500/10",
          },
        ].map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-white/50 uppercase tracking-wider">{kpi.label}</span>
              <div className={`w-9 h-9 rounded-xl ${kpi.bgColor} flex items-center justify-center`}>
                <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{kpi.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Ticket Status + Validation Summary Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ticket Status Distribution */}
        <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-[#FF2D55]" />
            {t("ticketStatus.title")}
          </h3>

          {/* Visual bar */}
          {globalStats.totalTickets > 0 ? (
            <>
              <div className="h-4 rounded-full overflow-hidden flex mb-5">
                {globalStats.activeCount > 0 && (
                  <div
                    className={`${statusColors.active} transition-all duration-500`}
                    style={{ width: `${(globalStats.activeCount / globalStats.totalTickets) * 100}%` }}
                  />
                )}
                {globalStats.usedCount > 0 && (
                  <div
                    className={`${statusColors.used} transition-all duration-500`}
                    style={{ width: `${(globalStats.usedCount / globalStats.totalTickets) * 100}%` }}
                  />
                )}
                {globalStats.cancelledCount > 0 && (
                  <div
                    className={`${statusColors.cancelled} transition-all duration-500`}
                    style={{ width: `${(globalStats.cancelledCount / globalStats.totalTickets) * 100}%` }}
                  />
                )}
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: t("ticketStatus.active"), count: globalStats.activeCount, color: "bg-emerald-500", textColor: "text-emerald-400" },
                  { label: t("ticketStatus.used"), count: globalStats.usedCount, color: "bg-blue-500", textColor: "text-blue-400" },
                  { label: t("ticketStatus.cancelled"), count: globalStats.cancelledCount, color: "bg-red-500", textColor: "text-red-400" },
                ].map((status, i) => (
                  <div key={i} className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <div className={`w-2.5 h-2.5 rounded-full ${status.color}`} />
                      <span className="text-xs text-white/50">{status.label}</span>
                    </div>
                    <p className={`text-lg font-bold ${status.textColor}`}>{status.count}</p>
                    <p className="text-[10px] text-white/30">
                      {formatPercent((status.count / globalStats.totalTickets) * 100)}
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-white/30">
              <Ticket className="w-8 h-8 mb-2" />
              <p className="text-sm">{t("noData")}</p>
            </div>
          )}
        </div>

        {/* Validation Actions Summary */}
        <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#FF2D55]" />
            {t("validation.title")}
          </h3>
          {filteredLogs.length > 0 ? (
            <div className="space-y-4">
              {[
                {
                  label: t("validation.approved"),
                  count: globalStats.approvedLogs,
                  icon: CheckCircle2,
                  color: "text-emerald-400",
                  bgColor: "bg-emerald-500/10",
                  borderColor: "border-emerald-500/20",
                },
                {
                  label: t("validation.cancelled"),
                  count: globalStats.cancelledLogs,
                  icon: XCircle,
                  color: "text-red-400",
                  bgColor: "bg-red-500/10",
                  borderColor: "border-red-500/20",
                },
                {
                  label: t("validation.refunded"),
                  count: globalStats.refundedLogs,
                  icon: RotateCcw,
                  color: "text-amber-400",
                  bgColor: "bg-amber-500/10",
                  borderColor: "border-amber-500/20",
                },
              ].map((item, i) => (
                <div key={i} className={`flex items-center justify-between p-4 rounded-xl ${item.bgColor} border ${item.borderColor}`}>
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                    <span className="text-sm font-medium text-white">{item.label}</span>
                  </div>
                  <span className={`text-xl font-bold ${item.color}`}>{item.count}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-white/40">{t("validation.total")}</span>
                <span className="text-sm font-semibold text-white">{filteredLogs.length}</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-white/30">
              <CheckCircle2 className="w-8 h-8 mb-2" />
              <p className="text-sm">{t("noValidation")}</p>
            </div>
          )}
        </div>
      </div>

      {/* Ticket Type Distribution */}
      {ticketTypeDistribution.length > 0 && (
        <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
            <Ticket className="w-4 h-4 text-[#FF2D55]" />
            {t("ticketTypes.title")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ticketTypeDistribution.map((type, idx) => {
              const pct = globalStats.totalTickets > 0
                ? (type.qty / globalStats.totalTickets) * 100
                : 0;
              return (
                <div key={type.name} className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-3 h-3 rounded-full ${TYPE_COLORS[idx % TYPE_COLORS.length]}`} />
                    <span className="text-sm font-medium text-white">{type.name}</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xl font-bold text-white">{type.qty}</p>
                      <p className="text-[10px] text-white/40">{t("ticketTypes.tickets")}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-emerald-400">{formatCurrency(type.revenue)}</p>
                      <p className="text-[10px] text-white/40">{formatPercent(pct)}</p>
                    </div>
                  </div>
                  {/* Mini bar */}
                  <div className="mt-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                      className={`h-full rounded-full ${TYPE_COLORS[idx % TYPE_COLORS.length]}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Per-Event Breakdown */}
      <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#FF2D55]" />
          {t("eventBreakdown.title")}
        </h3>

        {eventBreakdown.length > 0 ? (
          <div className="space-y-3">
            {eventBreakdown.map((ev) => {
              const isExpanded = expandedEvent === ev.eventId;
              return (
                <div key={ev.eventId} className="rounded-xl border border-white/5 overflow-hidden">
                  {/* Event Header - Clickable */}
                  <button
                    onClick={() => setExpandedEvent(isExpanded ? null : ev.eventId)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors text-left"
                  >
                    {/* Image */}
                    {ev.image && (
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                        <img src={ev.image} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-white truncate">{ev.eventTitle}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          ev.status === "approved"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : ev.status === "pending_approval"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-white/5 text-white/40 border border-white/10"
                        }`}>
                          {ev.status}
                        </span>
                      </div>
                      <p className="text-xs text-white/40">{ev.venue} &middot; {ev.date}</p>
                    </div>
                    <div className="flex items-center gap-6 flex-shrink-0">
                      <div className="text-right">
                        <p className="text-sm font-bold text-white">{ev.totalQty}</p>
                        <p className="text-[10px] text-white/40">{t("eventBreakdown.sold")}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-emerald-400">{formatCurrency(ev.revenue)}</p>
                        <p className="text-[10px] text-white/40">{t("eventBreakdown.revenue")}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-blue-400">{formatPercent(ev.checkInRate)}</p>
                        <p className="text-[10px] text-white/40">{t("eventBreakdown.checkIn")}</p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-white/30" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-white/30" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Detail */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-0 space-y-4">
                          <div className="h-px bg-white/5" />

                          {/* Status Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
                              <div className="flex items-center gap-1.5 mb-1">
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="text-[10px] text-white/40">{t("ticketStatus.active")}</span>
                              </div>
                              <p className="text-lg font-bold text-emerald-400">{ev.activeQty}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
                              <div className="flex items-center gap-1.5 mb-1">
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                <span className="text-[10px] text-white/40">{t("ticketStatus.used")}</span>
                              </div>
                              <p className="text-lg font-bold text-blue-400">{ev.usedQty}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
                              <div className="flex items-center gap-1.5 mb-1">
                                <div className="w-2 h-2 rounded-full bg-red-500" />
                                <span className="text-[10px] text-white/40">{t("ticketStatus.cancelled")}</span>
                              </div>
                              <p className="text-lg font-bold text-red-400">{ev.cancelledQty}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
                              <div className="flex items-center gap-1.5 mb-1">
                                <Users className="w-3 h-3 text-white/30" />
                                <span className="text-[10px] text-white/40">{t("eventBreakdown.buyers")}</span>
                              </div>
                              <p className="text-lg font-bold text-violet-400">{ev.uniqueBuyers}</p>
                            </div>
                          </div>

                          {/* Ticket Type Breakdown */}
                          {ev.ticketTypes.length > 0 && (
                            <div>
                              <p className="text-xs font-medium text-white/50 mb-2">{t("ticketTypes.title")}</p>
                              <div className="space-y-2">
                                {ev.ticketTypes.map((tt, idx) => (
                                  <div key={tt.name} className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/[0.02]">
                                    <div className="flex items-center gap-2">
                                      <div className={`w-2 h-2 rounded-full ${TYPE_COLORS[idx % TYPE_COLORS.length]}`} />
                                      <span className="text-sm text-white">{tt.name}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <span className="text-xs text-white/50">
                                        {tt.qty} {t("ticketTypes.tickets")}
                                      </span>
                                      <span className="text-sm font-semibold text-emerald-400">
                                        {formatCurrency(tt.revenue)}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Recent Logs for this event */}
                          {ev.logs.length > 0 && (
                            <div>
                              <p className="text-xs font-medium text-white/50 mb-2">{t("eventBreakdown.recentActions")}</p>
                              <div className="space-y-1.5 max-h-40 overflow-y-auto scrollbar-hide">
                                {ev.logs.slice(0, 5).map((log) => (
                                  <div key={log.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/[0.02]">
                                    <div className="flex items-center gap-2">
                                      {log.action === "approved" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                                      {log.action === "cancelled" && <XCircle className="w-3.5 h-3.5 text-red-400" />}
                                      {log.action === "refunded" && <RotateCcw className="w-3.5 h-3.5 text-amber-400" />}
                                      <span className="text-xs text-white">{log.ticketHolderName}</span>
                                      <span className="text-[10px] text-white/30">{log.ticketType}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                                        log.action === "approved"
                                          ? "bg-emerald-500/10 text-emerald-400"
                                          : log.action === "cancelled"
                                            ? "bg-red-500/10 text-red-400"
                                            : "bg-amber-500/10 text-amber-400"
                                      }`}>
                                        {t(`validation.${log.action}`)}
                                      </span>
                                      <span className="text-[10px] text-white/20">
                                        {new Date(log.validatedAt).toLocaleDateString("tr-TR")}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-white/30">
            <Calendar className="w-8 h-8 mb-2" />
            <p className="text-sm">{t("noData")}</p>
          </div>
        )}
      </div>

      {/* Recent Activity Log */}
      {recentActivity.length > 0 && (
        <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#FF2D55]" />
            {t("recentActivity.title")}
          </h3>
          <div className="space-y-2">
            {recentActivity.map((log) => (
              <div key={log.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  log.action === "approved"
                    ? "bg-emerald-500/10"
                    : log.action === "cancelled"
                      ? "bg-red-500/10"
                      : "bg-amber-500/10"
                }`}>
                  {log.action === "approved" && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  {log.action === "cancelled" && <XCircle className="w-4 h-4 text-red-400" />}
                  {log.action === "refunded" && <RotateCcw className="w-4 h-4 text-amber-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">
                    <span className="font-medium">{log.ticketHolderName}</span>
                    <span className="text-white/40"> &middot; </span>
                    <span className="text-white/60">{log.eventTitle}</span>
                  </p>
                  <p className="text-xs text-white/30">
                    {log.ticketType} &middot; {t("recentActivity.by")} {log.validatedBy}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                    log.action === "approved"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : log.action === "cancelled"
                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}>
                    {t(`validation.${log.action}`)}
                  </span>
                  <p className="text-[10px] text-white/20 mt-1">
                    {new Date(log.validatedAt).toLocaleString("tr-TR", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
