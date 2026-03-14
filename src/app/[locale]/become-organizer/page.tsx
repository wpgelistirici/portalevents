"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import SmoothScroll from "@/components/ui/SmoothScroll";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GradientOrb from "@/components/ui/GradientOrb";
import { FadeInUp } from "@/components/ui/AnimatedText";
import {
  Ticket,
  BarChart3,
  Users,
  Megaphone,
  QrCode,
  Tag,
  Building2,
  Headphones,
  ArrowRight,
  CheckCircle,
  Loader2,
} from "lucide-react";

const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), {
  ssr: false,
});

type SubmitState = "idle" | "submitting" | "success" | "error";

interface FormValues {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  orgName: string;
  eventCount: string;
  about: string;
  instagram: string;
  twitter: string;
  referral: string;
  categories: string[];
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  city?: string;
  orgName?: string;
  eventCount?: string;
  about?: string;
  instagram?: string;
  twitter?: string;
}

const INITIAL_VALUES: FormValues = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  orgName: "",
  eventCount: "",
  about: "",
  instagram: "",
  twitter: "",
  referral: "",
  categories: [],
};

const featureList = [
  { icon: Ticket, key: "ticketing" },
  { icon: BarChart3, key: "analytics" },
  { icon: Users, key: "audience" },
  { icon: Megaphone, key: "promotion" },
  { icon: QrCode, key: "checkin" },
  { icon: Tag, key: "coupon" },
  { icon: Building2, key: "venue" },
  { icon: Headphones, key: "support" },
] as const;

const categoryKeys = [
  "catMusic",
  "catTheatre",
  "catStandup",
  "catSport",
  "catArt",
  "catTech",
  "catOther",
] as const;

const statsData = [
  { value: "2,400+", key: "organizers" },
  { value: "₺12M+", key: "sales" },
  { value: "%98", key: "satisfaction" },
  { value: "24/7", key: "support" },
] as const;

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function isValidUrl(v: string) {
  if (!v) return true;
  try {
    new URL(v);
    return true;
  } catch {
    return false;
  }
}

