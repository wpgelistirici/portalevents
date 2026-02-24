"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Settings,
  Globe,
  Bell,
  Shield,
  Database,
  Mail,
  Save,
  CheckCircle2,
  Palette,
  Clock,
  Users,
} from "lucide-react";

export default function AdminSettingsPage() {
  const t = useTranslations("AdminPanel.settings");
  const [saved, setSaved] = useState(false);

  // Platform settings (mock)
  const [siteName, setSiteName] = useState("PORTAL");
  const [siteDesc, setSiteDesc] = useState("Türkiye'nin #1 Etkinlik Platformu");
  const [contactEmail, setContactEmail] = useState("info@portalevents.co");
  const [autoApprove, setAutoApprove] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [maxEventsPerOrg, setMaxEventsPerOrg] = useState("50");
  const [commissionRate, setCommissionRate] = useState("5");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Settings className="w-7 h-7 text-red-400" />
            {t("title")}
          </h1>
          <p className="text-white/40 text-sm mt-1">{t("subtitle")}</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
        >
          {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? t("saved") : t("save")}
        </button>
      </div>

      {/* General Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6 space-y-5"
      >
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Globe className="w-4 h-4 text-red-400" />
          {t("generalSettings")}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="text-[11px] text-white/40 uppercase tracking-wider block mb-1.5">{t("siteName")}</label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500/50"
            />
          </div>
          <div>
            <label className="text-[11px] text-white/40 uppercase tracking-wider block mb-1.5">{t("siteDescription")}</label>
            <input
              type="text"
              value={siteDesc}
              onChange={(e) => setSiteDesc(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500/50"
            />
          </div>
          <div>
            <label className="text-[11px] text-white/40 uppercase tracking-wider block mb-1.5">{t("contactEmail")}</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500/50"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Event & Organizer Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6 space-y-5"
      >
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-red-400" />
          {t("organizerSettings")}
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] text-white/40 uppercase tracking-wider block mb-1.5">{t("maxEvents")}</label>
              <input
                type="number"
                value={maxEventsPerOrg}
                onChange={(e) => setMaxEventsPerOrg(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500/50"
              />
            </div>
            <div>
              <label className="text-[11px] text-white/40 uppercase tracking-wider block mb-1.5">{t("commissionRate")}</label>
              <div className="relative">
                <input
                  type="number"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500/50 pr-8"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">%</span>
              </div>
            </div>
          </div>

          {/* Toggle: Auto approve */}
          <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-amber-400" />
              <div>
                <p className="text-sm text-white font-medium">{t("autoApprove")}</p>
                <p className="text-[10px] text-white/30">{t("autoApproveDesc")}</p>
              </div>
            </div>
            <button
              onClick={() => setAutoApprove(!autoApprove)}
              className={`relative w-11 h-6 rounded-full transition-colors ${autoApprove ? "bg-red-500" : "bg-white/10"}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${autoApprove ? "translate-x-[22px]" : "translate-x-0.5"}`} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Notification Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6 space-y-5"
      >
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-red-400" />
          {t("notificationSettings")}
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-blue-400" />
              <div>
                <p className="text-sm text-white font-medium">{t("emailNotifications")}</p>
                <p className="text-[10px] text-white/30">{t("emailNotificationsDesc")}</p>
              </div>
            </div>
            <button
              onClick={() => setEmailNotifs(!emailNotifs)}
              className={`relative w-11 h-6 rounded-full transition-colors ${emailNotifs ? "bg-red-500" : "bg-white/10"}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${emailNotifs ? "translate-x-[22px]" : "translate-x-0.5"}`} />
            </button>
          </div>

          <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-amber-400" />
              <div>
                <p className="text-sm text-white font-medium">{t("maintenanceMode")}</p>
                <p className="text-[10px] text-white/30">{t("maintenanceModeDesc")}</p>
              </div>
            </div>
            <button
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`relative w-11 h-6 rounded-full transition-colors ${maintenanceMode ? "bg-red-500" : "bg-white/10"}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${maintenanceMode ? "translate-x-[22px]" : "translate-x-0.5"}`} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* System Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6"
      >
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
          <Database className="w-4 h-4 text-red-400" />
          {t("systemInfo")}
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">{t("version")}</p>
            <p className="text-white/70">1.0.0-beta</p>
          </div>
          <div>
            <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">{t("storage")}</p>
            <p className="text-white/70">localStorage</p>
          </div>
          <div>
            <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">{t("framework")}</p>
            <p className="text-white/70">Next.js 16</p>
          </div>
          <div>
            <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">{t("environment")}</p>
            <p className="text-white/70">Demo</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
