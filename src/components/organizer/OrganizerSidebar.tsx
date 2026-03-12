"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useAuth } from "@/lib/auth-context";
import { useOrganizer } from "@/lib/organizer-context";
import {
  LayoutDashboard,
  CalendarPlus,
  MapPin,
  QrCode,
  FileText,
  BarChart3,
  ChevronLeft,
  LogOut,
  User,
  Tag,
  Music2,
  Users,
  Bell,
  Radio,
  Megaphone,
  Settings,
} from "lucide-react";

const navItems = [
  { key: "dashboard", href: "", icon: LayoutDashboard },
  { key: "events", href: "/events", icon: CalendarPlus },
  { key: "venues", href: "/venues", icon: MapPin },
  { key: "ticketValidation", href: "/ticket-validation", icon: QrCode },
  { key: "liveCheckin", href: "/live", icon: Radio },
  { key: "coupons", href: "/coupons", icon: Tag },
  { key: "customers", href: "/customers", icon: Users },
  { key: "artistRequests", href: "/artist-requests", icon: Music2 },
  { key: "announcements", href: "/announcements", icon: Megaphone },
  { key: "reports", href: "/reports", icon: BarChart3 },
  { key: "logs", href: "/logs", icon: FileText },
  { key: "notifications", href: "/notifications", icon: Bell },
  { key: "settings", href: "/settings", icon: Settings },
];

export default function OrganizerSidebar() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("OrganizerPanel");
  const { user, logout } = useAuth();
  const { unreadCount } = useOrganizer();
  const basePath = `/${locale}/organizer`;

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-foreground/10 bg-black/40 backdrop-blur-xl flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-foreground/10">
        <Link href={`/${locale}`} className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors mb-4">
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm">{t("backToSite")}</span>
        </Link>
        <h1 className="text-lg font-bold text-foreground">
          {t("panelTitle")}
        </h1>
        {user?.organizerProfile && (
          <p className="text-sm text-foreground/50 mt-1">{user.organizerProfile.organizerName}</p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const href = `${basePath}${item.href}`;
          const isActive =
            item.href === ""
              ? pathname === basePath || pathname === `${basePath}/`
              : pathname.startsWith(href);

          return (
            <Link
              key={item.key}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-foreground/10 text-foreground border border-foreground/10"
                  : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-[#7B61FF]" : ""}`} />
              <span className="flex-1">{t(`nav.${item.key}`)}</span>
              {item.key === "notifications" && unreadCount > 0 && (
                <span className="ml-auto min-w-[20px] h-5 flex items-center justify-center px-1.5 rounded-full bg-[#7B61FF] text-white text-[10px] font-bold">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-foreground/10">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <User className="w-4 h-4 text-foreground/60" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
            <p className="text-xs text-foreground/40 truncate">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-lg text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-colors"
            title={t("logout")}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
