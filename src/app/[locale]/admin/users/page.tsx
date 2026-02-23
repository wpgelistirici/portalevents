"use client";

import { useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Search,
  Users,
  Shield,
  User,
  Music2,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Calendar,
  Ban,
  CheckCircle2,
} from "lucide-react";
import type { UserRole } from "@/lib/auth-context";

interface StoredUserPublic {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone?: string;
  role: UserRole;
  organizerProfile?: {
    organizerId: string;
    organizerName: string;
    organizerLogo?: string;
    organizerDescription?: string;
  };
}

const USERS_STORAGE_KEY = "pulse_users_db";

function loadUsers(): StoredUserPublic[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored).map((u: Record<string, unknown>) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      avatar: u.avatar,
      phone: u.phone,
      role: u.role,
      organizerProfile: u.organizerProfile,
    }));
  } catch {
    return [];
  }
}

export default function AdminUsersPage() {
  const t = useTranslations("AdminPanel.users");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [users, setUsers] = useState<StoredUserPublic[]>([]);

  useEffect(() => {
    setUsers(loadUsers());
  }, []);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [users, search, roleFilter]);

  const counts = useMemo(() => ({
    all: users.length,
    user: users.filter((u) => u.role === "user").length,
    organizer: users.filter((u) => u.role === "organizer").length,
    admin: users.filter((u) => u.role === "admin").length,
  }), [users]);

  const roleIcon = (role: UserRole) => {
    switch (role) {
      case "admin": return <Shield className="w-3.5 h-3.5 text-red-400" />;
      case "organizer": return <Music2 className="w-3.5 h-3.5 text-amber-400" />;
      default: return <User className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  const roleBadge = (role: UserRole) => {
    const map: Record<UserRole, { bg: string; text: string }> = {
      admin: { bg: "bg-red-500/10", text: "text-red-400" },
      organizer: { bg: "bg-amber-500/10", text: "text-amber-400" },
      user: { bg: "bg-blue-500/10", text: "text-blue-400" },
    };
    const s = map[role];
    return (
      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold ${s.bg} ${s.text}`}>
        {roleIcon(role)}
        {t(`role_${role}`)}
      </span>
    );
  };

  const filterTabs: { key: UserRole | "all"; count: number }[] = [
    { key: "all", count: counts.all },
    { key: "user", count: counts.user },
    { key: "organizer", count: counts.organizer },
    { key: "admin", count: counts.admin },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Users className="w-7 h-7 text-red-400" />
          {t("title")}
        </h1>
        <p className="text-white/40 text-sm mt-1">{t("subtitle")}</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-red-500/50 text-sm"
        />
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {filterTabs.map((tab, i) => (
          <button
            key={tab.key}
            onClick={() => setRoleFilter(tab.key)}
            className={`rounded-2xl border p-4 text-left transition-all ${
              roleFilter === tab.key
                ? "bg-red-500/5 border-red-500/20"
                : "bg-white/[0.02] border-white/[0.06] hover:border-white/10"
            }`}
          >
            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">
              {tab.key === "all" ? t("filterAll") : t(`role_${tab.key}`)}
            </p>
            <p className="text-2xl font-bold text-white">{tab.count}</p>
          </button>
        ))}
      </div>

      {/* Users List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Users className="w-12 h-12 text-white/10 mx-auto mb-4" />
          <p className="text-white/30 text-sm">{t("noUsers")}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((u) => {
            const isExpanded = expandedId === u.id;
            return (
              <div key={u.id} className="rounded-xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : u.id)}
                  className="w-full flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors text-left"
                >
                  <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/10 flex-shrink-0">
                    <Image src={u.avatar} alt={u.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-white truncate">{u.name}</p>
                      {roleBadge(u.role)}
                    </div>
                    <p className="text-[11px] text-white/30 flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {u.email}
                    </p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-white/20 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-white/20 flex-shrink-0" />
                  )}
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-3">
                        <div className="h-px bg-white/5" />
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">{t("emailLabel")}</p>
                            <p className="text-white/70">{u.email}</p>
                          </div>
                          {u.phone && (
                            <div>
                              <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">{t("phone")}</p>
                              <p className="text-white/70">{u.phone}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">{t("role")}</p>
                            <p className="text-white/70">{t(`role_${u.role}`)}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">ID</p>
                            <p className="text-white/40 text-xs font-mono">{u.id}</p>
                          </div>
                        </div>
                        {u.organizerProfile && (
                          <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                            <p className="text-[10px] text-amber-400 uppercase tracking-wider mb-2 font-semibold">{t("organizerInfo")}</p>
                            <div className="flex items-center gap-3">
                              {u.organizerProfile.organizerLogo && (
                                <div className="relative w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                                  <Image src={u.organizerProfile.organizerLogo} alt="" fill className="object-cover" />
                                </div>
                              )}
                              <div>
                                <p className="text-xs font-semibold text-white">{u.organizerProfile.organizerName}</p>
                                {u.organizerProfile.organizerDescription && (
                                  <p className="text-[10px] text-white/40 mt-0.5 line-clamp-2">{u.organizerProfile.organizerDescription}</p>
                                )}
                              </div>
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
      )}
    </div>
  );
}