export default function BecomeOrganizerPage() {
  const t = useTranslations("BecomeOrganizerPage");
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleCategory(cat: string) {
    setValues((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));
  }

  function validate(): FormErrors {
    const e: FormErrors = {};
    if (!values.fullName.trim()) e.fullName = t("form.errorRequired");
    if (!values.email.trim()) {
      e.email = t("form.errorRequired");
    } else if (!isValidEmail(values.email)) {
      e.email = t("form.errorEmail");
    }
    if (!values.phone.trim()) e.phone = t("form.errorRequired");
    if (!values.city.trim()) e.city = t("form.errorRequired");
    if (!values.orgName.trim()) e.orgName = t("form.errorRequired");
    if (!values.eventCount) e.eventCount = t("form.errorRequired");
    if (!values.about.trim()) e.about = t("form.errorRequired");
    if (!isValidUrl(values.instagram)) e.instagram = t("form.errorUrl");
    if (!isValidUrl(values.twitter)) e.twitter = t("form.errorUrl");
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitState("submitting");
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitState("success");
  }

  const inputClass =
    "w-full px-4 py-3 glass rounded-xl text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted";
  const labelClass = "block text-xs font-semibold text-foreground/70 mb-1.5";
  const errorClass = "text-xs text-red-400 mt-1";
  const fieldWrap = "flex flex-col";

  return (
    <>
      <SmoothScroll />
      <CustomCursor />
      <NoiseOverlay />
      <Navbar />

      <main className="min-h-screen pt-32 pb-20">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <GradientOrb color="primary" size={400} top="5%" right="-10%" />
          <GradientOrb
            color="secondary"
            size={300}
            bottom="30%"
            left="-5%"
            delay={3}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* ── Hero ── */}
          <div className="text-center mb-20">
            <FadeInUp>
              <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">
                {t("label")}
              </span>
              <h1 className="display-lg mt-4 mb-6">
                {t("titleLine1")}
                <br />
                <span className="text-gradient-primary">{t("titleLine2")}</span>
              </h1>
              <p className="text-muted text-sm max-w-md mx-auto mb-10">
                {t("description")}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="#apply"
                  data-cursor-hover
                  className="px-8 py-4 bg-primary text-white text-sm font-semibold rounded-full hover:shadow-[0_0_40px_rgba(123,97,255,0.4)] transition-shadow duration-500 flex items-center gap-2"
                >
                  {t("ctaPrimary")}
                  <ArrowRight size={14} />
                </a>
                <Link
                  href="/organizer"
                  data-cursor-hover
                  className="px-8 py-4 glass text-foreground text-sm font-semibold rounded-full hover:bg-foreground/10 transition-all duration-300"
                >
                  {t("ctaSecondary")}
                </Link>
              </div>
            </FadeInUp>
          </div>

          {/* ── Features Grid ── */}
          <div className="mb-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featureList.map((feature, i) => (
                <FadeInUp key={feature.key} delay={0.05 * i} className="h-full">
                  <motion.div
                    className="glass rounded-xl p-5 group hover:bg-foreground/[0.06] transition-colors duration-300 h-full"
                    whileHover={{ y: -4, scale: 1.02 }}
                    data-cursor-hover
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                      <feature.icon size={18} className="text-primary" />
                    </div>
                    <h4 className="text-sm font-bold mb-1">
                      {t(`features.${feature.key}`)}
                    </h4>
                    <p className="text-[11px] text-muted leading-relaxed">
                      {t(`features.${feature.key}Desc`)}
                    </p>
                  </motion.div>
                </FadeInUp>
              ))}
            </div>
          </div>

          {/* ── Stats Bar ── */}
          <FadeInUp>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 mb-20 py-10 border-y border-foreground/5">
              {statsData.map((stat) => (
                <div key={stat.key} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-gradient-primary">
                    {stat.value}
                  </div>
                  <div className="text-[10px] text-muted uppercase tracking-widest mt-1">
                    {t(`stats.${stat.key}`)}
                  </div>
                </div>
              ))}
            </div>
          </FadeInUp>

          {/* ── Application Form ── */}
          <div id="apply" className="max-w-2xl mx-auto scroll-mt-32">
            <FadeInUp>
              <h2 className="display-sm text-center mb-2">
                {t("form.title")}
              </h2>
              <p className="text-sm text-muted text-center mb-10">
                {t("form.subtitle")}
              </p>
            </FadeInUp>

            {submitState === "success" ? (
              <FadeInUp>
                <div className="glass rounded-2xl p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={32} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">
                    {t("form.successTitle")}
                  </h3>
                  <p className="text-sm text-muted">{t("form.successDesc")}</p>
                </div>
              </FadeInUp>
            ) : (
              <FadeInUp delay={0.1}>
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="glass rounded-2xl p-8 space-y-8"
                >
                  {/* Kişisel Bilgiler */}
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-primary font-semibold mb-5">
                      {t("form.sectionPersonal")}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className={fieldWrap}>
                        <label className={labelClass}>{t("form.fullName")}</label>
                        <input
                          name="fullName"
                          value={values.fullName}
                          onChange={handleChange}
                          className={inputClass}
                          placeholder={t("form.fullName")}
                        />
                        {errors.fullName && (
                          <p className={errorClass}>{errors.fullName}</p>
                        )}
                      </div>
                      <div className={fieldWrap}>
                        <label className={labelClass}>{t("form.email")}</label>
                        <input
                          name="email"
                          type="email"
                          value={values.email}
                          onChange={handleChange}
                          className={inputClass}
                          placeholder="ornek@email.com"
                        />
                        {errors.email && (
                          <p className={errorClass}>{errors.email}</p>
                        )}
                      </div>
                      <div className={fieldWrap}>
                        <label className={labelClass}>{t("form.phone")}</label>
                        <input
                          name="phone"
                          type="tel"
                          value={values.phone}
                          onChange={handleChange}
                          className={inputClass}
                          placeholder="+90 5XX XXX XX XX"
                        />
                        {errors.phone && (
                          <p className={errorClass}>{errors.phone}</p>
                        )}
                      </div>
                      <div className={fieldWrap}>
                        <label className={labelClass}>{t("form.city")}</label>
                        <input
                          name="city"
                          value={values.city}
                          onChange={handleChange}
                          className={inputClass}
                          placeholder="İstanbul"
                        />
                        {errors.city && (
                          <p className={errorClass}>{errors.city}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Organizasyon Bilgileri */}
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-primary font-semibold mb-5">
                      {t("form.sectionOrg")}
                    </h3>
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className={fieldWrap}>
                          <label className={labelClass}>{t("form.orgName")}</label>
                          <input
                            name="orgName"
                            value={values.orgName}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder={t("form.orgName")}
                          />
                          {errors.orgName && (
                            <p className={errorClass}>{errors.orgName}</p>
                          )}
                        </div>
                        <div className={fieldWrap}>
                          <label className={labelClass}>{t("form.eventCount")}</label>
                          <select
                            name="eventCount"
                            value={values.eventCount}
                            onChange={handleChange}
                            className={`${inputClass} cursor-pointer`}
                          >
                            <option value="" disabled>—</option>
                            {(["eventCountOpt1", "eventCountOpt2", "eventCountOpt3", "eventCountOpt4"] as const).map(
                              (opt) => (
                                <option key={opt} value={t(`form.${opt}`)}>
                                  {t(`form.${opt}`)}
                                </option>
                              )
                            )}
                          </select>
                          {errors.eventCount && (
                            <p className={errorClass}>{errors.eventCount}</p>
                          )}
                        </div>
                      </div>
                      <div className={fieldWrap}>
                        <label className={labelClass}>{t("form.about")}</label>
                        <textarea
                          name="about"
                          value={values.about}
                          onChange={handleChange}
                          rows={4}
                          maxLength={500}
                          className={`${inputClass} resize-none`}
                          placeholder={t("form.aboutPlaceholder")}
                        />
                        <div className="flex items-center justify-between mt-1">
                          {errors.about ? (
                            <p className={errorClass}>{errors.about}</p>
                          ) : (
                            <span />
                          )}
                          <span className="text-[11px] text-muted">
                            {values.about.length}/500
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detaylar */}
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-primary font-semibold mb-5">
                      {t("form.sectionDetails")}
                    </h3>
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className={fieldWrap}>
                          <label className={labelClass}>{t("form.instagram")}</label>
                          <input
                            name="instagram"
                            type="url"
                            value={values.instagram}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="https://instagram.com/..."
                          />
                          {errors.instagram && (
                            <p className={errorClass}>{errors.instagram}</p>
                          )}
                        </div>
                        <div className={fieldWrap}>
                          <label className={labelClass}>{t("form.twitter")}</label>
                          <input
                            name="twitter"
                            type="url"
                            value={values.twitter}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="https://x.com/..."
                          />
                          {errors.twitter && (
                            <p className={errorClass}>{errors.twitter}</p>
                          )}
                        </div>
                      </div>
                      <div className={fieldWrap}>
                        <label className={labelClass}>{t("form.referral")}</label>
                        <input
                          name="referral"
                          value={values.referral}
                          onChange={handleChange}
                          className={inputClass}
                          placeholder={t("form.referral")}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>{t("form.categories")}</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {categoryKeys.map((catKey) => {
                            const label = t(`form.${catKey}`);
                            const active = values.categories.includes(label);
                            return (
                              <button
                                key={catKey}
                                type="button"
                                onClick={() => handleCategory(label)}
                                data-cursor-hover
                                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                                  active
                                    ? "bg-primary text-white"
                                    : "glass text-muted hover:text-foreground hover:bg-foreground/10"
                                }`}
                              >
                                {label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {submitState === "error" && (
                    <p className="text-sm text-red-400 text-center">
                      {t("form.errorGeneric")}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitState === "submitting"}
                    data-cursor-hover
                    className="w-full py-4 bg-primary text-white text-sm font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(123,97,255,0.3)] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitState === "submitting" ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        {t("form.submitting")}
                      </>
                    ) : (
                      t("form.submit")
                    )}
                  </button>
                </form>
              </FadeInUp>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
