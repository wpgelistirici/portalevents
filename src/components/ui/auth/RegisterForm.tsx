import { useState } from "react";
import { useTranslations } from "next-intl";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";

interface RegisterFormProps {
  name: string;
  email: string;
  password: string;
  isSubmitting: boolean;
  onNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
}

export default function RegisterForm({
  name,
  email,
  password,
  isSubmitting,
  onNameChange,
  onEmailChange,
  onPasswordChange,
}: RegisterFormProps) {
  const t = useTranslations("AuthModal");
  const [showPassword, setShowPassword] = useState(false);

  const inputClass =
    "w-full pl-11 pr-4 py-3.5 glass rounded-xl text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted/60 transition-shadow disabled:opacity-50";

  return (
    <>
      {/* Name */}
      <div className="relative">
        <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder={t("fullName")}
          disabled={isSubmitting}
          className={inputClass}
        />
      </div>

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

      {/* Terms */}
      <p className="text-center text-[10px] text-muted/60 mt-2 leading-relaxed">
        {t("termsPrefix")}
        <a href="/legal/distance-sales" target="_blank" className="text-muted underline cursor-pointer">
          {t("terms")}
        </a>
        {t("and")}
        <a href="/legal/kvkk" target="_blank" className="text-muted underline cursor-pointer">
          {t("privacyPolicy")}
        </a>
        {t("termsSuffix")}
      </p>
    </>
  );
}
