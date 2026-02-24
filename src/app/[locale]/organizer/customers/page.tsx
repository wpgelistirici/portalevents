"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useOrganizer } from "@/lib/organizer-context";
import { Users, Search, Download, ChevronDown, ChevronUp, Ticket, Mail, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function parseCurrency(price: string): number {
  // Remove everything except digits — commas/dots are thousands separators, not decimals
  return parseInt(price.replace(/[^\d]/g, ""), 10) || 0;
}

export default function CustomersPage() {
  const t = useTranslations("OrganizerPanel.customers");
  const { getAllTickets } = useOrganizer();
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const allTickets = useMemo(() => getAllTickets(), [getAllTickets]);

  const customers = useMemo(() => {
    const map = new Map<string, { name: string; email: string; totalSpent: number; ticketCount: number; lastPurchase: string; tickets: typeof allTickets }>();
    allTickets.forEach((tk) => {
      const existing = map.get(tk.buyerEmail) || { name: tk.buyerName, email: tk.buyerEmail, totalSpent: 0, ticketCount: 0, lastPurchase: tk.purchaseDate, tickets: [] };
      existing.totalSpent += parseCurrency(tk.totalPaid);
      existing.ticketCount += tk.quantity;
      existing.tickets = [...existing.tickets, tk];
      map.set(tk.buyerEmail, existing);
    });
    return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [allTickets]);

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    return !search || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
  });

  const exportCSV = () => {
    const headers = [t("name"), t("emailLabel"), t("totalSpent"), t("ticketCount")];
    const rows = filtered.map((c) => [c.name, c.email, `₺${c.totalSpent}`, c.ticketCount]);
    const csv = [headers, ...rows].map((r) => r.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `musteriler_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Users className="w-7 h-7 text-[#7B61FF]" />
            {t("title")}
          </h1>
          <p className="text-white/50 mt-1">{t("subtitle")}</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-colors">
          <Download className="w-4 h-4" />
          {t("export")}
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("searchPlaceholder")} className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#7B61FF]/50" />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: t("totalCustomers"), value: customers.length.toString(), icon: Users, color: "text-[#7B61FF]", bg: "bg-[#7B61FF]/10" },
          { label: t("totalTicketsSold"), value: customers.reduce((s, c) => s + c.ticketCount, 0).toString(), icon: Ticket, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: t("totalRevenue"), value: `₺${customers.reduce((s, c) => s + c.totalSpent, 0).toLocaleString("tr-TR")}`, icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10" },
        ].map((stat, i) => (
          <div key={i} className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/50 uppercase tracking-wider">{stat.label}</span>
              <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}><stat.icon className={`w-4 h-4 ${stat.color}`} /></div>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Customer List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Users className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40">{t("noCustomers")}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((c) => {
            const isExpanded = expanded === c.email;
            return (
              <div key={c.email} className="rounded-xl border border-white/5 overflow-hidden">
                <button onClick={() => setExpanded(isExpanded ? null : c.email)} className="w-full flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors text-left">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10">
                    <span className="text-sm font-bold text-white/60">{c.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{c.name}</p>
                    <p className="text-xs text-white/40 flex items-center gap-1"><Mail className="w-3 h-3" /> {c.email}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-emerald-400">₺{c.totalSpent.toLocaleString("tr-TR")}</p>
                    <p className="text-[10px] text-white/30">{c.ticketCount} {t("tickets")}</p>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
                </button>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="px-4 pb-4 space-y-2">
                        <div className="h-px bg-white/5" />
                        {c.tickets.map((tk) => (
                          <div key={tk.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/[0.02] text-sm">
                            <div>
                              <span className="text-white">{tk.eventTitle}</span>
                              <span className="text-white/30 ml-2">{tk.ticketType}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`text-[10px] px-2 py-0.5 rounded-full ${tk.status === "active" ? "bg-emerald-500/10 text-emerald-400" : tk.status === "used" ? "bg-blue-500/10 text-blue-400" : "bg-red-500/10 text-red-400"}`}>{tk.status}</span>
                              <span className="text-white/50">{tk.totalPaid}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
