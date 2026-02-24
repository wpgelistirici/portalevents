"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useOrganizer } from "@/lib/organizer-context";
import CustomSelect from "@/components/ui/CustomSelect";
import { Music2, Search, Clock, CheckCircle2 } from "lucide-react";

export default function ArtistRequestsPage() {
  const t = useTranslations("OrganizerPanel.artistRequests");
  const { artistTickets } = useOrganizer();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filterOptions = [
    { value: "all", label: t("all") },
    { value: "open", label: t("statusOpen") },
    { value: "resolved", label: t("statusResolved") },
  ];

  const filtered = artistTickets.filter((at) => {
    const matchFilter = filter === "all" || at.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !search || at.artistName.toLowerCase().includes(q) || at.genre.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Music2 className="w-7 h-7 text-[#7B61FF]" />
          {t("title")}
        </h1>
        <p className="text-white/50 mt-1">{t("subtitle")}</p>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("searchPlaceholder")} className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#7B61FF]/50" />
        </div>
        <div className="w-48">
          <CustomSelect options={filterOptions} value={filter} onChange={setFilter} searchable={false} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Music2 className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40">{t("noRequests")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((at) => (
            <div key={at.id} className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${at.status === "open" ? "bg-amber-500/10" : "bg-emerald-500/10"}`}>
                {at.status === "open" ? <Clock className="w-5 h-5 text-amber-400" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold">{at.artistName}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${at.status === "open" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"}`}>
                    {at.status === "open" ? t("statusOpen") : t("statusResolved")}
                  </span>
                </div>
                <p className="text-sm text-white/40 mt-0.5">{at.genre} · {at.description}</p>
              </div>
              <span className="text-xs text-white/20">{new Date(at.createdAt).toLocaleDateString("tr-TR")}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
