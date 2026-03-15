"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { X, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import type { SocialProvider } from "@/lib/types";
import { AUTH_SUCCESS_REDIRECT_MS, AUTH_SOCIAL_SUCCESS_MS } from "@/lib/constants";
import SocialLoginButtons from "./auth/SocialLoginButtons";
import AuthSuccessState from "./auth/AuthSuccessState";
import LoginForm from "./auth/LoginForm";
import RegisterForm from "./auth/RegisterForm";

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

      setSuccess(true);
      setTimeout(() => {
        handleClose();
        setMode("login");
      }, AUTH_SUCCESS_REDIRECT_MS);
    } catch {
      setError("unknownError");
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = async (provider: SocialProvider) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await loginWithSocial(provider);
      setSuccess(true);
      setTimeout(() => handleClose(), AUTH_SOCIAL_SUCCESS_MS);
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
            <div className="absolute inset-0 bg-surface-light" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
            <div className="absolute inset-0 rounded-3xl border border-foreground/[0.08]" />

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
                    <div key={i} className="w-[2px] bg-primary rounded-full" style={{ height: `${h * 20}px` }} />
                  ))}
                </div>
                <span className="text-lg font-bold">PORTAL</span>
              </div>

              {/* Success overlay */}
              <AnimatePresence>
                {success && <AuthSuccessState />}
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
                    {mode === "login" ? t("loginSubtitle") : t("registerSubtitle")}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Social login */}
              <SocialLoginButtons isSubmitting={isSubmitting} onLogin={handleSocialLogin} />

              {/* Divider */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-foreground/[0.06]" />
                <span className="text-[10px] text-muted uppercase tracking-widest">{t("or")}</span>
                <div className="flex-1 h-px bg-foreground/[0.06]" />
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

              {/* Form fields */}
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
                  {mode === "login" ? (
                    <LoginForm
                      email={email}
                      password={password}
                      isSubmitting={isSubmitting}
                      onEmailChange={setEmail}
                      onPasswordChange={setPassword}
                    />
                  ) : (
                    <RegisterForm
                      name={name}
                      email={email}
                      password={password}
                      isSubmitting={isSubmitting}
                      onNameChange={setName}
                      onEmailChange={setEmail}
                      onPasswordChange={setPassword}
                    />
                  )}

                  <button
                    type="submit"
                    data-cursor-hover
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-primary text-white text-sm font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(123,97,255,0.3)] transition-all duration-300 flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <motion.div
                        className="w-4 h-4 border-2 border-foreground/30 border-t-white rounded-full"
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
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
