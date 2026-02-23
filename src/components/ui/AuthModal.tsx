"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { X, Mail, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle, Check } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

function SpotifyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1DB954">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2 },
  },
};

export default function AuthModal() {
  const { showAuthModal, closeAuthModal, login, register, loginWithSocial } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const t = useTranslations("AuthModal");

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setError(null);
    setSuccess(false);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    closeAuthModal();
  };

  const handleSwitchMode = () => {
    setError(null);
    setMode(mode === "login" ? "register" : "login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        if (!email || !password) {
          setError("fillAllFields");
          setIsSubmitting(false);
          return;
        }
        const result = await login(email, password);
        if (!result.success) {
          setError(result.error || "unknownError");
          setIsSubmitting(false);
          return;
        }
      } else {
        if (!name || !email || !password) {
          setError("fillAllFields");
          setIsSubmitting(false);
          return;
        }
        if (password.length < 4) {
          setError("passwordTooShort");
          setIsSubmitting(false);
          return;
        }
        const result = await register(name, email, password);
        if (!result.success) {
          setError(result.error || "unknownError");
          setIsSubmitting(false);
          return;
        }
      }

      // Success
      setSuccess(true);
      setTimeout(() => {
        handleClose();
        setMode("login");
      }, 1000);
    } catch {
      setError("unknownError");
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await loginWithSocial(provider);
      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 800);
    } catch {
      setError("unknownError");
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {showAuthModal && (
        <motion.div
          className="fixed inset-0 z-[950] flex items-center justify-center p-4"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md rounded-3xl overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Background */}
            <div className="absolute inset-0 bg-surface-light" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
            <div className="absolute inset-0 rounded-3xl border border-white/[0.08]" />

            <div className="relative z-10 p-8">
              {/* Close button */}
              <button
                onClick={handleClose}
                data-cursor-hover
                className="absolute top-5 right-5 w-8 h-8 rounded-full glass flex items-center justify-center text-muted hover:text-foreground transition-colors"
              >
                <X size={14} />
              </button>

              {/* Logo */}
              <div className="flex items-center gap-2 mb-8">
                <div className="flex items-end gap-[2px] h-5">
                  {[0.4, 0.7, 1, 0.6, 0.8].map((h, i) => (
                    <div
                      key={i}
                      className="w-[2px] bg-primary rounded-full"
                      style={{ height: `${h * 20}px` }}
                    />
                  ))}
                </div>
                <span className="text-lg font-bold">PULSE</span>
              </div>

              {/* Success State */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 z-20 bg-surface-light flex flex-col items-center justify-center rounded-3xl"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                      className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4"
                    >
                      <Check size={32} className="text-green-400" />
                    </motion.div>
                    <p className="text-lg font-bold">{t("welcomeBack")}</p>
                    <p className="text-sm text-muted mt-1">{t("redirecting")}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Heading */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, x: mode === "login" ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: mode === "login" ? 20 : -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="text-2xl font-bold mb-1">
                    {mode === "login" ? t("loginTitle") : t("registerTitle")}
                  </h2>
                  <p className="text-sm text-muted mb-8">
                    {mode === "login"
                      ? t("loginSubtitle")
                      : t("registerSubtitle")}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Social login */}
              <div className="flex gap-3 mb-6">
                <button
                  type="button"
                  data-cursor-hover
                  disabled={isSubmitting}
                  onClick={() => handleSocialLogin("google")}
                  className="flex-1 flex items-center justify-center gap-2.5 py-3 glass rounded-xl text-sm font-medium hover:bg-white/[0.06] transition-colors disabled:opacity-50"
                >
                  <GoogleIcon />
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  data-cursor-hover
                  disabled={isSubmitting}
                  onClick={() => handleSocialLogin("apple")}
                  className="flex-1 flex items-center justify-center gap-2.5 py-3 glass rounded-xl text-sm font-medium hover:bg-white/[0.06] transition-colors disabled:opacity-50"
                >
                  <AppleIcon />
                  <span>Apple</span>
                </button>
                <button
                  type="button"
                  data-cursor-hover
                  disabled={isSubmitting}
                  onClick={() => handleSocialLogin("spotify")}
                  className="flex-1 flex items-center justify-center gap-2.5 py-3 glass rounded-xl text-sm font-medium hover:bg-white/[0.06] transition-colors disabled:opacity-50"
                >
                  <SpotifyIcon />
                  <span>Spotify</span>
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-white/[0.06]" />
                <span className="text-[10px] text-muted uppercase tracking-widest">
                  {t("or")}
                </span>
                <div className="flex-1 h-px bg-white/[0.06]" />
              </div>

              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4"
                  >
                    <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                      <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                      <p className="text-xs text-red-400">{t(`errors.${error}`)}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Demo hint */}
              {mode === "login" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-4 px-4 py-3 bg-accent/5 border border-accent/10 rounded-xl space-y-1.5"
                >
                  <p className="text-[10px] text-accent font-semibold mb-1">{t("demoTitle")}</p>
                  <button
                    type="button"
                    onClick={() => { setEmail("demo@pulse.com"); setPassword("demo"); }}
                    className="w-full flex items-center justify-between text-[10px] text-accent/80 hover:text-accent transition-colors group cursor-pointer"
                    data-cursor-hover
                  >
                    <span><span className="inline-block w-[52px] text-muted/60">{t("demoUser")}</span> demo@pulse.com / demo</span>
                    <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEmail("organizer@pulse.com"); setPassword("org123"); }}
                    className="w-full flex items-center justify-between text-[10px] text-accent/80 hover:text-accent transition-colors group cursor-pointer"
                    data-cursor-hover
                  >
                    <span><span className="inline-block w-[52px] text-muted/60">{t("demoOrganizer")}</span> organizer@pulse.com / org123</span>
                    <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEmail("admin@pulse.com"); setPassword("admin123"); }}
                    className="w-full flex items-center justify-between text-[10px] text-accent/80 hover:text-accent transition-colors group cursor-pointer"
                    data-cursor-hover
                  >
                    <span><span className="inline-block w-[52px] text-muted/60">{t("demoAdmin")}</span> admin@pulse.com / admin123</span>
                    <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </motion.div>
              )}

              {/* Form */}
              <AnimatePresence mode="wait">
                <motion.form
                  key={mode}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3"
                  onSubmit={handleSubmit}
                >
                  {mode === "register" && (
                    <div className="relative">
                      <User
                        size={15}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                      />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t("fullName")}
                        disabled={isSubmitting}
                        className="w-full pl-11 pr-4 py-3.5 glass rounded-xl text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted/60 transition-shadow disabled:opacity-50"
                      />
                    </div>
                  )}

                  <div className="relative">
                    <Mail
                      size={15}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("email")}
                      disabled={isSubmitting}
                      className="w-full pl-11 pr-4 py-3.5 glass rounded-xl text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted/60 transition-shadow disabled:opacity-50"
                    />
                  </div>

                  <div className="relative">
                    <Lock
                      size={15}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t("password")}
                      disabled={isSubmitting}
                      className="w-full pl-11 pr-11 py-3.5 glass rounded-xl text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted/60 transition-shadow disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>

                  {mode === "login" && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        data-cursor-hover
                        className="text-[11px] text-primary hover:text-primary/80 transition-colors"
                      >
                        {t("forgotPassword")}
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    data-cursor-hover
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-primary text-white text-sm font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(255,45,85,0.3)] transition-all duration-300 flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <motion.div
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    ) : (
                      <>
                        {mode === "login" ? t("loginButton") : t("registerButton")}
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </motion.form>
              </AnimatePresence>

              {/* Toggle mode */}
              <p className="text-center text-xs text-muted mt-6">
                {mode === "login" ? t("noAccount") : t("hasAccount")}
                <button
                  type="button"
                  data-cursor-hover
                  onClick={handleSwitchMode}
                  className="text-primary font-semibold hover:text-primary/80 transition-colors"
                >
                  {mode === "login" ? t("register") : t("login")}
                </button>
              </p>

              {/* Terms */}
              {mode === "register" && (
                <p className="text-center text-[10px] text-muted/60 mt-4 leading-relaxed">
                  {t("termsPrefix")}
                  <span className="text-muted underline cursor-pointer">
                    {t("terms")}
                  </span>
                  {t("and")}
                  <span className="text-muted underline cursor-pointer">
                    {t("privacyPolicy")}
                  </span>
                  {t("termsSuffix")}
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
