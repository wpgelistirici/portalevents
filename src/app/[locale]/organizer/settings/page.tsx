"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/auth-context";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Settings, Save, Building2, Phone, Globe, Share2 } from "lucide-react";

export default function SettingsPage() {
  const t = useTranslations("OrganizerPanel.settings");
  const { user, updateUser } = useAuth();
  const profile = user?.organizerProfile;

  const [orgName, setOrgName] = useState(profile?.organizerName || "");
  const [orgDesc, setOrgDesc] = useState(profile?.organizerDescription || "");
  const [orgLogo, setOrgLogo] = useState(profile?.organizerLogo || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");
  const [website, setWebsite] = useState("");
  const [iban, setIban] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [youtube, setYoutube] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaving(true);
    updateUser({
      phone,
      organizerProfile: {
        organizerId: profile?.organizerId || `org-${Date.now()}`,
        organizerName: orgName,
        organizerDescription: orgDesc,
        organizerLogo: orgLogo,
      },
    });
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Settings className="w-7 h-7 text-[#FF2D55]" />
          {t("title")}
        </h1>
        <p className="text-white/50 mt-1">{t("subtitle")}</p>
      </div>

      {/* Organizer Profile */}
      <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 space-y-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Building2 className="w-5 h-5 text-[#FF2D55]" />
          {t("profile")}
        </h2>
        <ImageUpload value={orgLogo} onChange={setOrgLogo} label={t("logo")} height="h-32" />
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">{t("orgName")}</label>
          <input type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#FF2D55]/50" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">{t("orgDesc")}</label>
          <textarea value={orgDesc} onChange={(e) => setOrgDesc(e.target.value)} rows={4} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#FF2D55]/50 resize-none" />
        </div>
      </div>

      {/* Contact */}
      <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 space-y-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Phone className="w-5 h-5 text-[#FF2D55]" />
          {t("contact")}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">{t("phone")}</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#FF2D55]/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">{t("email")}</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#FF2D55]/50" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">{t("website")}</label>
          <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF2D55]/50" />
        </div>
      </div>

      {/* Social */}
      <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 space-y-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Share2 className="w-5 h-5 text-[#FF2D55]" />
          {t("social")}
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Instagram</label>
            <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@kullanici" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF2D55]/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Twitter / X</label>
            <input type="text" value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="@kullanici" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF2D55]/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">YouTube</label>
            <input type="text" value={youtube} onChange={(e) => setYoutube(e.target.value)} placeholder="kanal-adi" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF2D55]/50" />
          </div>
        </div>
      </div>

      {/* Payment */}
      <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 space-y-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Globe className="w-5 h-5 text-[#FF2D55]" />
          {t("payment")}
        </h2>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">{t("companyName")}</label>
          <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#FF2D55]/50" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">IBAN</label>
          <input type="text" value={iban} onChange={(e) => setIban(e.target.value)} placeholder="TR..." className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF2D55]/50" />
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF2D55] text-white font-medium hover:bg-[#FF2D55]/80 disabled:opacity-50 transition-colors">
          <Save className="w-4 h-4" />
          {saving ? t("saving") : saved ? t("saved") : t("save")}
        </button>
      </div>
    </div>
  );
}
