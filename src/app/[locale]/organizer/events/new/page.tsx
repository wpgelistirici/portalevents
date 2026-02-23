"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useOrganizer } from "@/lib/organizer-context";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { artists as allArtists, venues as allVenues, genres } from "@/lib/data";
import type { OrganizerEvent, EventStatus } from "@/lib/data";
import CustomSelect from "@/components/ui/CustomSelect";
import type { SelectOption } from "@/components/ui/CustomSelect";
import { ImageUpload, MultiImageUpload } from "@/components/ui/ImageUpload";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  X,
  AlertTriangle,
  Save,
  Send,
  Music,
  MapPin,
  Ticket,
  Shield,
  Eye,
  Info,
} from "lucide-react";

const STEPS = ["basic", "dateLocation", "artists", "tickets", "rules", "preview"];

export default function NewEventPage() {
  const t = useTranslations("OrganizerPanel");
  const locale = useLocale();
  const router = useRouter();
  const { addEvent, submitForApproval } = useOrganizer();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("Electronic");
  const [image, setImage] = useState("https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop");
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);

  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedVenue, setSelectedVenue] = useState("");
  const [city, setCity] = useState("İstanbul");
  const [address, setAddress] = useState("");

  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [missingArtistName, setMissingArtistName] = useState("");
  const [missingArtists, setMissingArtists] = useState<string[]>([]);
  const [showArtistTicketForm, setShowArtistTicketForm] = useState(false);
  const [artistTicketGenre, setArtistTicketGenre] = useState("");
  const [artistTicketDesc, setArtistTicketDesc] = useState("");

  const [ticketTypes, setTicketTypes] = useState([
    { name: "General Admission", price: "", description: "Standart giriş bileti", available: true },
  ]);

  const [selectedRules, setSelectedRules] = useState<string[]>(["ruleAge", "ruleId"]);
  const [customRules, setCustomRules] = useState<string[]>([]);
  const [newCustomRule, setNewCustomRule] = useState("");
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>(["cancel7Days", "cancel3Days", "cancelNoRefund"]);

  const [price, setPrice] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const ruleOptions = ["ruleAge", "ruleId", "ruleReentry", "ruleRecording", "ruleSubstance", "ruleDressCode"];
  const policyOptions = ["cancel7Days", "cancel3Days", "cancelNoRefund", "cancelTransfer"];
  const { createArtistTicket } = useOrganizer();

  const stepIcons = [Info, MapPin, Music, Ticket, Shield, Eye];

  const venue = allVenues.find((v) => v.id === selectedVenue);

  const handleSave = (submitApproval: boolean) => {
    setIsSaving(true);

    const formattedDate = startDate
      ? new Date(startDate).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" })
      : "";

    const eventData: Omit<OrganizerEvent, "id" | "createdAt" | "updatedAt"> = {
      title,
      artist: selectedArtists.map((id) => allArtists.find((a) => a.id === id)?.name || "").join(", ") || missingArtists.join(", ") || "TBA",
      venue: venue?.name || "",
      date: formattedDate,
      time: startTime,
      city,
      image,
      genre,
      price: price ? `₺${price}` : ticketTypes[0]?.price ? `₺${ticketTypes[0].price}` : "₺0",
      trending: false,
      detail: {
        description,
        endDate: endDate
          ? new Date(endDate).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" })
          : formattedDate,
        endTime: endTime || startTime,
        address: address || venue?.detail?.address || "",
        lat: venue?.detail?.lat || 41.0082,
        lng: venue?.detail?.lng || 28.9784,
        media: [
          { type: "image" as const, url: image },
          ...mediaUrls.map((url) => ({ type: "image" as const, url })),
        ],
        rules: [...selectedRules, ...customRules],
        cancellationPolicy: selectedPolicies,
        attendees: [],
        organizerId: user?.organizerProfile?.organizerId || "org1",
        organizerName: user?.organizerProfile?.organizerName || user?.name || "",
        organizerLogo: user?.organizerProfile?.organizerLogo || user?.avatar || "",
        organizerDescription: user?.organizerProfile?.organizerDescription || "",
        ticketTypes: ticketTypes.map((tt) => ({
          name: tt.name,
          price: tt.price ? `₺${tt.price}` : "₺0",
          description: tt.description,
          available: tt.available,
        })),
      },
      status: submitApproval ? ("pending_approval" as EventStatus) : ("draft" as EventStatus),
      artistIds: selectedArtists,
      missingArtists,
      dopings: [],
    };

    const created = addEvent(eventData);

    setTimeout(() => {
      setIsSaving(false);
      router.push(`/${locale}/organizer/events`);
    }, 500);
  };

  const handleArtistTicketSubmit = () => {
    if (missingArtistName) {
      createArtistTicket({
        organizerId: user?.organizerProfile?.organizerId || "org1",
        artistName: missingArtistName,
        genre: artistTicketGenre,
        description: artistTicketDesc,
      });
      setMissingArtists((prev) => [...prev, missingArtistName]);
      setMissingArtistName("");
      setArtistTicketGenre("");
      setArtistTicketDesc("");
      setShowArtistTicketForm(false);
    }
  };

  const addTicketType = () => {
    setTicketTypes((prev) => [
      ...prev,
      { name: "", price: "", description: "", available: true },
    ]);
  };

  const removeTicketType = (idx: number) => {
    setTicketTypes((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateTicketType = (idx: number, field: string, value: string | boolean) => {
    setTicketTypes((prev) =>
      prev.map((tt, i) => (i === idx ? { ...tt, [field]: value } : tt)),
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">{t("eventForm.title")}</h1>
          <p className="text-white/50 text-sm">{t("eventForm.subtitle")}</p>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {STEPS.map((step, idx) => {
          const Icon = stepIcons[idx];
          return (
            <button
              key={step}
              onClick={() => setCurrentStep(idx)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                idx === currentStep
                  ? "bg-[#FF2D55]/10 text-[#FF2D55] border border-[#FF2D55]/30"
                  : idx < currentStep
                    ? "bg-green-400/10 text-green-400 border border-green-400/20"
                    : "text-white/30 hover:text-white/50 border border-transparent"
              }`}
            >
              {idx < currentStep ? (
                <Check className="w-4 h-4" />
              ) : (
                <Icon className="w-4 h-4" />
              )}
              {t(`eventForm.steps.${step}`)}
            </button>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-8">
        {/* Step 1: Basic Info */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">{t("eventForm.eventName")}</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("eventForm.eventNamePlaceholder")}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF2D55]/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">{t("eventForm.description")}</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("eventForm.descriptionPlaceholder")}
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF2D55]/50 resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">{t("eventForm.genre")}</label>
                <CustomSelect
                  value={genre}
                  onChange={(val) => setGenre(val)}
                  options={genres.filter((g) => g !== "Tümü").map((g) => ({ value: g, label: g }))}
                  placeholder={t("eventForm.genre")}
                  searchable={false}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">{t("eventForm.price")}</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">₺</span>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="450"
                    className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF2D55]/50"
                  />
                </div>
              </div>
            </div>
            <ImageUpload
              value={image}
              onChange={setImage}
              label={t("eventForm.coverImage")}
              height="h-48"
            />
            <MultiImageUpload
              values={mediaUrls}
              onChange={setMediaUrls}
              label={t("eventForm.mediaGallery")}
              maxImages={10}
            />
          </div>
        )}

        {/* Step 2: Date & Location */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">{t("eventForm.startDate")}</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#FF2D55]/50 [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">{t("eventForm.startTime")}</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#FF2D55]/50 [color-scheme:dark]"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">{t("eventForm.endDate")}</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#FF2D55]/50 [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">{t("eventForm.endTime")}</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#FF2D55]/50 [color-scheme:dark]"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">{t("eventForm.venue")}</label>
              <CustomSelect
                value={selectedVenue}
                onChange={(val) => {
                  setSelectedVenue(val);
                  const v = allVenues.find((v) => v.id === val);
                  if (v) {
                    setCity(v.city);
                    if (v.detail) setAddress(v.detail.address);
                  }
                }}
                options={allVenues.map((v) => ({
                  value: v.id,
                  label: `${v.name} — ${v.city}`,
                  description: `${v.type} · ${v.capacity} kişilik`,
                }))}
                placeholder={t("eventForm.selectVenue")}
                searchable={true}
                clearable={true}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">{t("eventForm.city")}</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#FF2D55]/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">{t("eventForm.address")}</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={t("eventForm.addressPlaceholder")}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF2D55]/50"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Artists */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-3">{t("eventForm.selectArtists")}</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {allArtists.map((artist) => (
                  <button
                    key={artist.id}
                    onClick={() => {
                      setSelectedArtists((prev) =>
                        prev.includes(artist.id) ? prev.filter((id) => id !== artist.id) : [...prev, artist.id],
                      );
                    }}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      selectedArtists.includes(artist.id)
                        ? "bg-[#FF2D55]/10 border-[#FF2D55]/30 text-white"
                        : "bg-white/5 border-white/10 text-white/60 hover:border-white/20"
                    }`}
                  >
                    <img src={artist.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    <div className="text-left min-w-0">
                      <p className="text-sm font-medium truncate">{artist.name}</p>
                      <p className="text-xs opacity-50">{artist.genre}</p>
                    </div>
                    {selectedArtists.includes(artist.id) && (
                      <Check className="w-4 h-4 text-[#FF2D55] ml-auto flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Missing Artists */}
            {missingArtists.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">{t("eventForm.addedArtists")}</label>
                <div className="flex flex-wrap gap-2">
                  {missingArtists.map((name, idx) => (
                    <span key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-400/10 text-yellow-400 text-sm border border-yellow-400/20">
                      {name}
                      <button onClick={() => setMissingArtists((prev) => prev.filter((_, i) => i !== idx))}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Artist Ticket Form */}
            <div className="border-t border-white/10 pt-6">
              {!showArtistTicketForm ? (
                <button
                  onClick={() => setShowArtistTicketForm(true)}
                  className="flex items-center gap-2 text-sm text-[#FF2D55] hover:text-[#FF2D55]/80 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  {t("eventForm.artistNotFound")}
                </button>
              ) : (
                <div className="space-y-4 p-4 rounded-xl bg-yellow-400/5 border border-yellow-400/20">
                  <h4 className="text-sm font-medium text-yellow-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    {t("eventForm.artistTicketTitle")}
                  </h4>
                  <input
                    type="text"
                    value={missingArtistName}
                    onChange={(e) => setMissingArtistName(e.target.value)}
                    placeholder={t("eventForm.artistName")}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-yellow-400/50"
                  />
                  <input
                    type="text"
                    value={artistTicketGenre}
                    onChange={(e) => setArtistTicketGenre(e.target.value)}
                    placeholder={t("eventForm.artistGenre")}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-yellow-400/50"
                  />
                  <textarea
                    value={artistTicketDesc}
                    onChange={(e) => setArtistTicketDesc(e.target.value)}
                    placeholder={t("eventForm.artistDescription")}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-yellow-400/50 resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleArtistTicketSubmit}
                      className="px-4 py-2 rounded-lg bg-yellow-400/10 text-yellow-400 text-sm font-medium hover:bg-yellow-400/20 transition-colors"
                    >
                      {t("eventForm.submitTicket")}
                    </button>
                    <button
                      onClick={() => setShowArtistTicketForm(false)}
                      className="px-4 py-2 rounded-lg text-white/40 text-sm hover:text-white/60 transition-colors"
                    >
                      {t("eventForm.cancel")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Ticket Types */}
        {currentStep === 3 && (
          <div className="space-y-6">
            {ticketTypes.map((tt, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-white/70">
                    {t("eventForm.ticketType")} #{idx + 1}
                  </h4>
                  {ticketTypes.length > 1 && (
                    <button
                      onClick={() => removeTicketType(idx)}
                      className="p-1 rounded text-white/30 hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={tt.name}
                    onChange={(e) => updateTicketType(idx, "name", e.target.value)}
                    placeholder={t("eventForm.ticketName")}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF2D55]/50"
                  />
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">₺</span>
                    <input
                      type="text"
                      value={tt.price}
                      onChange={(e) => updateTicketType(idx, "price", e.target.value)}
                      placeholder="450"
                      className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF2D55]/50"
                    />
                  </div>
                </div>
                <input
                  type="text"
                  value={tt.description}
                  onChange={(e) => updateTicketType(idx, "description", e.target.value)}
                  placeholder={t("eventForm.ticketDescription")}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF2D55]/50"
                />
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                      tt.available ? "bg-[#FF2D55] border-[#FF2D55]" : "border-white/20"
                    }`}
                    onClick={() => updateTicketType(idx, "available", !tt.available)}
                  >
                    {tt.available && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-sm text-white/60">{t("eventForm.ticketAvailable")}</span>
                </label>
              </div>
            ))}
            <button
              onClick={addTicketType}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-white/20 text-white/40 hover:text-white/60 hover:border-white/30 w-full justify-center transition-colors"
            >
              <Plus className="w-4 h-4" />
              {t("eventForm.addTicketType")}
            </button>
          </div>
        )}

        {/* Step 5: Rules & Policies */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-3">{t("eventForm.eventRules")}</label>
              <div className="space-y-2">
                {ruleOptions.map((rule) => (
                  <label key={rule} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/10 cursor-pointer hover:bg-white/5 transition-colors">
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                        selectedRules.includes(rule) ? "bg-[#FF2D55] border-[#FF2D55]" : "border-white/20"
                      }`}
                      onClick={() =>
                        setSelectedRules((prev) =>
                          prev.includes(rule) ? prev.filter((r) => r !== rule) : [...prev, rule],
                        )
                      }
                    >
                      {selectedRules.includes(rule) && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-sm text-white/70">{t(`eventForm.rules.${rule}`)}</span>
                  </label>
                ))}
              </div>
              {/* Custom Rules */}
              <div className="mt-4 space-y-2">
                {customRules.map((rule, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/10">
                    <span className="text-sm text-white/70 flex-1">{rule}</span>
                    <button onClick={() => setCustomRules((prev) => prev.filter((_, i) => i !== idx))}>
                      <X className="w-4 h-4 text-white/30 hover:text-red-400" />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={newCustomRule}
                    onChange={(e) => setNewCustomRule(e.target.value)}
                    placeholder={t("eventForm.customRulePlaceholder")}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF2D55]/50"
                  />
                  <button
                    onClick={() => {
                      if (newCustomRule) {
                        setCustomRules((prev) => [...prev, newCustomRule]);
                        setNewCustomRule("");
                      }
                    }}
                    className="px-4 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-3">{t("eventForm.cancellationPolicy")}</label>
              <div className="space-y-2">
                {policyOptions.map((policy) => (
                  <label key={policy} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/10 cursor-pointer hover:bg-white/5 transition-colors">
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                        selectedPolicies.includes(policy) ? "bg-[#FF2D55] border-[#FF2D55]" : "border-white/20"
                      }`}
                      onClick={() =>
                        setSelectedPolicies((prev) =>
                          prev.includes(policy) ? prev.filter((p) => p !== policy) : [...prev, policy],
                        )
                      }
                    >
                      {selectedPolicies.includes(policy) && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-sm text-white/70">{t(`eventForm.policies.${policy}`)}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Preview */}
        {currentStep === 5 && (
          <div className="space-y-6">
            {/* Approval Notice */}
            <div className="p-4 rounded-xl bg-yellow-400/5 border border-yellow-400/20 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-400">{t("eventForm.approvalNotice")}</p>
                <p className="text-xs text-white/40 mt-1">{t("eventForm.approvalNoticeDesc")}</p>
              </div>
            </div>

            {/* Preview Card */}
            <div className="rounded-2xl overflow-hidden border border-white/10">
              {image && (
                <div className="h-48 overflow-hidden">
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-white">{title || t("eventForm.untitled")}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-white/40">{t("eventForm.genre")}: </span>
                    <span className="text-white">{genre}</span>
                  </div>
                  <div>
                    <span className="text-white/40">{t("eventForm.city")}: </span>
                    <span className="text-white">{city}</span>
                  </div>
                  <div>
                    <span className="text-white/40">{t("eventForm.startDate")}: </span>
                    <span className="text-white">{startDate} {startTime}</span>
                  </div>
                  <div>
                    <span className="text-white/40">{t("eventForm.venue")}: </span>
                    <span className="text-white">{venue?.name || "-"}</span>
                  </div>
                </div>
                {description && <p className="text-sm text-white/60 line-clamp-3">{description}</p>}
                <div>
                  <h4 className="text-sm font-medium text-white/70 mb-2">{t("eventForm.ticketTypes")}</h4>
                  <div className="space-y-1">
                    {ticketTypes.map((tt, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-white/60">{tt.name || `Tip ${idx + 1}`}</span>
                        <span className="text-white">{tt.price ? `₺${tt.price}` : "-"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <button
          onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("eventForm.previous")}
        </button>

        <div className="flex items-center gap-3">
          {currentStep === STEPS.length - 1 ? (
            <>
              <button
                onClick={() => handleSave(false)}
                disabled={isSaving}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 disabled:opacity-50 transition-colors"
              >
                <Save className="w-4 h-4" />
                {t("eventForm.saveDraft")}
              </button>
              <button
                onClick={() => handleSave(true)}
                disabled={isSaving || !title}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FF2D55] text-white font-medium hover:bg-[#FF2D55]/80 disabled:opacity-50 transition-colors"
              >
                <Send className="w-4 h-4" />
                {t("eventForm.submitForApproval")}
              </button>
            </>
          ) : (
            <button
              onClick={() => setCurrentStep((s) => Math.min(STEPS.length - 1, s + 1))}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FF2D55] text-white font-medium hover:bg-[#FF2D55]/80 transition-colors"
            >
              {t("eventForm.next")}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
