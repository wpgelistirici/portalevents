"use client";

import { useParams, useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useOrganizer } from "@/lib/organizer-context";
import { artists as allArtists, venues as allVenues, genres } from "@/lib/data";
import CustomSelect from "@/components/ui/CustomSelect";
import { ImageUpload, MultiImageUpload } from "@/components/ui/ImageUpload";
import { ArrowLeft, Save, Trash2, Send, Plus, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("OrganizerPanel");
  const { organizerEvents, updateEvent, deleteEvent, submitForApproval } = useOrganizer();

  const event = organizerEvents.find((e) => e.id === params.id);

  const [title, setTitle] = useState(event?.title || "");
  const [description, setDescription] = useState(event?.detail?.description || "");
  const [genre, setGenre] = useState(event?.genre || "Electronic");
  const [price, setPrice] = useState(event?.price || "");
  const [image, setImage] = useState(event?.image || "");
  const [mediaUrls, setMediaUrls] = useState<string[]>(event?.detail?.media?.map((m) => m.url) || []);
  const [venue, setVenue] = useState(event?.venue || "");
  const [city, setCity] = useState(event?.city || "İstanbul");
  const [address, setAddress] = useState(event?.detail?.address || "");
  const [startDate, setStartDate] = useState(event?.date || "");
  const [startTime, setStartTime] = useState(event?.time || "");
  const [endDate, setEndDate] = useState(event?.detail?.endDate || "");
  const [endTime, setEndTime] = useState(event?.detail?.endTime || "");
  const [selectedArtists, setSelectedArtists] = useState<string[]>(event?.artistIds || []);
  const [ticketTypes, setTicketTypes] = useState(
    event?.detail?.ticketTypes || [{ name: "General Admission", price: "", description: "Standart giriş bileti", available: true }],
  );
  const [selectedRules, setSelectedRules] = useState<string[]>(event?.detail?.rules || []);
  const [saving, setSaving] = useState(false);

  if (!event) {
    return (
      <div className="text-center py-16">
        <p className="text-white/40">{t("events.notFound")}</p>
        <Link href={`/${locale}/organizer/events`} className="text-[#FF2D55] text-sm mt-4 inline-block">{t("events.backToList")}</Link>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    draft: "text-white/50 bg-white/5",
    pending_approval: "text-yellow-400 bg-yellow-400/10",
    approved: "text-green-400 bg-green-400/10",
    rejected: "text-red-400 bg-red-400/10",
    cancelled: "text-white/30 bg-white/5",
  };

  const genreOptions = genres.map((g) => ({ value: g, label: g }));
  const venueOptions = allVenues.map((v) => ({ value: v.name, label: v.name, description: v.city }));
  const ruleOptions = ["ruleAge", "ruleId", "ruleReentry", "ruleRecording", "ruleSubstance", "ruleDressCode"];

  const handleSave = () => {
    setSaving(true);
    const sensitiveChanged = venue !== event.venue || startDate !== event.date || startTime !== event.time;
    const newStatus = event.status === "approved" && sensitiveChanged ? "pending_approval" : event.status;

    updateEvent(event.id, {
      title,
      genre,
      price,
      image,
      venue,
      city,
      date: startDate,
      time: startTime,
      artist: selectedArtists.length > 0 ? allArtists.find((a) => a.id === selectedArtists[0])?.name || event.artist : event.artist,
      artistIds: selectedArtists,
      status: newStatus as typeof event.status,
      detail: {
        ...(event.detail || {} as NonNullable<typeof event.detail>),
        description,
        address,
        endDate,
        endTime,
        media: mediaUrls.map((url) => ({ type: "image" as const, url })),
        ticketTypes,
        rules: selectedRules,
      },
    });
    setTimeout(() => {
      setSaving(false);
      router.push(`/${locale}/organizer/events`);
    }, 500);
  };

  const handleDelete = () => {
    deleteEvent(event.id);
    router.push(`/${locale}/organizer/events`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">{t("events.editTitle")}</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[event.status]}`}>{t(`status.${event.status}`)}</span>
          </div>
        </div>
      </div>

      {/* Rejection reason */}
      {event.status === "rejected" && event.rejectionReason && (
        <div className="p-4 rounded-xl bg-red-400/5 border border-red-400/20">
          <p className="text-sm text-red-400 font-medium">{t("events.rejectionReason")}</p>
          <p className="text-sm text-white/60 mt-1">{event.rejectionReason}</p>
        </div>
      )}

      {/* Basic Info */}
      <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 space-y-6">
        <h2 className="text-lg font-semibold text-white">{t("eventForm.steps.basic")}</h2>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">{t("eventForm.eventName")}</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#FF2D55]/50" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">{t("eventForm.description")}</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#FF2D55]/50 resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">{t("eventForm.genre")}</label>
            <CustomSelect options={genreOptions} value={genre} onChange={setGenre} searchable={false} />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">{t("eventForm.price")}</label>
            <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#FF2D55]/50" />
          </div>
        </div>
        <ImageUpload value={image} onChange={setImage} label={t("eventForm.coverImage")} />
        <MultiImageUpload values={mediaUrls} onChange={setMediaUrls} label={t("eventForm.mediaGallery")} maxImages={10} />
      </div>

      {/* Date & Location */}
      <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 space-y-6">
        <h2 className="text-lg font-semibold text-white">{t("eventForm.steps.dateLocation")}</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">{t("eventForm.startDate")}</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#FF2D55]/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">{t("eventForm.startTime")}</label>
            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#FF2D55]/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">{t("eventForm.endDate")}</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#FF2D55]/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">{t("eventForm.endTime")}</label>
            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#FF2D55]/50" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">{t("eventForm.venue")}</label>
          <CustomSelect options={venueOptions} value={venue} onChange={(v) => { setVenue(v); const found = allVenues.find((x) => x.name === v); if (found) setCity(found.city); }} />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">{t("eventForm.address")}</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#FF2D55]/50" />
        </div>
      </div>

      {/* Ticket Types */}
      <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 space-y-6">
        <h2 className="text-lg font-semibold text-white">{t("eventForm.ticketTypes")}</h2>
        {ticketTypes.map((tt, idx) => (
          <div key={idx} className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 relative">
            {ticketTypes.length > 1 && (
              <button onClick={() => setTicketTypes((prev) => prev.filter((_, i) => i !== idx))} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/30">
                <X className="w-3 h-3" />
              </button>
            )}
            <div>
              <label className="block text-xs text-white/50 mb-1">{t("eventForm.ticketName")}</label>
              <input type="text" value={tt.name} onChange={(e) => { const n = [...ticketTypes]; n[idx] = { ...n[idx], name: e.target.value }; setTicketTypes(n); }} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF2D55]/50" />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">{t("eventForm.price")}</label>
              <input type="text" value={tt.price} onChange={(e) => { const n = [...ticketTypes]; n[idx] = { ...n[idx], price: e.target.value }; setTicketTypes(n); }} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF2D55]/50" />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">{t("eventForm.ticketDescription")}</label>
              <input type="text" value={tt.description} onChange={(e) => { const n = [...ticketTypes]; n[idx] = { ...n[idx], description: e.target.value }; setTicketTypes(n); }} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF2D55]/50" />
            </div>
          </div>
        ))}
        <button onClick={() => setTicketTypes((prev) => [...prev, { name: "", price: "", description: "", available: true }])} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-white/10 text-white/40 text-sm hover:border-white/20 hover:text-white/60 transition-colors">
          <Plus className="w-4 h-4" />
          {t("eventForm.addTicketType")}
        </button>
      </div>

      {/* Rules */}
      <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 space-y-4">
        <h2 className="text-lg font-semibold text-white">{t("eventForm.eventRules")}</h2>
        <div className="grid grid-cols-2 gap-2">
          {ruleOptions.map((rule) => (
            <button key={rule} onClick={() => setSelectedRules((prev) => prev.includes(rule) ? prev.filter((r) => r !== rule) : [...prev, rule])} className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm transition-colors text-left ${selectedRules.includes(rule) ? "bg-[#FF2D55]/10 border border-[#FF2D55]/30 text-white" : "bg-white/[0.02] border border-white/5 text-white/50"}`}>
              <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedRules.includes(rule) ? "border-[#FF2D55] bg-[#FF2D55]" : "border-white/20"}`}>
                {selectedRules.includes(rule) && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
              </div>
              {t(`eventForm.rules.${rule}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors">
          <Trash2 className="w-4 h-4" />
          {t("events.delete")}
        </button>
        <div className="flex gap-3">
          {(event.status === "draft" || event.status === "rejected") && (
            <button onClick={() => { handleSave(); submitForApproval(event.id); }} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-yellow-400/10 text-yellow-400 font-medium hover:bg-yellow-400/20 transition-colors">
              <Send className="w-4 h-4" />
              {t("events.submitApproval")}
            </button>
          )}
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FF2D55] text-white font-medium hover:bg-[#FF2D55]/80 disabled:opacity-50 transition-colors">
            <Save className="w-4 h-4" />
            {saving ? t("events.saving") : t("events.save")}
          </button>
        </div>
      </div>
    </div>
  );
}
