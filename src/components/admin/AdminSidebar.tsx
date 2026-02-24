"use client";

import { usePathname, Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/auth-context";
import Image from "next/image";
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  MapPin,
  BarChart3,
  Settings,
  LogOut,
  Shield,
  ChevronLeft,
} from "lucide-react";

const navItems = [
  { key: "dashboard", href: "", icon: LayoutDashboard },
  { key: "events", href: "/events", icon: CalendarCheck },
  { key: "users", href: "/users", icon: Users },
  { key: "venues", href: "/venues", icon: MapPin },
  { key: "reports", href: "/reports", icon: BarChart3 },
  { key: "settings", href: "/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const t = useTranslations("AdminPanel.sidebar");
  const { user, logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#0A0A0B] border-r border-white/[0.04] flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-white/[0.04]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">PORTAL</h1>
            <p className="text-[10px] text-white/40 font-medium">{t("title")}</p>
          </div>
        </div>
      </div>

      {/* Back to site */}
      <Link
        href="/"
        className="flex items-center gap-2 px-6 py-3 text-xs text-white/30 hover:text-white/60 transition-colors border-b border-white/[0.04]"
        data-cursor-hover
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        {t("backToSite")}
      </Link>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <p className="px-3 text-[10px] text-white/20 uppercase tracking-widest font-semibold mb-2">
          {t("menu")}
        </p>
        {navItems.map((item) => {
          const fullHref = `/admin${item.href}` as const;
          const isActive =
            item.href === ""
              ? pathname === "/admin" || pathname === "/admin/"
              : pathname.startsWith(`/admin${item.href}`);

          return (
            <Link
              key={item.key}
              href={fullHref}
              data-cursor-hover
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-red-500/10 text-red-400 shadow-[inset_0_0_20px_rgba(239,68,68,0.05)]"
                  : "text-white/40 hover:text-white/70 hover:bg-white/[0.03]"
              }`}
            >
              <item.icon className={`w-[18px] h-[18px] ${isActive ? "text-red-400" : ""}`} />
              {t(item.key)}
            </Link>
          );
        })}
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-white/[0.04]">
        <div className="flex items-center gap-3 px-2 py-2">
          {user?.avatar && (
            <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-red-500/20 flex-shrink-0">
              <Image src={user.avatar} alt={user.name} fill className="object-cover" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
            <p className="text-[10px] text-white/30 truncate">{t("adminRole")}</p>
          </div>
          <button
            onClick={logout}
            data-cursor-hover
            className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/30 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
