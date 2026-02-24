"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useTranslations } from "next-intl";
import SmoothScroll from "@/components/ui/SmoothScroll";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GradientOrb from "@/components/ui/GradientOrb";
import { FadeInUp } from "@/components/ui/AnimatedText";
import { Link } from "@/i18n/routing";
import { useAuth } from "@/lib/auth-context";
import {
  User,
  Mail,
  Phone,
  Lock,
  Shield,
  Bell,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Camera,
  Ticket,
  ChevronRight,
  Trash2,
  Save,
  LogOut,
} from "lucide-react";

const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), {
  ssr: false,
});

/* ============================================
   MAIN ACCOUNT PAGE
   ============================================ */
export default function AccountPage() {
  const t = useTranslations("AccountPage");
  const {
    user,
    isAuthenticated,
    isLoading,
    updateUser,
    changePassword,
    deleteAccount,
    logout,
    openAuthModal,
  } = useAuth();

  const [activeSection, setActiveSection] = useState<"profile" | "security" | "notifications">("profile");

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      openAuthModal();
    }
  }, [isLoading, isAuthenticated, openAuthModal]);

  if (isLoading) {
    return (
      <>
        <SmoothScroll />
        <CustomCursor />
        <NoiseOverlay />
        <Navbar />
        <main className="min-h-screen pt-32 pb-20 flex items-center justify-center">
          <motion.div
            className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </main>
        <Footer />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <SmoothScroll />
        <CustomCursor />
        <NoiseOverlay />
        <Navbar />
        <main className="min-h-screen pt-32 pb-20">
          <div className="max-w-4xl mx-auto px-6 text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full glass flex items-center justify-center">
              <Lock size={32} className="text-primary" />
            </div>
            <h1 className="display-md mb-4">{t("loginRequired")}</h1>
            <p className="text-muted text-sm mb-8">{t("loginRequiredDesc")}</p>
            <button
              onClick={openAuthModal}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              {t("loginButton")}
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const sidebarItems = [
    { key: "profile" as const, icon: User, label: t("sidebarProfile") },
    { key: "security" as const, icon: Shield, label: t("sidebarSecurity") },
    { key: "notifications" as const, icon: Bell, label: t("sidebarNotifications") },
  ];

  return (
    <>
      <SmoothScroll />
      <CustomCursor />
      <NoiseOverlay />
      <Navbar />

      <main className="min-h-screen pt-28 pb-20">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <GradientOrb color="primary" size={400} top="5%" right="-10%" />
          <GradientOrb color="secondary" size={300} bottom="15%" left="-8%" delay={3} />
        </div>

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          {/* Header */}
          <FadeInUp>
            <h1 className="display-md mb-2">{t("title")}</h1>
            <p className="text-sm text-muted mb-10">{t("subtitle")}</p>
          </FadeInUp>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <FadeInUp delay={0.1}>
                <div className="glass rounded-2xl p-4 space-y-1 lg:sticky lg:top-28">
                  {/* User avatar header */}
                  <div className="flex items-center gap-3 p-3 mb-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/30 flex-shrink-0">
                      <Image src={user.avatar} alt={user.name} fill className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold truncate">{user.name}</p>
                      <p className="text-[10px] text-muted truncate">{user.email}</p>
                    </div>
                  </div>

                  <div className="h-px bg-white/5" />

                  {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.key;
                    return (
                      <button
                        key={item.key}
                        onClick={() => setActiveSection(item.key)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                          isActive
                            ? "bg-primary/10 text-white font-medium"
                            : "text-muted hover:text-white hover:bg-white/5"
                        }`}
                        data-cursor-hover
                      >
                        <Icon size={16} className={isActive ? "text-primary" : ""} />
                        {item.label}
                      </button>
                    );
                  })}

                  <div className="h-px bg-white/5" />

                  {/* Quick links */}
                  <Link
                    href="/my-tickets"
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-muted hover:text-white hover:bg-white/5 transition-all"
                    data-cursor-hover
                  >
                    <Ticket size={16} />
                    {t("myTickets")}
                    <ChevronRight size={12} className="ml-auto" />
                  </Link>

                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/5 transition-all"
                    data-cursor-hover
                  >
                    <LogOut size={16} />
                    {t("logout")}
                  </button>
                </div>
              </FadeInUp>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {activeSection === "profile" && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ProfileSection user={user} updateUser={updateUser} t={t} />
                  </motion.div>
                )}
                {activeSection === "security" && (
                  <motion.div
                    key="security"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SecuritySection
                      changePassword={changePassword}
                      deleteAccount={deleteAccount}
                      t={t}
                    />
                  </motion.div>
                )}
                {activeSection === "notifications" && (
                  <motion.div
                    key="notifications"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <NotificationsSection t={t} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

/* ============================================
   PROFILE SECTION
   ============================================ */
function ProfileSection({
  user,
  updateUser,
  t,
}: {
  user: NonNullable<ReturnType<typeof useAuth>["user"]>;
  updateUser: (data: Partial<typeof user>) => void;
  t: ReturnType<typeof useTranslations>;
}) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || "");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const hasChanges =
    name !== user.name || email !== user.email || phone !== (user.phone || "");

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    updateUser({ name, email, phone: phone || undefined });
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const avatars = [
    "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop",
  ];

  return (
    <div className="space-y-6">
      {/* Avatar */}
      <FadeInUp delay={0.15}>
        <div className="glass rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Camera size={16} className="text-primary" />
            </div>
            {t("profilePhoto")}
          </h2>

          <div className="flex items-center gap-6 mb-4">
            <div className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-primary/30 flex-shrink-0">
              <Image src={user.avatar} alt={user.name} fill className="object-cover" />
            </div>
            <div>
              <p className="text-sm font-medium mb-1">{t("chooseAvatar")}</p>
              <p className="text-xs text-muted">{t("avatarHint")}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {avatars.map((avatar) => (
              <button
                key={avatar}
                onClick={() => updateUser({ avatar })}
                className={`relative w-12 h-12 rounded-full overflow-hidden transition-all ${
                  user.avatar === avatar
                    ? "ring-2 ring-primary scale-110"
                    : "ring-1 ring-white/10 hover:ring-white/30 opacity-60 hover:opacity-100"
                }`}
                data-cursor-hover
              >
                <Image src={avatar} alt="Avatar" fill className="object-cover" />
                {user.avatar === avatar && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <Check size={16} className="text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </FadeInUp>

      {/* Personal Info */}
      <FadeInUp delay={0.2}>
        <div className="glass rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <User size={16} className="text-accent" />
            </div>
            {t("personalInfo")}
          </h2>

          <div className="space-y-4">
            <SettingsInput
              label={t("fullName")}
              value={name}
              onChange={setName}
              icon={User}
              required
            />
            <SettingsInput
              label={t("email")}
              value={email}
              onChange={setEmail}
              icon={Mail}
              type="email"
              required
            />
            <SettingsInput
              label={t("phone")}
              value={phone}
              onChange={setPhone}
              icon={Phone}
              type="tel"
              placeholder="05XX XXX XX XX"
            />
          </div>

          {/* Save button */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
            <AnimatePresence>
              {saved && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center gap-2 text-green-400 text-xs"
                >
                  <Check size={14} />
                  {t("saved")}
                </motion.div>
              )}
            </AnimatePresence>
            <motion.button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className={`ml-auto flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                hasChanges && !isSaving
                  ? "bg-primary text-white hover:bg-primary/90 shadow-[0_0_20px_rgba(123,97,255,0.2)]"
                  : "glass text-muted cursor-not-allowed"
              }`}
              whileHover={hasChanges ? { scale: 1.02 } : {}}
              whileTap={hasChanges ? { scale: 0.98 } : {}}
              data-cursor-hover
            >
              {isSaving ? (
                <motion.div
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <Save size={14} />
              )}
              {t("saveChanges")}
            </motion.button>
          </div>
        </div>
      </FadeInUp>
    </div>
  );
}

/* ============================================
   SECURITY SECTION
   ============================================ */
function SecuritySection({
  changePassword,
  deleteAccount,
  t,
}: {
  changePassword: (current: string, newPw: string) => Promise<{ success: boolean; error?: string }>;
  deleteAccount: () => void;
  t: ReturnType<typeof useTranslations>;
}) {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleChangePassword = async () => {
    setError(null);

    if (!currentPw || !newPw || !confirmPw) {
      setError("fillAllFields");
      return;
    }
    if (newPw.length < 4) {
      setError("passwordTooShort");
      return;
    }
    if (newPw !== confirmPw) {
      setError("passwordMismatch");
      return;
    }

    setIsSaving(true);
    const result = await changePassword(currentPw, newPw);
    setIsSaving(false);

    if (!result.success) {
      setError(result.error || "unknownError");
      return;
    }

    setSaved(true);
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <FadeInUp delay={0.15}>
        <div className="glass rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
              <Lock size={16} className="text-gold" />
            </div>
            {t("changePassword")}
          </h2>

          <div className="space-y-4">
            {/* Current password */}
            <div>
              <label className="text-xs text-muted mb-1.5 block">
                {t("currentPassword")} <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 glass rounded-xl text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-white/20"
                  placeholder="••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                >
                  {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* New password */}
            <div>
              <label className="text-xs text-muted mb-1.5 block">
                {t("newPassword")} <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type={showNew ? "text" : "password"}
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 glass rounded-xl text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-white/20"
                  placeholder="••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                >
                  {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Confirm new password */}
            <div>
              <label className="text-xs text-muted mb-1.5 block">
                {t("confirmPassword")} <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type={showNew ? "text" : "password"}
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 glass rounded-xl text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-white/20"
                  placeholder="••••••"
                />
              </div>
            </div>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4"
              >
                <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                  <p className="text-xs text-red-400">{t(`errors.${error}`)}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Save */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
            <AnimatePresence>
              {saved && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center gap-2 text-green-400 text-xs"
                >
                  <Check size={14} />
                  {t("passwordChanged")}
                </motion.div>
              )}
            </AnimatePresence>
            <motion.button
              onClick={handleChangePassword}
              disabled={isSaving}
              className="ml-auto flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(123,97,255,0.2)] disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              data-cursor-hover
            >
              {isSaving ? (
                <motion.div
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <Shield size={14} />
              )}
              {t("updatePassword")}
            </motion.button>
          </div>
        </div>
      </FadeInUp>

      {/* Delete Account */}
      <FadeInUp delay={0.2}>
        <div className="glass rounded-2xl p-6 border border-red-500/10">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-3 text-red-400">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <Trash2 size={16} className="text-red-400" />
            </div>
            {t("dangerZone")}
          </h2>
          <p className="text-xs text-muted mb-5 leading-relaxed">{t("deleteAccountDesc")}</p>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-5 py-2.5 bg-red-500/10 text-red-400 text-xs font-medium rounded-xl hover:bg-red-500/20 transition-colors"
              data-cursor-hover
            >
              {t("deleteAccount")}
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3"
            >
              <p className="text-xs text-red-400 font-medium">{t("deleteConfirm")}</p>
              <button
                onClick={() => {
                  deleteAccount();
                }}
                className="px-5 py-2.5 bg-red-500 text-white text-xs font-bold rounded-xl hover:bg-red-600 transition-colors"
                data-cursor-hover
              >
                {t("deleteConfirmYes")}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-5 py-2.5 glass text-xs font-medium rounded-xl hover:bg-white/5 transition-colors"
                data-cursor-hover
              >
                {t("deleteConfirmNo")}
              </button>
            </motion.div>
          )}
        </div>
      </FadeInUp>
    </div>
  );
}

/* ============================================
   NOTIFICATIONS SECTION
   ============================================ */
function NotificationsSection({
  t,
}: {
  t: ReturnType<typeof useTranslations>;
}) {
  const [eventReminders, setEventReminders] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [newEvents, setNewEvents] = useState(false);
  const [communityUpdates, setCommunityUpdates] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <FadeInUp delay={0.15}>
        <div className="glass rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Bell size={16} className="text-secondary" />
            </div>
            {t("notificationPrefs")}
          </h2>

          <div className="space-y-1">
            <ToggleItem
              label={t("notifEventReminders")}
              desc={t("notifEventRemindersDesc")}
              checked={eventReminders}
              onChange={setEventReminders}
            />
            <ToggleItem
              label={t("notifPriceAlerts")}
              desc={t("notifPriceAlertsDesc")}
              checked={priceAlerts}
              onChange={setPriceAlerts}
            />
            <ToggleItem
              label={t("notifNewEvents")}
              desc={t("notifNewEventsDesc")}
              checked={newEvents}
              onChange={setNewEvents}
            />
            <ToggleItem
              label={t("notifCommunity")}
              desc={t("notifCommunityDesc")}
              checked={communityUpdates}
              onChange={setCommunityUpdates}
            />
            <ToggleItem
              label={t("notifMarketing")}
              desc={t("notifMarketingDesc")}
              checked={marketing}
              onChange={setMarketing}
            />
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
            <AnimatePresence>
              {saved && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center gap-2 text-green-400 text-xs"
                >
                  <Check size={14} />
                  {t("saved")}
                </motion.div>
              )}
            </AnimatePresence>
            <motion.button
              onClick={handleSave}
              className="ml-auto flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(123,97,255,0.2)]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              data-cursor-hover
            >
              <Save size={14} />
              {t("saveChanges")}
            </motion.button>
          </div>
        </div>
      </FadeInUp>
    </div>
  );
}

/* ============================================
   TOGGLE ITEM COMPONENT
   ============================================ */
function ToggleItem({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      className="flex items-center justify-between py-4 px-3 rounded-xl hover:bg-white/[0.02] transition-colors cursor-pointer"
      onClick={() => onChange(!checked)}
      data-cursor-hover
    >
      <div className="flex-1 mr-4">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted mt-0.5">{desc}</p>
      </div>
      <div
        className={`w-11 h-6 rounded-full relative transition-colors duration-200 flex-shrink-0 ${
          checked ? "bg-primary" : "bg-white/10"
        }`}
      >
        <motion.div
          className="w-5 h-5 rounded-full bg-white absolute top-0.5 shadow-md"
          animate={{ left: checked ? "22px" : "2px" }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </div>
    </div>
  );
}

/* ============================================
   SETTINGS INPUT COMPONENT
   ============================================ */
function SettingsInput({
  label,
  value,
  onChange,
  icon: Icon,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ComponentType<{ size: number; className?: string }>;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs text-muted mb-1.5 block">
        {label}
        {required && <span className="text-primary ml-0.5">*</span>}
      </label>
      <div className="relative">
        <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 glass rounded-xl text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-white/20"
        />
      </div>
    </div>
  );
}
