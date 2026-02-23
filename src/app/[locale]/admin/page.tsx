"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useOrganizer } from "@/lib/organizer-context";
import { events, artists, venues } from "@/lib/data";
import { motion } from "framer-motion";
import {
  CalendarCheck,
  Users,
  MapPin,
  Music,
  TrendingUp,
  DollarSign,
  Ticket,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  BarChart3,
} from "lucide-react";

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  bg,
  trend,
  delay,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  trend?: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-xl p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] text-white/40 uppercase tracking-wider font-medium">{label}</span>
        <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
          <Icon className={`w-[18px] h-[18px] ${color}`} />
        </div>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      {trend && (
        <div className="flex items-center gap-1 mt-2">
          <TrendingUp className="w-3 h-3 text-emerald-400" />
          <span className="text-[10px] text-emerald-400 font-medium">{trend}</span>
        </div>
      )}
    </motion.div>
  );
}

export default function AdminDashboard() {
  const t = useTranslations("AdminPanel.dashboard");
  const { organizerEvents, organizerVenues, getAllTickets } = useOrganizer();

  const allTickets = useMemo(() => getAllTickets(), [getAllTickets]);

  const pendingEvents = organizerEvents.filter((e) => e.status === "pending_approval");
  const approvedEvents = organizerEvents.filter((e) => e.status === "approved");
  const rejectedEvents = organizerEvents.filter((e) => e.status === "rejected");

  const totalRevenue = useMemo(() => {
    return allTickets.reduce((sum, tk) => sum + (parseInt(tk.totalPaid.replace(/[^\d]/g, ""), 10) || 0), 0);
  }, [allTickets]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">{t("title")}</h1>
        <p className="text-white/40 text-sm mt-1">{t("subtitle")}</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label={t("totalEvents")}
          value={events.length.toString()}
          icon={CalendarCheck}
          color="text-blue-400"
          bg="bg-blue-500/10"
          trend="+12%"
          delay={0}
        />
        <StatCard
          label={t("totalUsers")}
          value="5"
          icon={Users}
          color="text-emerald-400"
          bg="bg-emerald-500/10"
          trend="+8%"
          delay={0.05}
        />
        <StatCard
          label={t("totalVenues")}
          value={venues.length.toString()}
          icon={MapPin}
          color="text-amber-400"
          bg="bg-amber-500/10"
          delay={0.1}
        />
        <StatCard
          label={t("totalArtists")}
          value={artists.length.toString()}
          icon={Music}
          color="text-purple-400"
          bg="bg-purple-500/10"
          delay={0.15}
        />
      </div>

      {/* Revenue and Tickets Row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label={t("totalRevenue")}
          value={`₺${totalRevenue.toLocaleString("tr-TR")}`}
          icon={DollarSign}
          color="text-emerald-400"
          bg="bg-emerald-500/10"
          trend="+24%"
          delay={0.2}
        />
        <StatCard
          label={t("ticketsSold")}
          value={allTickets.length.toString()}
          icon={Ticket}
          color="text-pink-400"
          bg="bg-pink-500/10"
          delay={0.25}
        />
        <StatCard
          label={t("organizerVenues")}
          value={organizerVenues.length.toString()}
          icon={MapPin}
          color="text-cyan-400"
          bg="bg-cyan-500/10"
          delay={0.3}
        />
      </div>

      {/* Event Approval Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Clock className="w-[18px] h-[18px] text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{t("pendingApproval")}</h3>
              <p className="text-[10px] text-white/30">{t("needsReview")}</p>
            </div>
            <span className="ml-auto text-2xl font-bold text-amber-400">{pendingEvents.length}</span>
          </div>
          {pendingEvents.length > 0 ? (
            <div className="space-y-2">
              {pendingEvents.slice(0, 3).map((event) => (
                <div key={event.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02]">
                  <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-white truncate">{event.title}</p>
                    <p className="text-[10px] text-white/30">{event.venue}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-white/20 text-center py-4">{t("noPending")}</p>
          )}
        </motion.div>

        {/* Approved Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-[18px] h-[18px] text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{t("approvedEvents")}</h3>
              <p className="text-[10px] text-white/30">{t("liveNow")}</p>
            </div>
            <span className="ml-auto text-2xl font-bold text-emerald-400">{approvedEvents.length}</span>
          </div>
          {approvedEvents.length > 0 ? (
            <div className="space-y-2">
              {approvedEvents.slice(0, 3).map((event) => (
                <div key={event.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-white truncate">{event.title}</p>
                    <p className="text-[10px] text-white/30">{event.venue}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-white/20 text-center py-4">{t("noApproved")}</p>
          )}
        </motion.div>

        {/* Rejected Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center">
              <XCircle className="w-[18px] h-[18px] text-red-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{t("rejectedEvents")}</h3>
              <p className="text-[10px] text-white/30">{t("declined")}</p>
            </div>
            <span className="ml-auto text-2xl font-bold text-red-400">{rejectedEvents.length}</span>
          </div>
          {rejectedEvents.length > 0 ? (
            <div className="space-y-2">
              {rejectedEvents.slice(0, 3).map((event) => (
                <div key={event.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02]">
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-white truncate">{event.title}</p>
                    <p className="text-[10px] text-white/30">{event.venue}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-white/20 text-center py-4">{t("noRejected")}</p>
          )}
        </motion.div>
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6"
      >
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-red-400" />
          {t("platformOverview")}
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: t("genres"), value: [...new Set(events.map((e) => e.genre))].length, color: "text-purple-400" },
            { label: t("cities"), value: [...new Set(events.map((e) => e.city))].length, color: "text-cyan-400" },
            { label: t("trendingEvents"), value: events.filter((e) => e.trending).length, color: "text-amber-400" },
            { label: t("totalOrganizers"), value: "1", color: "text-pink-400" },
            { label: t("avgTicketPrice"), value: `₺${Math.round(events.reduce((s, e) => s + (parseInt(e.price.replace(/[^\d]/g, ""), 10) || 0), 0) / events.length).toLocaleString("tr-TR")}`, color: "text-emerald-400" },
          ].map((stat, i) => (
            <div key={i} className="text-center py-3">
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] text-white/30 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
