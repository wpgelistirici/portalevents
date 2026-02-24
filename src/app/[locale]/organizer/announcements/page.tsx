"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useOrganizer } from "@/lib/organizer-context";
import CustomSelect from "@/components/ui/CustomSelect";
import { Megaphone, Plus, X, Send, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AnnouncementsPage() {
  const t = useTranslations("OrganizerPanel.announcements");
  const { announcements, addAnnouncement, organizerEvents } = useOrganizer();
  const [showForm, setShowForm] = useState(false);
  const [eventId, setEventId] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const approvedEvents = organizerEvents.filter((e) => e.status === "approved");
  const eventOptions = approvedEvents.map((e) => ({ value: e.id, label: e.title }));

  const handleSend = () => {
    if (!eventId || !title || !message) return;
    const ev = organizerEvents.find((e) => e.id === eventId);
    addAnnouncement({ eventId, eventTitle: ev?.title || "", title, message });
    setTitle("");
    setMessage("");
    setEventId("");
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Megaphone className="w-7 h-7 text-[#7B61FF]" />
            {t("title")}
          </h1>
          <p className="text-white/50 mt-1">{t("subtitle")}</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#7B61FF] text-white font-medium hover:bg-[#7B61FF]/80 transition-all">
          <Plus className="w-5 h-5" />
          {t("newAnnouncement")}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 space-y-6 overflow-hidden">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">{t("createTitle")}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5"><X className="w-4 h-4" /></button>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">{t("targetEvent")}</label>
              <CustomSelect options={eventOptions} value={eventId} onChange={setEventId} placeholder={t("selectEvent")} />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">{t("announcementTitle")}</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t("titlePlaceholder")} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#7B61FF]/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">{t("messageLabel")}</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder={t("messagePlaceholder")} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#7B61FF]/50 resize-none" />
            </div>
            <button onClick={handleSend} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#7B61FF] text-white font-medium hover:bg-[#7B61FF]/80 transition-colors">
              <Send className="w-4 h-4" />
              {t("send")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {announcements.length === 0 ? (
        <div className="text-center py-16">
          <Megaphone className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40">{t("noAnnouncements")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => (
            <div key={a.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#7B61FF]/10 text-[#7B61FF] border border-[#7B61FF]/20">{a.eventTitle}</span>
                </div>
                <span className="text-[10px] text-white/20 flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(a.createdAt).toLocaleString("tr-TR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
              </div>
              <h3 className="text-white font-semibold">{a.title}</h3>
              <p className="text-sm text-white/50 mt-1">{a.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
