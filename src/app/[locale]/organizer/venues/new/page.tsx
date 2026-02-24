"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useOrganizer } from "@/lib/organizer-context";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import type { OrganizerVenue, VenueDetail } from "@/lib/data";
import CustomSelect from "@/components/ui/CustomSelect";
import { ImageUpload, MultiImageUpload } from "@/components/ui/ImageUpload";
import { ArrowLeft, Save, Plus, X, Check } from "lucide-react";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const VENUE_TYPES = ["Concert Hall", "Club", "Arena", "Underground Club", "Open Air", "Bar", "Theater"];

export default function NewVenuePage() {
  const t = useTranslations("OrganizerPanel");
  const locale = useLocale();
  const router = useRouter();
  const { addVenue } = useOrganizer();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("İstanbul");
  const [capacity, setCapacity] = useState("");
  const [type, setType] = useState("Concert Hall");
  const [image, setImage] = useState("https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=500&fit=crop");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [youtube, setYoutube] = useState("");
  const [spotify, setSpotify] = useState("");
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [openingHours, setOpeningHours] = useState(
    DAYS.map((day) => ({ day, hours: "20:00 - 02:00", isOpen: true })),
  );
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    const detail: VenueDetail = {
      description,
      address,
      lat: 41.0082,
      lng: 28.9784,
      phone,
      email,
      website,
      social: {
        instagram: instagram || undefined,
        twitter: twitter || undefined,
        youtube: youtube || undefined,
        spotify: spotify || undefined,
      },
      openingHours,
      gallery: [image, ...galleryUrls],
    };

    addVenue({
      name,
      city,
      capacity,
      image,
      type,
      rating: 4.5,
      detail,
      organizerId: user?.organizerProfile?.organizerId || "org1",
      venueStatus: "active",
    });

    setTimeout(() => {
      setSaving(false);
      router.push(`/${locale}/organizer/venues`);
    }, 500);
  };

  const toggleDay = (idx: number) => {
    setOpeningHours((prev) =>
      prev.map((oh, i) =>
        i === idx ? { ...oh, isOpen: !oh.isOpen, hours: oh.isOpen ? "Kapalı" : "20:00 - 02:00" } : oh,
      ),
    );
  };

  const updateHours = (idx: number, hours: string) => {
    setOpeningHours((prev) => prev.map((oh, i) => (i === idx ? { ...oh, hours } : oh)));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">{t("venueForm.title")}</h1>
          <p className="text-white/50 text-sm">{t("venueForm.subtitle")}</p>
        </div>
      </div>

      {/* Basic Info */}
      <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 space-y-6">
        <h2 className="text-lg font-semibold text-white">{t("venueForm.basicInfo")}</h2>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">{t("venueForm.venueName")}</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={t("venueForm.venueNamePlaceholder")} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#7B61FF]/50" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">{t("venueForm.description")}</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder={t("venueForm.descriptionPlaceholder")} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#7B61FF]/50 resize-none" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">{t("venueForm.city")}</label>
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#7B61FF]/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">{t("venueForm.capacity")}</label>
            <input type="text" value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="1,000" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#7B61FF]/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">{t("venueForm.type")}</label>
            <CustomSelect
              value={type}
              onChange={(val) => setType(val)}
              options={VENUE_TYPES.map((vt) => ({ value: vt, label: vt }))}
              placeholder={t("venueForm.type")}
              searchable={false}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">{t("venueForm.address")}</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder={t("venueForm.addressPlaceholder")} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#7B61FF]/50" />
        </div>
        <ImageUpload
          value={image}
          onChange={setImage}
          label={t("venueForm.coverImage")}
          height="h-48"
        />
      </div>

      {/* Contact & Social */}
      <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 space-y-6">
        <h2 className="text-lg font-semibold text-white">{t("venueForm.contactInfo")}</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">{t("venueForm.phone")}</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+90 212 000 00 00" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#7B61FF]/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">{t("venueForm.email")}</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="info@venue.com" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#7B61FF]/50" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">{t("venueForm.website")}</label>
          <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://www.venue.com" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#7B61FF]/50" />
        </div>
        <h3 className="text-sm font-semibold text-white/70">{t("venueForm.socialMedia")}</h3>
        <div className="grid grid-cols-2 gap-4">
          <input type="url" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="Instagram URL" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#7B61FF]/50" />
          <input type="url" value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="Twitter / X URL" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#7B61FF]/50" />
          <input type="url" value={youtube} onChange={(e) => setYoutube(e.target.value)} placeholder="YouTube URL" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#7B61FF]/50" />
          <input type="url" value={spotify} onChange={(e) => setSpotify(e.target.value)} placeholder="Spotify URL" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#7B61FF]/50" />
        </div>
      </div>

      {/* Opening Hours */}
      <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 space-y-6">
        <h2 className="text-lg font-semibold text-white">{t("venueForm.openingHours")}</h2>
        <div className="space-y-3">
          {openingHours.map((oh, idx) => (
            <div key={oh.day} className="flex items-center gap-4">
              <div className="w-28 text-sm text-white/60">{t(`venueForm.days.${oh.day}`)}</div>
              <button
                onClick={() => toggleDay(idx)}
                className={`w-12 h-6 rounded-full relative transition-colors ${oh.isOpen ? "bg-[#7B61FF]" : "bg-white/10"}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${oh.isOpen ? "left-[26px]" : "left-0.5"}`} />
              </button>
              {oh.isOpen ? (
                <input
                  type="text"
                  value={oh.hours}
                  onChange={(e) => updateHours(idx, e.target.value)}
                  className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#7B61FF]/50"
                />
              ) : (
                <span className="text-sm text-white/30">{t("venueForm.closed")}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Gallery */}
      <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 space-y-6">
        <h2 className="text-lg font-semibold text-white">{t("venueForm.gallery")}</h2>
        <MultiImageUpload
          values={galleryUrls}
          onChange={setGalleryUrls}
          maxImages={15}
        />
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving || !name}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#7B61FF] text-white font-medium hover:bg-[#7B61FF]/80 disabled:opacity-50 transition-colors"
        >
          <Save className="w-5 h-5" />
          {saving ? t("venueForm.saving") : t("venueForm.save")}
        </button>
      </div>
    </div>
  );
}
