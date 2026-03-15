import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { FORGOT_PASSWORD_FEEDBACK_MS } from "@/lib/constants";

interface LoginFormProps {
  email: string;
  password: string;
  isSubmitting: boolean;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
}

export default function LoginForm({
  email,
  password,
  isSubmitting,
  onEmailChange,
  onPasswordChange,
}: LoginFormProps) {
  const t = useTranslations("AuthModal");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const inputClass =
    "w-full pl-11 pr-4 py-3.5 glass rounded-xl text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted/60 transition-shadow disabled:opacity-50";

  return (
    <>
      {/* Demo credentials hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-4 px-4 py-3 bg-accent/5 border border-accent/10 rounded-xl space-y-1.5"
      >
        <p className="text-[10px] text-accent font-semibold mb-1">{t("demoTitle")}</p>
        {[
          { label: t("demoUser"), email: "demo@portalevents.co", pass: "demo" },
          { label: t("demoOrganizer"), email: "organizer@portalevents.co", pass: "org123" },
          { label: t("demoAdmin"), email: "admin@portalevents.co", pass: "admin123" },
        ].map(({ label, email: e, pass }) => (
          <button
            key={e}
            type="button"
            onClick={() => {
              onEmailChange(e);
              onPasswordChange(pass);
            }}
            className="w-full flex items-center justify-between text-[10px] text-accent/80 hover:text-accent transition-colors group cursor-pointer"
            data-cursor-hover
          >
            <span>
              <span className="inline-block w-[52px] text-muted/60">{label}</span>{" "}
              {e} / {pass}
            </span>
            <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </motion.div>

      {/* Email */}
      <div className="relative">
        <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder={t("email")}
          disabled={isSubmitting}
          className={inputClass}
        />
      </div>

      {/* Password */}
      <div className="relative">
        <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
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

      {/* Forgot password */}
      <div className="flex justify-end">
        <button
          type="button"
          data-cursor-hover
          onClick={() => {
            if (email) {
              setForgotSent(true);
              setTimeout(() => setForgotSent(false), FORGOT_PASSWORD_FEEDBACK_MS);
            }
          }}
          className="text-[11px] text-primary hover:text-primary/80 transition-colors"
        >
          {forgotSent ? t("resetSent") : t("forgotPassword")}
        </button>
      </div>
    </>
  );
}
