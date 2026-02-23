"use client";

import { useTranslations } from "next-intl";
import { useOrganizer } from "@/lib/organizer-context";
import {
  Bell,
  CheckCircle2,
  XCircle,
  Ticket,
  RotateCcw,
  Zap,
  Music2,
  CheckCheck,
} from "lucide-react";

const typeIcons: Record<string, typeof Bell> = {
  event_approved: CheckCircle2,
  event_rejected: XCircle,
  ticket_sold: Ticket,
  ticket_cancelled: XCircle,
  ticket_refunded: RotateCcw,
  doping_expiring: Zap,
  artist_request_update: Music2,
};

const typeColors: Record<string, string> = {
  event_approved: "bg-emerald-500/10 text-emerald-400",
  event_rejected: "bg-red-500/10 text-red-400",
  ticket_sold: "bg-blue-500/10 text-blue-400",
  ticket_cancelled: "bg-red-500/10 text-red-400",
  ticket_refunded: "bg-amber-500/10 text-amber-400",
  doping_expiring: "bg-violet-500/10 text-violet-400",
  artist_request_update: "bg-cyan-500/10 text-cyan-400",
};

export default function NotificationsPage() {
  const t = useTranslations("OrganizerPanel.notifications");
  const { notifications, markNotificationRead, markAllNotificationsRead, unreadCount } = useOrganizer();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Bell className="w-7 h-7 text-[#FF2D55]" />
            {t("title")}
            {unreadCount > 0 && (
              <span className="ml-1 min-w-[24px] h-6 flex items-center justify-center px-2 rounded-full bg-[#FF2D55] text-white text-xs font-bold">{unreadCount}</span>
            )}
          </h1>
          <p className="text-white/50 mt-1">{t("subtitle")}</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllNotificationsRead} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-colors">
            <CheckCheck className="w-4 h-4" />
            {t("markAllRead")}
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16">
          <Bell className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40">{t("noNotifications")}</p>
          <p className="text-white/20 text-sm mt-1">{t("noNotificationsDesc")}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => {
            const Icon = typeIcons[n.type] || Bell;
            const colorClass = typeColors[n.type] || "bg-white/5 text-white/40";
            return (
              <button
                key={n.id}
                onClick={() => !n.isRead && markNotificationRead(n.id)}
                className={`w-full flex items-start gap-4 p-4 rounded-xl border transition-all text-left ${
                  n.isRead
                    ? "bg-white/[0.01] border-white/5 opacity-60"
                    : "bg-white/5 border-white/10 hover:bg-white/[0.07]"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white">{n.title}</p>
                    {!n.isRead && <div className="w-2 h-2 rounded-full bg-[#FF2D55]" />}
                  </div>
                  <p className="text-sm text-white/50 mt-0.5">{n.message}</p>
                </div>
                <span className="text-[10px] text-white/20 flex-shrink-0 mt-1">
                  {new Date(n.createdAt).toLocaleDateString("tr-TR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
