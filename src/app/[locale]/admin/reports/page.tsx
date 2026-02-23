"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useOrganizer } from "@/lib/organizer-context";
import { events, artists, venues } from "@/lib/data";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Ticket,
  MapPin,
  Music,
  Calendar,
  Users,
  Globe,
  Zap,
} from "lucide-react";

export default function AdminReportsPage() {
  const t = useTranslations("AdminPanel.reports");
  const { organizerEvents, getAllTickets } = useOrganizer();

  const allTickets = useMemo(() => getAllTickets(), [getAllTickets]);

  const totalRevenue = useMemo(() => {
    return allTickets.reduce((sum, tk) => sum + (parseInt(tk.totalPaid.replace(/[^\d]/g, ""), 10) || 0), 0);
  }, [allTickets]);

  // Genre distribution
  const genreStats = useMemo(() => {
    const map = new Map<string, number>();
    events.forEach((e) => {
      map.set(e.genre, (map.get(e.genre) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([genre, count]) => ({ genre, count, pct: Math.round((count / events.length) * 100) }))
      .sort((a, b) => b.count - a.count);
  }, []);

  // City distribution
  const cityStats = useMemo(() => {
    const map = new Map<string, number>();
    events.forEach((e) => {
      map.set(e.city, (map.get(e.city) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([city, count]) => ({ city, count, pct: Math.round((count / events.length) * 100) }))
      .sort((a, b) => b.count - a.count);
  }, []);

  // Venue popularity
  const venueStats = useMemo(() => {
    const map = new Map<string, number>();
    events.forEach((e) => {
      map.set(e.venue, (map.get(e.venue) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([venue, count]) => ({ venue, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, []);

  // Ticket type distribution
  const ticketTypeStats = useMemo(() => {
    const map = new Map<string, { count: number; revenue: number }>();
    allTickets.forEach((tk) => {
      const existing = map.get(tk.ticketType) || { count: 0, revenue: 0 };
      existing.count += tk.quantity;
      existing.revenue += parseInt(tk.totalPaid.replace(/[^\d]/g, ""), 10) || 0;
      map.set(tk.ticketType, existing);
    });
    return Array.from(map.entries())
      .map(([type, data]) => ({ type, ...data }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [allTickets]);

  const barColors = ["bg-red-400", "bg-blue-400", "bg-emerald-400", "bg-amber-400", "bg-purple-400", "bg-cyan-400", "bg-pink-400"];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <BarChart3 className="w-7 h-7 text-red-400" />
          {t("title")}
        </h1>
        <p className="text-white/40 text-sm mt-1">{t("subtitle")}</p>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t("totalRevenue"), value: `₺${totalRevenue.toLocaleString("tr-TR")}`, icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: t("ticketsSold"), value: allTickets.reduce((s, tk) => s + tk.quantity, 0).toString(), icon: Ticket, color: "text-pink-400", bg: "bg-pink-500/10" },
          { label: t("totalEvents"), value: events.length.toString(), icon: Calendar, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: t("avgPrice"), value: `₺${Math.round(events.reduce((s, e) => s + (parseInt(e.price.replace(/[^\d]/g, ""), 10) || 0), 0) / events.length).toLocaleString("tr-TR")}`, icon: TrendingUp, color: "text-amber-400", bg: "bg-amber-500/10" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] text-white/40 uppercase tracking-wider">{stat.label}</span>
              <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-[18px] h-[18px] ${stat.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Genre Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6"
        >
          <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
            <Music className="w-4 h-4 text-red-400" />
            {t("genreDistribution")}
          </h3>
          <div className="space-y-3">
            {genreStats.map((g, i) => (
              <div key={g.genre}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-white/70">{g.genre}</span>
                  <span className="text-xs text-white/40">{g.count} ({g.pct}%)</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${g.pct}%` }}
                    transition={{ delay: 0.3 + i * 0.05, duration: 0.6 }}
                    className={`h-full rounded-full ${barColors[i % barColors.length]}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* City Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6"
        >
          <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
            <Globe className="w-4 h-4 text-red-400" />
            {t("cityDistribution")}
          </h3>
          <div className="space-y-3">
            {cityStats.map((c, i) => (
              <div key={c.city}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-white/70 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-white/30" /> {c.city}
                  </span>
                  <span className="text-xs text-white/40">{c.count} ({c.pct}%)</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${c.pct}%` }}
                    transition={{ delay: 0.35 + i * 0.05, duration: 0.6 }}
                    className={`h-full rounded-full ${barColors[(i + 2) % barColors.length]}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Venues */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6"
        >
          <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-400" />
            {t("topVenues")}
          </h3>
          <div className="space-y-2">
            {venueStats.map((v, i) => (
              <div key={v.venue} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02]">
                <span className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-bold text-white/40">
                  {i + 1}
                </span>
                <span className="text-xs text-white/70 flex-1">{v.venue}</span>
                <span className="text-xs font-semibold text-white/50">{v.count} {t("eventsLabel")}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Ticket Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6"
        >
          <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
            <Ticket className="w-4 h-4 text-red-400" />
            {t("ticketTypes")}
          </h3>
          {ticketTypeStats.length > 0 ? (
            <div className="space-y-3">
              {ticketTypeStats.map((tt, i) => (
                <div key={tt.type} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02]">
                  <div>
                    <p className="text-xs font-semibold text-white">{tt.type}</p>
                    <p className="text-[10px] text-white/30">{tt.count} {t("ticketsSoldLabel")}</p>
                  </div>
                  <p className="text-sm font-bold text-emerald-400">₺{tt.revenue.toLocaleString("tr-TR")}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-white/20 text-center py-6">{t("noTicketData")}</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
