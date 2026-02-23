"use client";

import { useParams, useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useOrganizer } from "@/lib/organizer-context";
import CustomSelect from "@/components/ui/CustomSelect";
import { ImageUpload, MultiImageUpload } from "@/components/ui/ImageUpload";
import { ArrowLeft, Save, Trash2, Check } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const VENUE_TYPES = ["Concert Hall", "Club", "Arena", "Underground Club", "Open Air", "Bar", "Theater"];

export default function EditVenuePage() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("OrganizerPanel");
  const { organizerVenues, updateVenue, deleteVenue } = useOrganizer();

  const venue = organizerVenues.find((v) => v.id === params.id);

  const [name, setName] = useState(venue?.name || "");
  const [description, setDescription] = useState(venue?.detail?.description || "");
  const [city, setCity] = useState(venue?.city || "İstanbul");
  const [capacity, setCapacity] = useState(venue?.capacity || "");
  const [type, setType] = useState(venue?.type || "Concert Hall");
  const [image, setImage] = useState(venue?.image || "");
  const [address, setAddress] = useState(venue?.detail?.address || "");
  const [phone, setPhone] = useState(venue?.detail?.phone || "");
  const [email, setEmail] = useState(venue?.detail?.email || "");
  const [website, setWebsite] = useState(venue?.detail?.website || "");
  const [instagram, setInstagram] = useState(venue?.detail?.social?.instagram || "");
  const [twitter, setTwitter] = useState(venue?.detail?.social?.twitter || "");
  const [galleryUrls, setGalleryUrls] = useState<string[]>(venue?.detail?.gallery || []);
  const [openingHours, setOpeningHours] = useState(
    venue?.detail?.openingHours || DAYS.map((d) => ({ day: d, hours: d === "sunday" ? "" : "20:00 - 04:00", isOpen: d !== "sunday" && d !== "monday" })),
  );
  const [saving, setSaving] = useState(false);

  if (!venue) {
    return (
      <div className="text-center py-16">
        <p className="text-white/40">{t("venues.notFound")}</p>
        <Link href={`/${locale}/organizer/venues`} className="text-[#FF2D55] text-sm mt-4 inline-block">{t("venues.backToList")}</Link>
      </div>
    );
  }

  const typeOptions = VENUE_TYPES.map((vt) => ({ value: vt, label: vt }));

  const handleSave = () => {
    setSaving(true);
    updateVenue(venue.id, {
      name,
      city,
      capacity,
      type,
      image,
      detail: {
        description,
        address,
        lat: venue.detail?.lat || 41.0082,
        lng: venue.detail?.lng || 28.9784,
        phone,
        email,
        website,
        social: { instagram, twitter },
        openingHours,
        gallery: [image, ...galleryUrls],
      },
    });
    setTimeout(() => {
      setSaving(false);
      router.push(`/${locale}/organizer/venues`);
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-white">{t("venues.editTitle")}</h1>
      </div>

      {/* Basic Info */}
      <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 space-y-6">
        <h2 className="text-lg font-semibold text-white">{t("venueForm.basicInfo")}</h2>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">{t("venueForm.venueName")}</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#FF2D55]/50" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">{t("venueForm.description")}</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#FF2D55]/50 resize-none" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">{t("venueForm.city")}</label>
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#FF2D55]/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">{t("venueForm.capacity")}</label>
            <input type="text" value={capacity} onChange={(e) => setCapacity(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#FF2D55]/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">{t("venueForm.type")}</label>
            <CustomSelect options={typeOptions} value={type} onChange={setType} searchable={false} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">{t("venueForm.address")}</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#FF2D55]/50" />
        </div>
        <ImageUpload value={image} onChange={setImage} label={t("venueForm.coverImage")} height="h-48" />
      </div>

      {/* Contact & Social */}
      <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 space-y-6">
        <h2 className="text-lg font-semibold text-white">{t("venueForm.contactInfo")}</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">{t("venueForm.phone")}</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#FF2D55]/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">{t("venueForm.email")}</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#FF2D55]/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">{t("venueForm.website")}</label>
            <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#FF2D55]/50" />
          </div>
        </div>
        <h2 className="text-lg font-semibold text-white">{t("venueForm.socialMedia")}</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Instagram</label>
            <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#FF2D55]/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Twitter / X</label>
            <input type="text" value={twitter} onChange={(e) => setTwitter(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#FF2D55]/50" />
          </div>
        </div>
      </div>

      {/* Opening Hours */}
      <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 space-y-4">
        <h2 className="text-lg font-semibold text-white">{t("venueForm.openingHours")}</h2>
        {openingHours.map((day, idx) => (
          <div key={day.day} className="flex items-center gap-4">
            <span className="w-28 text-sm text-white/60">{t(`venueForm.days.${day.day}`)}</span>
            <button onClick={() => { const n = [...openingHours]; n[idx] = { ...n[idx], isOpen: !n[idx].isOpen }; setOpeningHours(n); }} className={`w-10 h-6 rounded-full transition-colors flex items-center ${day.isOpen ? "bg-[#FF2D55] justify-end" : "bg-white/10 justify-start"}`}>
              <div className="w-4 h-4 mx-1 rounded-full bg-white" />
            </button>
            {day.isOpen ? (
              <input type="text" value={day.hours} onChange={(e) => { const n = [...openingHours]; n[idx] = { ...n[idx], hours: e.target.value }; setOpeningHours(n); }} className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF2D55]/50" />
            ) : (
              <span className="text-sm text-white/30">{t("venueForm.closed")}</span>
            )}
          </div>
        ))}
      </div>

      {/* Gallery */}
      <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 space-y-6">
        <h2 className="text-lg font-semibold text-white">{t("venueForm.gallery")}</h2>
        <MultiImageUpload values={galleryUrls} onChange={setGalleryUrls} maxImages={15} />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button onClick={() => { deleteVenue(venue.id); router.push(`/${locale}/organizer/venues`); }} className="flex items-center gap-2 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors">
          <Trash2 className="w-4 h-4" />
          {t("venues.delete")}
        </button>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FF2D55] text-white font-medium hover:bg-[#FF2D55]/80 disabled:opacity-50 transition-colors">
          <Save className="w-4 h-4" />
          {saving ? t("venues.saving") : t("venues.save")}
        </button>
      </div>
    </div>
  );
}
