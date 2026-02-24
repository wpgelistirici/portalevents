"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useOrganizer } from "@/lib/organizer-context";
import CustomSelect from "@/components/ui/CustomSelect";
import {
  FileText,
  Search,
  CheckCircle,
  XCircle,
  RotateCcw,
  Download,
  Filter,
  Calendar,
} from "lucide-react";

export default function ValidationLogsPage() {
  const t = useTranslations("OrganizerPanel");
  const { validationLogs, organizerEvents } = useOrganizer();
  const [search, setSearch] = useState("");
  const [filterAction, setFilterAction] = useState<string>("");
  const [filterEvent, setFilterEvent] = useState<string>("");

  const filtered = validationLogs.filter((log) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      log.ticketHolderName.toLowerCase().includes(q) ||
      log.ticketHolderEmail.toLowerCase().includes(q) ||
      log.eventTitle.toLowerCase().includes(q);
    const matchAction = !filterAction || log.action === filterAction;
    const matchEvent = !filterEvent || log.eventId === filterEvent;
    return matchSearch && matchAction && matchEvent;
  });

  const actionIcons: Record<string, React.ReactNode> = {
    approved: <CheckCircle className="w-4 h-4 text-green-400" />,
    cancelled: <XCircle className="w-4 h-4 text-red-400" />,
    refunded: <RotateCcw className="w-4 h-4 text-yellow-400" />,
  };

  const actionColors: Record<string, string> = {
    approved: "text-green-400 bg-green-400/10",
    cancelled: "text-red-400 bg-red-400/10",
    refunded: "text-yellow-400 bg-yellow-400/10",
  };

  const handleExport = () => {
    const csv = [
      ["Tarih", "İşlem", "Bilet Sahibi", "E-posta", "Etkinlik", "Bilet Türü", "Onaylayan", "Notlar"].join(","),
      ...filtered.map((log) =>
        [
          new Date(log.validatedAt).toLocaleString("tr-TR"),
          log.action,
          log.ticketHolderName,
          log.ticketHolderEmail,
          log.eventTitle,
          log.ticketType,
          log.validatedBy,
          log.notes || "",
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "validation-logs.csv";
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{t("logs.title")}</h1>
          <p className="text-white/50 text-sm mt-1">{t("logs.subtitle")}</p>
        </div>
        <button
          onClick={handleExport}
          disabled={filtered.length === 0}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 disabled:opacity-30 transition-colors"
        >
          <Download className="w-4 h-4" />
          {t("logs.export")}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("logs.searchPlaceholder")}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#7B61FF]/50"
          />
        </div>
        <CustomSelect
          value={filterAction}
          onChange={(val) => setFilterAction(val)}
          options={[
            { value: "", label: t("logs.allActions") },
            { value: "approved", label: t("logs.actions.approved"), icon: <CheckCircle className="w-3.5 h-3.5 text-green-400" /> },
            { value: "cancelled", label: t("logs.actions.cancelled"), icon: <XCircle className="w-3.5 h-3.5 text-red-400" /> },
            { value: "refunded", label: t("logs.actions.refunded"), icon: <RotateCcw className="w-3.5 h-3.5 text-yellow-400" /> },
          ]}
          placeholder={t("logs.allActions")}
          searchable={false}
          clearable={true}
          className="min-w-[180px]"
        />
        <CustomSelect
          value={filterEvent}
          onChange={(val) => setFilterEvent(val)}
          options={[
            { value: "", label: t("logs.allEvents") },
            ...organizerEvents.map((e) => ({
              value: e.id,
              label: e.title,
              description: `${e.date} · ${e.venue}`,
            })),
          ]}
          placeholder={t("logs.allEvents")}
          searchable={true}
          clearable={true}
          className="min-w-[200px]"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {(["approved", "cancelled", "refunded"] as const).map((action) => (
          <div key={action} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
            {actionIcons[action]}
            <div>
              <p className="text-xl font-bold text-white">
                {validationLogs.filter((l) => l.action === action).length}
              </p>
              <p className="text-xs text-white/40">{t(`logs.actions.${action}`)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Logs Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40">{t("logs.noLogs")}</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 text-xs text-white/40 uppercase tracking-wider">
            <div className="col-span-2">{t("logs.date")}</div>
            <div className="col-span-1">{t("logs.action")}</div>
            <div className="col-span-3">{t("logs.holder")}</div>
            <div className="col-span-3">{t("logs.event")}</div>
            <div className="col-span-1">{t("logs.ticketType")}</div>
            <div className="col-span-2">{t("logs.validatedBy")}</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-white/5">
            {filtered.map((log) => (
              <div key={log.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/[0.02] transition-colors">
                <div className="col-span-2 text-xs text-white/50 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(log.validatedAt).toLocaleString("tr-TR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <div className="col-span-1">
                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${actionColors[log.action]}`}>
                    {actionIcons[log.action]}
                  </span>
                </div>
                <div className="col-span-3 min-w-0">
                  <p className="text-sm text-white truncate">{log.ticketHolderName}</p>
                  <p className="text-xs text-white/30 truncate">{log.ticketHolderEmail}</p>
                </div>
                <div className="col-span-3 min-w-0">
                  <p className="text-sm text-white/70 truncate">{log.eventTitle}</p>
                </div>
                <div className="col-span-1 text-xs text-white/50">{log.ticketType}</div>
                <div className="col-span-2 text-xs text-white/50">{log.validatedBy}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
