"use client";

import { useTranslations } from "next-intl";
import { useOrganizer } from "@/lib/organizer-context";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
  CalendarPlus,
  Zap,
  Clock,
  Ticket,
  AlertTriangle,
  Plus,
  ArrowRight,
  CheckCircle,
  XCircle,
  RotateCcw,
} from "lucide-react";

export default function OrganizerDashboard() {
  const t = useTranslations("OrganizerPanel");
  const locale = useLocale();
  const { organizerEvents, validationLogs, stats } = useOrganizer();
  const { user } = useAuth();

  const pendingEvents = organizerEvents.filter((e) => e.status === "pending_approval");
  const recentEvents = [...organizerEvents].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  ).slice(0, 5);
  const recentLogs = validationLogs.slice(0, 5);

  const statusColors: Record<string, string> = {
    draft: "text-white/50 bg-white/5",
    pending_approval: "text-yellow-400 bg-yellow-400/10",
    approved: "text-green-400 bg-green-400/10",
    rejected: "text-red-400 bg-red-400/10",
    cancelled: "text-white/30 bg-white/5",
  };

  const actionIcons: Record<string, React.ReactNode> = {
    approved: <CheckCircle className="w-4 h-4 text-green-400" />,
    cancelled: <XCircle className="w-4 h-4 text-red-400" />,
    refunded: <RotateCcw className="w-4 h-4 text-yellow-400" />,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{t("dashboard.title")}</h1>
          <p className="text-white/50 mt-1">
            {t("dashboard.welcome", { name: user?.name || "" })}
          </p>
        </div>
        <Link
          href={`/${locale}/organizer/events/new`}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FF2D55] text-white font-medium hover:bg-[#FF2D55]/80 transition-all"
        >
          <Plus className="w-5 h-5" />
          {t("dashboard.newEvent")}
        </Link>
      </div>

      {/* Pending Approval Alert */}
      {pendingEvents.length > 0 && (
        <div className="relative overflow-hidden rounded-2xl border border-yellow-400/30 bg-yellow-400/5 backdrop-blur-xl p-6">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 to-transparent" />
          <div className="relative flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-400/10 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-yellow-400">
                {t("dashboard.pendingAlert", { count: pendingEvents.length })}
              </h3>
              <div className="mt-2 space-y-1">
                {pendingEvents.map((event) => (
                  <p key={event.id} className="text-white/70 text-sm">
                    &quot;{event.title}&quot; {t("dashboard.awaitingApproval")}
                  </p>
                ))}
              </div>
              <p className="text-white/40 text-xs mt-3">{t("dashboard.approvalNote")}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: t("dashboard.stats.totalEvents"),
            value: stats.totalEvents,
            icon: CalendarPlus,
            color: "#FF2D55",
          },
          {
            label: t("dashboard.stats.activeDopings"),
            value: stats.activeDopings,
            icon: Zap,
            color: "#7B61FF",
          },
          {
            label: t("dashboard.stats.pendingApproval"),
            value: stats.pendingApproval,
            icon: Clock,
            color: "#FFD600",
          },
          {
            label: t("dashboard.stats.ticketsSold"),
            value: stats.totalTicketsSold,
            icon: Ticket,
            color: "#00F0FF",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/[0.07] transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-white/50 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Events */}
        <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">{t("dashboard.recentEvents")}</h2>
            <Link
              href={`/${locale}/organizer/events`}
              className="text-sm text-[#FF2D55] hover:text-[#FF2D55]/80 flex items-center gap-1 transition-colors"
            >
              {t("dashboard.viewAll")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {recentEvents.length === 0 ? (
              <div className="p-8 text-center text-white/40">
                {t("dashboard.noEvents")}
              </div>
            ) : (
              recentEvents.map((event) => (
                <Link
                  key={event.id}
                  href={`/${locale}/organizer/events/${event.id}/edit`}
                  className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-white/10 overflow-hidden flex-shrink-0">
                      <img src={event.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{event.title}</p>
                      <p className="text-xs text-white/40">{event.date}</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[event.status]}`}
                  >
                    {t(`status.${event.status}`)}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Validation Logs */}
        <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">{t("dashboard.recentLogs")}</h2>
            <Link
              href={`/${locale}/organizer/logs`}
              className="text-sm text-[#FF2D55] hover:text-[#FF2D55]/80 flex items-center gap-1 transition-colors"
            >
              {t("dashboard.viewAll")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {recentLogs.length === 0 ? (
              <div className="p-8 text-center text-white/40">
                {t("dashboard.noLogs")}
              </div>
            ) : (
              recentLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3 min-w-0">
                    {actionIcons[log.action]}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {log.ticketHolderName}
                      </p>
                      <p className="text-xs text-white/40">{log.ticketType} — {log.eventTitle}</p>
                    </div>
                  </div>
                  <span className="text-xs text-white/30">
                    {new Date(log.validatedAt).toLocaleTimeString("tr-TR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
