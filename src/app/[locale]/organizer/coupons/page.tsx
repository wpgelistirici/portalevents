"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useOrganizer } from "@/lib/organizer-context";
import CustomSelect from "@/components/ui/CustomSelect";
import { Tag, Plus, Trash2, X, Check, Percent, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CouponsPage() {
  const t = useTranslations("OrganizerPanel.coupons");
  const { coupons, addCoupon, deleteCoupon, organizerEvents } = useOrganizer();
  const [showForm, setShowForm] = useState(false);

  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percent" | "fixed">("percent");
  const [discountValue, setDiscountValue] = useState("");
  const [eventId, setEventId] = useState("");
  const [maxUsage, setMaxUsage] = useState("100");
  const [expiresAt, setExpiresAt] = useState("");

  const eventOptions = [
    { value: "", label: t("allEvents") },
    ...organizerEvents.filter((e) => e.status === "approved").map((e) => ({ value: e.id, label: e.title })),
  ];

  const handleCreate = () => {
    if (!code || !discountValue || !expiresAt) return;
    addCoupon({
      code: code.toUpperCase(),
      discountType,
      discountValue: parseFloat(discountValue),
      eventId: eventId || undefined,
      maxUsage: parseInt(maxUsage) || 100,
      expiresAt,
    });
    setCode("");
    setDiscountValue("");
    setEventId("");
    setMaxUsage("100");
    setExpiresAt("");
    setShowForm(false);
  };

  const getCouponStatus = (c: typeof coupons[0]) => {
    if (c.usedCount >= c.maxUsage) return "depleted";
    if (new Date(c.expiresAt) < new Date()) return "expired";
    return "active";
  };

  const statusStyles: Record<string, string> = {
    active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    expired: "bg-white/5 text-white/40 border-white/10",
    depleted: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Tag className="w-7 h-7 text-[#7B61FF]" />
            {t("title")}
          </h1>
          <p className="text-white/50 mt-1">{t("subtitle")}</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#7B61FF] text-white font-medium hover:bg-[#7B61FF]/80 transition-all">
          <Plus className="w-5 h-5" />
          {t("newCoupon")}
        </button>
      </div>

      {/* Create Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 space-y-6 overflow-hidden">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">{t("createTitle")}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">{t("code")}</label>
                <input type="text" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="YENI2026" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#7B61FF]/50 uppercase" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">{t("discountType")}</label>
                <div className="flex gap-2">
                  <button onClick={() => setDiscountType("percent")} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-colors ${discountType === "percent" ? "bg-[#7B61FF]/10 border-[#7B61FF]/30 text-[#7B61FF]" : "bg-white/5 border-white/10 text-white/50"}`}>
                    <Percent className="w-4 h-4" /> {t("percent")}
                  </button>
                  <button onClick={() => setDiscountType("fixed")} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-colors ${discountType === "fixed" ? "bg-[#7B61FF]/10 border-[#7B61FF]/30 text-[#7B61FF]" : "bg-white/5 border-white/10 text-white/50"}`}>
                    <DollarSign className="w-4 h-4" /> {t("fixed")}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">{t("discountValue")}</label>
                <input type="number" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} placeholder={discountType === "percent" ? "10" : "50"} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#7B61FF]/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">{t("maxUsage")}</label>
                <input type="number" value={maxUsage} onChange={(e) => setMaxUsage(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#7B61FF]/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">{t("expiresAt")}</label>
                <input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#7B61FF]/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">{t("targetEvent")}</label>
                <CustomSelect options={eventOptions} value={eventId} onChange={setEventId} searchable={false} />
              </div>
            </div>
            <button onClick={handleCreate} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#7B61FF] text-white font-medium hover:bg-[#7B61FF]/80 transition-colors">
              <Check className="w-4 h-4" />
              {t("create")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Coupons List */}
      {coupons.length === 0 ? (
        <div className="text-center py-16">
          <Tag className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40">{t("noCoupons")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {coupons.map((c) => {
            const status = getCouponStatus(c);
            return (
              <div key={c.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                <div className="w-12 h-12 rounded-xl bg-[#7B61FF]/10 flex items-center justify-center flex-shrink-0">
                  <Tag className="w-5 h-5 text-[#7B61FF]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-mono font-bold text-lg">{c.code}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${statusStyles[status]}`}>{t(`status.${status}`)}</span>
                  </div>
                  <p className="text-sm text-white/40 mt-0.5">
                    {c.discountType === "percent" ? `%${c.discountValue}` : `₺${c.discountValue}`} {t("discount")} · {c.usedCount}/{c.maxUsage} {t("used")} · {new Date(c.expiresAt).toLocaleDateString("tr-TR")} {t("until")}
                  </p>
                </div>
                <button onClick={() => deleteCoupon(c.id)} className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
