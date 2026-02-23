"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useOrganizer } from "@/lib/organizer-context";
import { useAuth } from "@/lib/auth-context";
import type { StoredTicket } from "@/lib/data";
import CustomSelect from "@/components/ui/CustomSelect";
import {
  QrCode,
  Search,
  CheckCircle,
  XCircle,
  RotateCcw,
  User,
  Ticket,
  CreditCard,
  Calendar,
  MapPin,
  Music,
  AlertTriangle,
} from "lucide-react";

export default function TicketValidationPage() {
  const t = useTranslations("OrganizerPanel");
  const { user } = useAuth();
  const { searchTickets, getTicketById, validateTicket, organizerEvents } = useOrganizer();

  const [mode, setMode] = useState<"search" | "qr">("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEventFilter, setSelectedEventFilter] = useState("");
  const [searchResults, setSearchResults] = useState<StoredTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<StoredTicket | null>(null);
  const [actionResult, setActionResult] = useState<{ success: boolean; message: string } | null>(null);
  const [confirmAction, setConfirmAction] = useState<"approved" | "cancelled" | "refunded" | null>(null);
  const [qrInput, setQrInput] = useState("");

  const handleSearch = () => {
    const results = searchTickets(searchQuery, selectedEventFilter || undefined);
    setSearchResults(results);
    setSelectedTicket(null);
  };

  const handleQrScan = () => {
    // Simulate QR scan with manual input
    const ticket = getTicketById(qrInput);
    if (ticket) {
      setSelectedTicket(ticket);
      setSearchResults([]);
    } else {
      setActionResult({ success: false, message: t("validation.ticketNotFound") });
      setTimeout(() => setActionResult(null), 3000);
    }
  };

  const handleAction = (action: "approved" | "cancelled" | "refunded") => {
    if (!selectedTicket) return;
    const result = validateTicket(selectedTicket.id, action, user?.name || "Unknown");
    if (result.success) {
      setActionResult({
        success: true,
        message: action === "approved"
          ? t("validation.approvedSuccess")
          : action === "refunded"
            ? t("validation.refundedSuccess")
            : t("validation.cancelledSuccess"),
      });
      // Refresh the ticket
      const updated = getTicketById(selectedTicket.id);
      setSelectedTicket(updated || null);
    } else {
      setActionResult({ success: false, message: result.error || "" });
    }
    setConfirmAction(null);
    setTimeout(() => setActionResult(null), 4000);
  };

  const statusColors: Record<string, string> = {
    active: "text-green-400 bg-green-400/10",
    used: "text-yellow-400 bg-yellow-400/10",
    cancelled: "text-red-400 bg-red-400/10",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">{t("validation.title")}</h1>
        <p className="text-white/50 text-sm mt-1">{t("validation.subtitle")}</p>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode("search")}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all ${
            mode === "search" ? "bg-white/10 text-white border border-white/20" : "text-white/40 hover:text-white/60"
          }`}
        >
          <Search className="w-4 h-4" />
          {t("validation.searchMode")}
        </button>
        <button
          onClick={() => setMode("qr")}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all ${
            mode === "qr" ? "bg-white/10 text-white border border-white/20" : "text-white/40 hover:text-white/60"
          }`}
        >
          <QrCode className="w-4 h-4" />
          {t("validation.qrMode")}
        </button>
      </div>

      {/* Action Result */}
      {actionResult && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${
          actionResult.success ? "bg-green-400/10 border border-green-400/20" : "bg-red-400/10 border border-red-400/20"
        }`}>
          {actionResult.success ? (
            <CheckCircle className="w-5 h-5 text-green-400" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-400" />
          )}
          <span className={actionResult.success ? "text-green-400" : "text-red-400"}>
            {actionResult.message}
          </span>
        </div>
      )}

      {/* Search Mode */}
      {mode === "search" && (
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder={t("validation.searchPlaceholder")}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF2D55]/50"
              />
            </div>
            <CustomSelect
              value={selectedEventFilter}
              onChange={(val) => setSelectedEventFilter(val)}
              options={[
                { value: "", label: t("validation.allEvents") },
                ...organizerEvents.filter((e) => e.status === "approved").map((e) => ({
                  value: e.id,
                  label: e.title,
                  description: `${e.date} · ${e.venue}`,
                })),
              ]}
              placeholder={t("validation.allEvents")}
              searchable={true}
              clearable={true}
              className="min-w-[200px]"
            />
            <button
              onClick={handleSearch}
              className="px-6 py-3 rounded-xl bg-[#FF2D55] text-white font-medium hover:bg-[#FF2D55]/80 transition-colors"
            >
              {t("validation.search")}
            </button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && !selectedTicket && (
            <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden divide-y divide-white/5">
              {searchResults.map((ticket) => (
                <button
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                      <Ticket className="w-5 h-5 text-white/40" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{ticket.buyerName}</p>
                      <p className="text-xs text-white/40">{ticket.buyerEmail} — {ticket.ticketType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-3 py-1 rounded-full ${statusColors[ticket.status]}`}>
                      {t(`validation.status.${ticket.status}`)}
                    </span>
                    <span className="text-xs text-white/30">{ticket.eventTitle}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* QR Mode */}
      {mode === "qr" && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-8 text-center space-y-4">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-white/10 flex items-center justify-center">
              <QrCode className="w-10 h-10 text-white/40" />
            </div>
            <p className="text-white/60 text-sm">{t("validation.qrInstructions")}</p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="text"
                value={qrInput}
                onChange={(e) => setQrInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleQrScan()}
                placeholder={t("validation.qrPlaceholder")}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-center placeholder:text-white/30 focus:outline-none focus:border-[#FF2D55]/50"
              />
              <button
                onClick={handleQrScan}
                className="px-6 py-3 rounded-xl bg-[#FF2D55] text-white font-medium hover:bg-[#FF2D55]/80 transition-colors"
              >
                {t("validation.verify")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selected Ticket Detail */}
      {selectedTicket && (
        <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl overflow-hidden">
          {/* Ticket Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">{t("validation.ticketDetails")}</h2>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[selectedTicket.status]}`}>
              {t(`validation.status.${selectedTicket.status}`)}
            </span>
          </div>

          <div className="p-6 space-y-6">
            {/* Event Info */}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                <img src={selectedTicket.image} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-white font-semibold">{selectedTicket.eventTitle}</h3>
                <p className="text-white/40 text-sm flex items-center gap-1 mt-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {selectedTicket.date} · {selectedTicket.time}
                </p>
                <p className="text-white/40 text-sm flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {selectedTicket.venue}, {selectedTicket.city}
                </p>
              </div>
            </div>

            {/* Ticket Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                <h4 className="text-xs text-white/40 uppercase tracking-wider flex items-center gap-2">
                  <User className="w-3.5 h-3.5" />
                  {t("validation.holderInfo")}
                </h4>
                <div>
                  <p className="text-sm text-white font-medium">{selectedTicket.buyerName}</p>
                  <p className="text-xs text-white/40">{selectedTicket.buyerEmail}</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                <h4 className="text-xs text-white/40 uppercase tracking-wider flex items-center gap-2">
                  <Ticket className="w-3.5 h-3.5" />
                  {t("validation.ticketInfo")}
                </h4>
                <div>
                  <p className="text-sm text-white font-medium">{selectedTicket.ticketType}</p>
                  <p className="text-xs text-white/40">{t("validation.quantity")}: {selectedTicket.quantity}</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                <h4 className="text-xs text-white/40 uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="w-3.5 h-3.5" />
                  {t("validation.paymentInfo")}
                </h4>
                <div>
                  <p className="text-sm text-white font-medium">{selectedTicket.totalPaid}</p>
                  <p className="text-xs text-white/40">{t("validation.paid")}</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                <h4 className="text-xs text-white/40 uppercase tracking-wider flex items-center gap-2">
                  <Music className="w-3.5 h-3.5" />
                  {t("validation.purchaseInfo")}
                </h4>
                <div>
                  <p className="text-sm text-white font-medium">{selectedTicket.purchaseDate}</p>
                  <p className="text-xs text-white/40">ID: {selectedTicket.id}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {selectedTicket.status === "active" && (
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                {confirmAction ? (
                  <div className="flex items-center gap-3 w-full">
                    <p className="text-sm text-white/60 flex-1">
                      {t(`validation.confirm.${confirmAction}`)}
                    </p>
                    <button
                      onClick={() => handleAction(confirmAction)}
                      className="px-5 py-3 rounded-xl bg-[#FF2D55] text-white text-sm font-medium hover:bg-[#FF2D55]/80 transition-colors"
                    >
                      {t("validation.confirmYes")}
                    </button>
                    <button
                      onClick={() => setConfirmAction(null)}
                      className="px-5 py-3 rounded-xl bg-white/5 text-white/60 text-sm hover:bg-white/10 transition-colors"
                    >
                      {t("validation.confirmNo")}
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setConfirmAction("approved")}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl bg-green-500/10 text-green-400 font-medium hover:bg-green-500/20 transition-colors border border-green-500/20"
                    >
                      <CheckCircle className="w-5 h-5" />
                      {t("validation.approve")}
                    </button>
                    <button
                      onClick={() => setConfirmAction("cancelled")}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl bg-red-500/10 text-red-400 font-medium hover:bg-red-500/20 transition-colors border border-red-500/20"
                    >
                      <XCircle className="w-5 h-5" />
                      {t("validation.cancel")}
                    </button>
                    <button
                      onClick={() => setConfirmAction("refunded")}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl bg-yellow-500/10 text-yellow-400 font-medium hover:bg-yellow-500/20 transition-colors border border-yellow-500/20"
                    >
                      <RotateCcw className="w-5 h-5" />
                      {t("validation.refund")}
                    </button>
                  </>
                )}
              </div>
            )}

            {selectedTicket.status !== "active" && (
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-center">
                <p className="text-sm text-white/40">
                  {selectedTicket.status === "used"
                    ? t("validation.alreadyUsed")
                    : t("validation.alreadyCancelled")}
                </p>
              </div>
            )}

            {/* Back to search */}
            <button
              onClick={() => {
                setSelectedTicket(null);
                setConfirmAction(null);
              }}
              className="text-sm text-[#FF2D55] hover:text-[#FF2D55]/80 transition-colors"
            >
              {t("validation.backToSearch")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
