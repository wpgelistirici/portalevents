"use client";

import { use, useState } from "react";
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
import { events } from "@/lib/data";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Ticket,
  CreditCard,
  User,
  FileText,
  ChevronRight,
  Check,
  Lock,
  Tag,
  Building2,
  Shield,
  AlertCircle,
  Sparkles,
  PartyPopper,
} from "lucide-react";

const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), {
  ssr: false,
});

/* ============================================
   MAIN CHECKOUT PAGE
   ============================================ */
export default function CheckoutPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = use(params);
  const t = useTranslations("CheckoutPage");
  const event = events.find((e) => e.id === id);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [ticketQty, setTicketQty] = useState(1);
  const [selectedTicketIdx, setSelectedTicketIdx] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [tcNo, setTcNo] = useState("");
  const [invoiceType, setInvoiceType] = useState<"individual" | "corporate">(
    "individual",
  );
  const [companyName, setCompanyName] = useState("");
  const [taxOffice, setTaxOffice] = useState("");
  const [taxNo, setTaxNo] = useState("");
  const [invoiceAddress, setInvoiceAddress] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [selectedSection, setSelectedSection] = useState<
    "backstage" | "vip" | "general"
  >("general");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState(false);

  // Payment state
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [saveCard, setSaveCard] = useState(false);

  // Agreements
  const [agreeDistance, setAgreeDistance] = useState(false);
  const [agreeKvkk, setAgreeKvkk] = useState(false);
  const [agreeCancellation, setAgreeCancellation] = useState(false);

  if (!event || !event.detail) {
    return (
      <>
        <SmoothScroll />
        <CustomCursor />
        <NoiseOverlay />
        <Navbar />
        <main className="min-h-screen pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-6 text-center py-32">
            <AlertCircle size={48} className="text-primary mx-auto mb-4" />
            <h1 className="display-md mb-4">Etkinlik bulunamadı</h1>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full text-sm font-semibold"
            >
              <ArrowLeft size={16} />
              {t("backToEvent")}
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const detail = event.detail;
  const selectedTicket = detail.ticketTypes[selectedTicketIdx];

  // Calculate pricing
  const priceNum = parseFloat(selectedTicket.price.replace(/[^\d]/g, ""));
  const subtotal = priceNum * ticketQty;
  const serviceFee = Math.round(subtotal * 0.05);
  const discountAmount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + serviceFee - discountAmount;

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "PULSE10") {
      setCouponApplied(true);
      setCouponError(false);
    } else {
      setCouponError(true);
      setCouponApplied(false);
    }
  };

  const formatCardNumber = (val: string) => {
    const cleaned = val.replace(/\D/g, "").slice(0, 16);
    return cleaned.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (val: string) => {
    const cleaned = val.replace(/\D/g, "").slice(0, 4);
    if (cleaned.length >= 3)
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2);
    return cleaned;
  };

  const handleCompletePurchase = async () => {
    setIsProcessing(true);
    // Simulated purchase
    await new Promise((r) => setTimeout(r, 2500));
    setIsProcessing(false);
    setIsSuccess(true);

    // Store ticket into localStorage for My Tickets page
    const ticket = {
      id: `TKT-${Date.now()}`,
      eventId: event.id,
      eventTitle: event.title,
      artist: event.artist,
      venue: event.venue,
      city: event.city,
      date: event.date,
      time: event.time,
      image: event.image,
      genre: event.genre,
      ticketType: selectedTicket.name,
      ticketPrice: selectedTicket.price,
      quantity: ticketQty,
      totalPaid: `₺${total.toLocaleString("tr-TR")}`,
      purchaseDate: new Date().toLocaleDateString("tr-TR"),
      section: selectedSection,
      buyerName: fullName,
      buyerEmail: email,
      status: "active" as const,
      qrSeed: Math.random().toString(36).substring(2, 15),
    };

    const existingTickets = JSON.parse(
      localStorage.getItem("pulse_tickets") || "[]",
    );
    existingTickets.push(ticket);
    localStorage.setItem("pulse_tickets", JSON.stringify(existingTickets));
  };

  const allAgreementsAccepted = agreeDistance && agreeKvkk && agreeCancellation;
  const isStep1Valid = fullName && email && phone && invoiceAddress && city;
  const isStep2Valid =
    cardNumber.replace(/\s/g, "").length === 16 &&
    cardName &&
    expiry.length === 5 &&
    cvv.length === 3;

  const stepLabels = [
    { key: "info", icon: User },
    { key: "payment", icon: CreditCard },
    { key: "confirm", icon: Check },
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
          <GradientOrb
            color="secondary"
            size={300}
            bottom="15%"
            left="-8%"
            delay={3}
          />
        </div>

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          {/* Back */}
          <FadeInUp>
            <Link
              href={`/events/${event.id}`}
              className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-8"
              data-cursor-hover
            >
              <ArrowLeft size={14} />
              {t("backToEvent")}
            </Link>
          </FadeInUp>

          {/* Title */}
          <FadeInUp delay={0.1}>
            <h1 className="display-md mb-8">{t("title")}</h1>
          </FadeInUp>

          {/* Success State */}
          <AnimatePresence>
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass rounded-3xl p-12 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6"
                >
                  <PartyPopper size={40} className="text-green-400" />
                </motion.div>
                <h2 className="text-2xl font-bold mb-3">{t("successTitle")}</h2>
                <p className="text-muted text-sm mb-8 max-w-md mx-auto">
                  {t("successDesc")}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/my-tickets"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors shadow-[0_0_30px_rgba(255,45,85,0.2)]"
                  >
                    <Ticket size={16} />
                    {t("goToTickets")}
                  </Link>
                  <Link
                    href="/events"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 glass rounded-xl text-sm font-medium text-muted hover:text-foreground transition-colors"
                  >
                    {t("continueShopping")}
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!isSuccess && (
            <>
              {/* Step indicator */}
              <FadeInUp delay={0.15}>
                <div className="flex items-center justify-center gap-2 mb-10">
                  {stepLabels.map((s, i) => {
                    const StepIcon = s.icon;
                    const stepNum = (i + 1) as 1 | 2 | 3;
                    const isActive = step === stepNum;
                    const isDone = step > stepNum;
                    return (
                      <div key={s.key} className="flex items-center gap-2">
                        <button
                          onClick={() => isDone && setStep(stepNum)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                            isActive
                              ? "bg-primary text-white shadow-[0_0_20px_rgba(255,45,85,0.3)]"
                              : isDone
                                ? "bg-green-500/10 text-green-400 cursor-pointer"
                                : "glass text-muted cursor-default"
                          }`}
                          data-cursor-hover
                        >
                          {isDone ? (
                            <Check size={12} />
                          ) : (
                            <StepIcon size={12} />
                          )}
                          {t(`steps.${s.key}`)}
                        </button>
                        {i < 2 && (
                          <ChevronRight size={14} className="text-white/20" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </FadeInUp>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: form area */}
                <div className="lg:col-span-2">
                  <AnimatePresence mode="wait">
                    {step === 1 && (
                      <Step1Info
                        key="step1"
                        t={t}
                        fullName={fullName}
                        setFullName={setFullName}
                        email={email}
                        setEmail={setEmail}
                        phone={phone}
                        setPhone={setPhone}
                        tcNo={tcNo}
                        setTcNo={setTcNo}
                        invoiceType={invoiceType}
                        setInvoiceType={setInvoiceType}
                        companyName={companyName}
                        setCompanyName={setCompanyName}
                        taxOffice={taxOffice}
                        setTaxOffice={setTaxOffice}
                        taxNo={taxNo}
                        setTaxNo={setTaxNo}
                        invoiceAddress={invoiceAddress}
                        setInvoiceAddress={setInvoiceAddress}
                        city={city}
                        setCity={setCity}
                        district={district}
                        setDistrict={setDistrict}
                        selectedSection={selectedSection}
                        setSelectedSection={setSelectedSection}
                        onNext={() => setStep(2)}
                        isValid={!!isStep1Valid}
                      />
                    )}
                    {step === 2 && (
                      <Step2Payment
                        key="step2"
                        t={t}
                        cardNumber={cardNumber}
                        setCardNumber={(v) =>
                          setCardNumber(formatCardNumber(v))
                        }
                        cardName={cardName}
                        setCardName={setCardName}
                        expiry={expiry}
                        setExpiry={(v) => setExpiry(formatExpiry(v))}
                        cvv={cvv}
                        setCvv={(v) => setCvv(v.replace(/\D/g, "").slice(0, 3))}
                        saveCard={saveCard}
                        setSaveCard={setSaveCard}
                        agreeDistance={agreeDistance}
                        setAgreeDistance={setAgreeDistance}
                        agreeKvkk={agreeKvkk}
                        setAgreeKvkk={setAgreeKvkk}
                        agreeCancellation={agreeCancellation}
                        setAgreeCancellation={setAgreeCancellation}
                        onBack={() => setStep(1)}
                        onComplete={handleCompletePurchase}
                        isValid={!!isStep2Valid && allAgreementsAccepted}
                        isProcessing={isProcessing}
                      />
                    )}
                  </AnimatePresence>
                </div>

                {/* Right: order summary */}
                <div>
                  <FadeInUp delay={0.2}>
                    <OrderSummary
                      event={event}
                      ticketQty={ticketQty}
                      setTicketQty={setTicketQty}
                      selectedTicketIdx={selectedTicketIdx}
                      setSelectedTicketIdx={setSelectedTicketIdx}
                      subtotal={subtotal}
                      serviceFee={serviceFee}
                      discountAmount={discountAmount}
                      total={total}
                      couponCode={couponCode}
                      setCouponCode={setCouponCode}
                      couponApplied={couponApplied}
                      couponError={couponError}
                      handleApplyCoupon={handleApplyCoupon}
                      t={t}
                    />
                  </FadeInUp>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

/* ============================================
   INPUT COMPONENT
   ============================================ */
function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  icon: Icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  icon?: React.ComponentType<{ size: number; className?: string }>;
}) {
  return (
    <div>
      <label className="text-xs text-muted mb-1.5 block">
        {label}
        {required && <span className="text-primary ml-0.5">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
          />
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full ${Icon ? "pl-10" : "pl-4"} pr-4 py-3 glass rounded-xl text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-white/20`}
        />
      </div>
    </div>
  );
}

/* ============================================
   CHECKBOX COMPONENT
   ============================================ */
function AgreementCheck({
  checked,
  onChange,
  label,
  detail,
  href,
  t,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  detail: string;
  href: string;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="flex items-start gap-3 group">
      <div
        className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all cursor-pointer ${
          checked
            ? "bg-primary border-primary"
            : "border-white/20 hover:border-white/40"
        }`}
        onClick={() => onChange(!checked)}
        data-cursor-hover
      >
        {checked && <Check size={12} className="text-white" />}
      </div>
      <div className="flex-1">
        <p
          className="text-xs text-white/70 group-hover:text-white transition-colors cursor-pointer"
          onClick={() => onChange(!checked)}
        >
          {detail}
        </p>
        <Link
          href={href}
          target="_blank"
          className="text-[10px] text-primary hover:underline mt-0.5 inline-block"
          data-cursor-hover
        >
          {t("readMore")}: {label}
        </Link>
      </div>
    </div>
  );
}

/* ============================================
   STEP 1: USER & BILLING INFO
   ============================================ */
function Step1Info({
  t,
  fullName,
  setFullName,
  email,
  setEmail,
  phone,
  setPhone,
  tcNo,
  setTcNo,
  invoiceType,
  setInvoiceType,
  companyName,
  setCompanyName,
  taxOffice,
  setTaxOffice,
  taxNo,
  setTaxNo,
  invoiceAddress,
  setInvoiceAddress,
  city,
  setCity,
  district,
  setDistrict,
  selectedSection,
  setSelectedSection,
  onNext,
  isValid,
}: {
  t: ReturnType<typeof useTranslations>;
  fullName: string;
  setFullName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  tcNo: string;
  setTcNo: (v: string) => void;
  invoiceType: "individual" | "corporate";
  setInvoiceType: (v: "individual" | "corporate") => void;
  companyName: string;
  setCompanyName: (v: string) => void;
  taxOffice: string;
  setTaxOffice: (v: string) => void;
  taxNo: string;
  setTaxNo: (v: string) => void;
  invoiceAddress: string;
  setInvoiceAddress: (v: string) => void;
  city: string;
  setCity: (v: string) => void;
  district: string;
  setDistrict: (v: string) => void;
  selectedSection: "backstage" | "vip" | "general";
  setSelectedSection: (v: "backstage" | "vip" | "general") => void;
  onNext: () => void;
  isValid: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Personal Info */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <User size={16} className="text-primary" />
          </div>
          {t("userInfo")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label={t("fullName")}
            value={fullName}
            onChange={setFullName}
            required
            icon={User}
          />
          <InputField
            label={t("email")}
            value={email}
            onChange={setEmail}
            type="email"
            required
          />
          <InputField
            label={t("phone")}
            value={phone}
            onChange={setPhone}
            type="tel"
            required
            placeholder="05XX XXX XX XX"
          />
          <InputField
            label={t("tcNo")}
            value={tcNo}
            onChange={setTcNo}
            placeholder="Opsiyonel"
          />
        </div>
      </div>

      {/* Billing Info */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
            <FileText size={16} className="text-secondary" />
          </div>
          {t("invoiceInfo")}
        </h2>

        {/* Invoice type toggle */}
        <div className="flex gap-2 mb-5">
          {(["individual", "corporate"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setInvoiceType(type)}
              className={`px-5 py-2 rounded-full text-xs font-medium transition-all ${
                invoiceType === type
                  ? "bg-primary text-white shadow-[0_0_20px_rgba(255,45,85,0.3)]"
                  : "glass text-muted hover:text-foreground"
              }`}
              data-cursor-hover
            >
              {t(type)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {invoiceType === "corporate" && (
            <>
              <InputField
                label={t("companyName")}
                value={companyName}
                onChange={setCompanyName}
                required
                icon={Building2}
              />
              <InputField
                label={t("taxOffice")}
                value={taxOffice}
                onChange={setTaxOffice}
                required
              />
              <InputField
                label={t("taxNo")}
                value={taxNo}
                onChange={setTaxNo}
                required
              />
            </>
          )}
          <div className="md:col-span-2">
            <InputField
              label={t("invoiceAddress")}
              value={invoiceAddress}
              onChange={setInvoiceAddress}
              required
            />
          </div>
          <InputField
            label={t("city")}
            value={city}
            onChange={setCity}
            required
          />
          <InputField
            label={t("district")}
            value={district}
            onChange={setDistrict}
          />
        </div>
      </div>

      {/* Next button */}
      <motion.button
        onClick={onNext}
        disabled={!isValid}
        className={`w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
          isValid
            ? "bg-primary text-white hover:bg-primary/90 shadow-[0_0_30px_rgba(255,45,85,0.2)]"
            : "glass text-muted cursor-not-allowed"
        }`}
        whileHover={isValid ? { scale: 1.01 } : {}}
        whileTap={isValid ? { scale: 0.99 } : {}}
        data-cursor-hover
      >
        {t("steps.payment")}
        <ChevronRight size={16} />
      </motion.button>
    </motion.div>
  );
}

/* ============================================
   STEP 2: PAYMENT & AGREEMENTS
   ============================================ */
function Step2Payment({
  t,
  cardNumber,
  setCardNumber,
  cardName,
  setCardName,
  expiry,
  setExpiry,
  cvv,
  setCvv,
  saveCard,
  setSaveCard,
  agreeDistance,
  setAgreeDistance,
  agreeKvkk,
  setAgreeKvkk,
  agreeCancellation,
  setAgreeCancellation,
  onBack,
  onComplete,
  isValid,
  isProcessing,
}: {
  t: ReturnType<typeof useTranslations>;
  cardNumber: string;
  setCardNumber: (v: string) => void;
  cardName: string;
  setCardName: (v: string) => void;
  expiry: string;
  setExpiry: (v: string) => void;
  cvv: string;
  setCvv: (v: string) => void;
  saveCard: boolean;
  setSaveCard: (v: boolean) => void;
  agreeDistance: boolean;
  setAgreeDistance: (v: boolean) => void;
  agreeKvkk: boolean;
  setAgreeKvkk: (v: boolean) => void;
  agreeCancellation: boolean;
  setAgreeCancellation: (v: boolean) => void;
  onBack: () => void;
  onComplete: () => void;
  isValid: boolean;
  isProcessing: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-6"
    >
      {/* Payment Info */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <CreditCard size={16} className="text-primary" />
          </div>
          {t("paymentInfo")}
        </h2>
        <div className="space-y-4">
          <InputField
            label={t("cardNumber")}
            value={cardNumber}
            onChange={setCardNumber}
            placeholder="0000 0000 0000 0000"
            required
            icon={CreditCard}
          />
          <InputField
            label={t("cardName")}
            value={cardName}
            onChange={setCardName}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label={t("expiry")}
              value={expiry}
              onChange={setExpiry}
              placeholder="AA/YY"
              required
            />
            <InputField
              label={t("cvv")}
              value={cvv}
              onChange={setCvv}
              placeholder="•••"
              required
              icon={Lock}
            />
          </div>

          {/* Save card */}
          <label
            className="flex items-center gap-3 cursor-pointer"
            data-cursor-hover
          >
            <div
              className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                saveCard ? "bg-primary border-primary" : "border-white/20"
              }`}
              onClick={() => setSaveCard(!saveCard)}
            >
              {saveCard && <Check size={12} className="text-white" />}
            </div>
            <span className="text-xs text-white/60">{t("saveCard")}</span>
          </label>

          <div className="flex items-center gap-2 text-[10px] text-green-400 mt-2">
            <Lock size={10} />
            {t("securePayment")}
          </div>
        </div>
      </div>

      {/* Agreements */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
            <Shield size={16} className="text-gold" />
          </div>
          {t("agreements")}
        </h2>
        <div className="space-y-4">
          <AgreementCheck
            checked={agreeDistance}
            onChange={setAgreeDistance}
            label={t("distanceSales")}
            detail={t("distanceSalesText")}
            href="/legal/distance-sales"
            t={t}
          />
          <AgreementCheck
            checked={agreeKvkk}
            onChange={setAgreeKvkk}
            label={t("kvkk")}
            detail={t("kvkkText")}
            href="/legal/kvkk"
            t={t}
          />
          <AgreementCheck
            checked={agreeCancellation}
            onChange={setAgreeCancellation}
            label={t("cancellationAgreement")}
            detail={t("cancellationText")}
            href="/legal/cancellation"
            t={t}
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3.5 glass rounded-xl text-sm font-medium text-muted hover:text-foreground transition-colors flex items-center justify-center gap-2"
          data-cursor-hover
        >
          <ArrowLeft size={14} />
          {t("steps.info")}
        </button>
        <motion.button
          onClick={onComplete}
          disabled={!isValid || isProcessing}
          className={`flex-[2] py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            isValid && !isProcessing
              ? "bg-primary text-white hover:bg-primary/90 shadow-[0_0_30px_rgba(255,45,85,0.2)]"
              : "glass text-muted cursor-not-allowed"
          }`}
          whileHover={isValid && !isProcessing ? { scale: 1.01 } : {}}
          whileTap={isValid && !isProcessing ? { scale: 0.99 } : {}}
          data-cursor-hover
        >
          {isProcessing ? (
            <>
              <motion.div
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              {t("processing")}
            </>
          ) : (
            <>
              <Lock size={14} />
              {t("completePurchase")}
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ============================================
   ORDER SUMMARY (Sidebar)
   ============================================ */
function OrderSummary({
  event,
  ticketQty,
  setTicketQty,
  selectedTicketIdx,
  setSelectedTicketIdx,
  subtotal,
  serviceFee,
  discountAmount,
  total,
  couponCode,
  setCouponCode,
  couponApplied,
  couponError,
  handleApplyCoupon,
  t,
}: {
  event: (typeof events)[0];
  ticketQty: number;
  setTicketQty: (v: number) => void;
  selectedTicketIdx: number;
  setSelectedTicketIdx: (v: number) => void;
  subtotal: number;
  serviceFee: number;
  discountAmount: number;
  total: number;
  couponCode: string;
  setCouponCode: (v: string) => void;
  couponApplied: boolean;
  couponError: boolean;
  handleApplyCoupon: () => void;
  t: ReturnType<typeof useTranslations>;
}) {
  const detail = event.detail!;

  return (
    <div className="glass rounded-2xl p-6 sticky top-28 space-y-5">
      {/* Event preview */}
      <div className="flex gap-4">
        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-sm truncate">{event.title}</h3>
          <p className="text-xs text-primary">{event.artist}</p>
          <div className="flex flex-wrap gap-2 mt-2 text-[10px] text-muted">
            <span className="flex items-center gap-1">
              <Calendar size={10} />
              {event.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={10} />
              {event.time}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-muted mt-1">
            <MapPin size={10} />
            {event.venue}, {event.city}
          </div>
        </div>
      </div>

      <div className="h-px bg-white/5" />

      {/* Ticket type */}
      <div>
        <p className="text-xs text-muted mb-2">{t("ticketType")}</p>
        <div className="space-y-2">
          {detail.ticketTypes
            .filter((tt) => tt.available)
            .map((tt) => {
              const actualIdx = detail.ticketTypes.indexOf(tt);
              return (
                <button
                  key={tt.name}
                  onClick={() => setSelectedTicketIdx(actualIdx)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
                    selectedTicketIdx === actualIdx
                      ? "bg-primary/10 ring-1 ring-primary/40"
                      : "glass hover:bg-white/5"
                  }`}
                  data-cursor-hover
                >
                  <span className="font-medium">{tt.name}</span>
                  <span className="font-bold text-gradient-primary">
                    {tt.price}
                  </span>
                </button>
              );
            })}
        </div>
      </div>

      {/* Quantity */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted">{t("quantity")}</p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setTicketQty(Math.max(1, ticketQty - 1))}
            className="w-7 h-7 rounded-lg glass flex items-center justify-center text-xs hover:bg-white/5 transition-colors"
            data-cursor-hover
          >
            −
          </button>
          <span className="text-sm font-bold w-6 text-center">{ticketQty}</span>
          <button
            onClick={() => setTicketQty(Math.min(10, ticketQty + 1))}
            className="w-7 h-7 rounded-lg glass flex items-center justify-center text-xs hover:bg-white/5 transition-colors"
            data-cursor-hover
          >
            +
          </button>
        </div>
      </div>

      <div className="h-px bg-white/5" />

      {/* Coupon */}
      <div>
        <p className="text-xs text-muted mb-2 flex items-center gap-1.5">
          <Tag size={11} />
          {t("coupon")}
        </p>
        <div className="flex gap-2">
          <input
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder={t("couponPlaceholder")}
            className="flex-1 px-3 py-2 glass rounded-lg text-xs bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-white/20"
          />
          <button
            onClick={handleApplyCoupon}
            className="px-4 py-2 bg-primary/10 text-primary text-xs font-medium rounded-lg hover:bg-primary/20 transition-colors"
            data-cursor-hover
          >
            {t("applyCoupon")}
          </button>
        </div>
        {couponApplied && (
          <p className="text-[10px] text-green-400 mt-1.5 flex items-center gap-1">
            <Sparkles size={10} />
            {t("couponApplied", { discount: "10%" })}
          </p>
        )}
        {couponError && (
          <p className="text-[10px] text-red-400 mt-1.5">
            {t("couponInvalid")}
          </p>
        )}
      </div>

      <div className="h-px bg-white/5" />

      {/* Pricing breakdown */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted">{t("subtotal")}</span>
          <span>₺{subtotal.toLocaleString("tr-TR")}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted">{t("serviceFee")}</span>
          <span>₺{serviceFee.toLocaleString("tr-TR")}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-xs text-green-400">
            <span>{t("discount")}</span>
            <span>-₺{discountAmount.toLocaleString("tr-TR")}</span>
          </div>
        )}
        <div className="h-px bg-white/10" />
        <div className="flex justify-between text-sm font-bold pt-1">
          <span>{t("total")}</span>
          <span className="text-gradient-primary text-lg">
            ₺{total.toLocaleString("tr-TR")}
          </span>
        </div>
      </div>
    </div>
  );
}
