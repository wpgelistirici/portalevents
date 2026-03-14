"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import SmoothScroll from "@/components/ui/SmoothScroll";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { events } from "@/lib/data";
import { EventAttendee } from "@/lib/data";
import { useTranslations } from "next-intl";
import { FadeInUp, AnimatedWords } from "@/components/ui/AnimatedText";
import { useAuth } from "@/lib/auth-context";
import { useBuddy, BuddyMatch } from "@/lib/buddy-context";
import Image from "next/image";
import {
  Heart,
  X,
  MessageCircle,
  Users,
  Sparkles,
  MapPin,
  Music,
  ArrowLeft,
  Send,
  ChevronRight,
  UserCheck,
  RotateCcw,
  Check,
} from "lucide-react";

const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), {
  ssr: false,
});

/* ============================================
   MOCK BUDDY EXTRA INFO
   ============================================ */
const BUDDY_INFO: Record<string, { bio: string; genres: string[]; city: string }> = {
  a1: { bio: "Techno ve electronic müzik aşığı. Her hafta sonu yeni bir etkinlikte!", genres: ["Techno", "Electronic"], city: "İstanbul" },
  a2: { bio: "Müziksiz bir gün eksik hissettiriyor. Konser fotoğrafçılığı yapıyorum.", genres: ["Electronic", "Indie"], city: "İstanbul" },
  a3: { bio: "Jazz ve soul dinleyicisi. Yeni insanlarla tanışmayı seviyorum.", genres: ["Jazz", "Soul"], city: "Ankara" },
  a4: { bio: "Rock ve alternatif müzik tutkunuyum. Konser sezonunu dört gözle bekliyorum.", genres: ["Rock", "Alternative"], city: "İzmir" },
  a5: { bio: "Deep house ve techno partilerinin vazgeçilmezi. Dans pistini seviyorum!", genres: ["Deep House", "Techno"], city: "İstanbul" },
  a6: { bio: "Müzik prodüksiyonu yapıyorum. Canlı performanslar benim için ilham kaynağı.", genres: ["Electronic", "Ambient"], city: "Bursa" },
  a7: { bio: "Indie ve folk müzik severim. Küçük mekanlardaki samimi konserleri tercih ederim.", genres: ["Indie", "Folk"], city: "İstanbul" },
  a8: { bio: "Bir etkinliği kaçırmamak için takvimimi etkinliklerle doldururum!", genres: ["Pop", "Electronic"], city: "Ankara" },
  a9: { bio: "Müzik eleştirmeni ve blog yazarı. Her türlü müziği açık fikirle dinlerim.", genres: ["Classical", "Jazz", "Electronic"], city: "İstanbul" },
  a10: { bio: "Festival addict. Yurt içi ve yurt dışı festivalleri takip ediyorum.", genres: ["Techno", "House"], city: "İstanbul" },
  a11: { bio: "Dansçı ve müzik meraklısı. Sahne önü her zaman en iyi yer!", genres: ["Dance", "Pop"], city: "İzmir" },
  a12: { bio: "Sound engineer olarak çalışıyorum, konserler mesleğim ve tutkum.", genres: ["Electronic", "Rock"], city: "İstanbul" },
};

function getBuddyInfo(id: string) {
  return BUDDY_INFO[id] || { bio: "Etkinlik tutkunuyum! Yeni insanlarla tanışmayı seviyorum.", genres: ["Electronic", "Pop"], city: "İstanbul" };
}

/* ============================================
   SWIPE CARD
   ============================================ */
function SwipeCard({
  attendee,
  onLike,
  onPass,
  isTop,
  index,
}: {
  attendee: EventAttendee;
  onLike: () => void;
  onPass: () => void;
  isTop: boolean;
  index: number;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-18, 0, 18]);
  const likeOpacity = useTransform(x, [20, 80], [0, 1]);
  const passOpacity = useTransform(x, [-80, -20], [1, 0]);
  const info = getBuddyInfo(attendee.id);
  const displayName = attendee.showName ? attendee.name : attendee.name.split(" ")[0] + " •";

  const cardOffset = index * 6;
  const cardScale = 1 - index * 0.04;

  if (!isTop) {
    return (
      <motion.div
        className="absolute inset-0 rounded-3xl overflow-hidden glass"
        style={{
          y: cardOffset,
          scale: cardScale,
          zIndex: 10 - index,
        }}
      />
    );
  }

  return (
    <motion.div
      className="absolute inset-0 rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing"
      style={{ x, rotate, zIndex: 20 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={(_, info) => {
        if (info.offset.x > 100) onLike();
        else if (info.offset.x < -100) onPass();
      }}
      whileDrag={{ scale: 1.02 }}
    >
      {/* Card background image */}
      <div className="relative w-full h-full">
        <Image
          src={attendee.avatar}
          alt={displayName}
          fill
          className="object-cover"
          sizes="(max-width: 480px) 100vw, 420px"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Like indicator */}
        <motion.div
          className="absolute top-8 right-6 px-4 py-2 rounded-xl border-4 border-green-400 rotate-[-15deg]"
          style={{ opacity: likeOpacity }}
        >
          <span className="text-green-400 font-black text-2xl tracking-widest">LIKE</span>
        </motion.div>

        {/* Pass indicator */}
        <motion.div
          className="absolute top-8 left-6 px-4 py-2 rounded-xl border-4 border-red-400 rotate-[15deg]"
          style={{ opacity: passOpacity }}
        >
          <span className="text-red-400 font-black text-2xl tracking-widest">PASS</span>
        </motion.div>

        {/* Info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-end justify-between mb-3">
            <div>
              <h2 className="text-2xl font-black text-white">{displayName}</h2>
              <div className="flex items-center gap-1 text-white/70 text-sm mt-1">
                <MapPin size={12} />
                <span>{info.city}</span>
              </div>
            </div>
          </div>
          <p className="text-white/80 text-sm leading-relaxed mb-3 line-clamp-2">
            {info.bio}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {info.genres.map((g) => (
              <span key={g} className="text-[11px] px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white border border-white/20">
                <Music size={9} className="inline mr-1" />
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ============================================
   MATCH MODAL
   ============================================ */
function MatchModal({
  match,
  onClose,
  onChat,
}: {
  match: BuddyMatch;
  onClose: () => void;
  onChat: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} />

      <motion.div
        className="relative z-10 glass rounded-3xl p-8 max-w-xs w-full text-center"
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.4, opacity: 0 }}
        transition={{ type: "spring", damping: 18, stiffness: 280 }}
      >
        <motion.div
          className="absolute -top-5 left-1/2 -translate-x-1/2"
          animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
            <Heart size={18} className="text-black fill-black" />
          </div>
        </motion.div>

        <div className="mt-4 mb-2">
          <p className="text-gold text-xs font-bold tracking-widest uppercase mb-1">Eşleşme! 🎉</p>
          <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-gold/60 mx-auto my-4">
            <Image src={match.profile.avatar} alt={match.profile.name} width={80} height={80} className="object-cover" />
          </div>
          <h2 className="text-xl font-black">{match.profile.name}</h2>
          <p className="text-sm text-foreground/50 mt-1">ile eşleştin!</p>
          <p className="text-xs text-foreground/40 mt-1 flex items-center justify-center gap-1">
            <MapPin size={10} />
            {match.profile.eventTitle}
          </p>
        </div>

        {/* First message preview */}
        {match.messages[0] && (
          <div className="bg-foreground/5 rounded-2xl px-4 py-3 my-4 text-left">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-5 h-5 rounded-full overflow-hidden">
                <Image src={match.profile.avatar} alt="" width={20} height={20} className="object-cover" />
              </div>
              <span className="text-[11px] font-semibold">{match.profile.name}</span>
            </div>
            <p className="text-sm text-foreground/80">{match.messages[0].content}</p>
          </div>
        )}

        <div className="flex gap-3 mt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-foreground/15 text-sm text-foreground/60 hover:bg-foreground/5 transition-colors"
          >
            Devam Et
          </button>
          <button
            onClick={onChat}
            className="flex-1 py-3 rounded-xl bg-gold text-black font-bold text-sm flex items-center justify-center gap-1.5 hover:bg-gold/90 transition-colors"
          >
            <MessageCircle size={13} />
            Mesaj Gönder
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ============================================
   CHAT MODAL  — reads live data from context by ID
   ============================================ */
function ChatModal({ matchId, onClose }: { matchId: string; onClose: () => void }) {
  const { matches, typingMatchIds, sendMessage, markAsRead } = useBuddy();
  // Always read the fresh match from context — never stale
  const match = matches.find((m) => m.id === matchId);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const isTyping = typingMatchIds.has(matchId);

  useEffect(() => { markAsRead(matchId); }, [matchId, markAsRead]);

  // Scroll to bottom whenever messages change or typing indicator appears
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [match?.messages.length, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(matchId, input.trim());
    setInput("");
  };

  if (!match) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-end md:items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative z-10 glass rounded-t-3xl md:rounded-3xl w-full max-w-md flex flex-col"
        style={{ height: "72vh", maxHeight: 580 }}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 26, stiffness: 300 }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-foreground/10 flex-shrink-0">
          <button onClick={onClose} className="p-2 hover:bg-foreground/10 rounded-lg transition-colors">
            <ArrowLeft size={16} />
          </button>
          <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-gold/40">
            <Image src={match.profile.avatar} alt={match.profile.name} width={36} height={36} className="object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{match.profile.name}</p>
            {isTyping ? (
              <p className="text-[11px] text-gold animate-pulse">yazıyor...</p>
            ) : (
              <p className="text-[11px] text-foreground/40 truncate">📍 {match.profile.eventTitle}</p>
            )}
          </div>
          <span className="text-[10px] text-gold flex items-center gap-1">
            <UserCheck size={10} /> Eşleşme
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <AnimatePresence initial={false}>
            {match.messages.map((msg) => {
              const isMe = msg.senderId === "me";
              return (
                <motion.div
                  key={msg.id}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {!isMe && (
                    <div className="w-6 h-6 rounded-full overflow-hidden mr-2 flex-shrink-0 mt-1">
                      <Image src={match.profile.avatar} alt="" width={24} height={24} className="object-cover" />
                    </div>
                  )}
                  <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${isMe ? "bg-gold text-black rounded-tr-sm" : "bg-foreground/10 rounded-tl-sm"}`}>
                    {msg.content}
                  </div>
                </motion.div>
              );
            })}

            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                key="typing"
                className="flex justify-start"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-6 h-6 rounded-full overflow-hidden mr-2 flex-shrink-0 mt-1">
                  <Image src={match.profile.avatar} alt="" width={24} height={24} className="object-cover" />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-foreground/10 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-foreground/10 flex-shrink-0">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Mesaj yaz..."
              className="flex-1 bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold/50 transition-colors"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="p-2.5 bg-gold text-black rounded-xl disabled:opacity-40 hover:bg-gold/90 transition-colors"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ============================================
   MAIN PAGE
   ============================================ */
export default function BuddyPage() {
  const t = useTranslations("BuddyPage");
  const { isAuthenticated, openAuthModal } = useAuth();
  const { matches, likeProfile, isLiked, totalUnread } = useBuddy();

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [matchModal, setMatchModal] = useState<BuddyMatch | null>(null);
  const [chatMatchId, setChatMatchId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"swipe" | "matches">("swipe");

  const eventsWithAttendees = events.filter((e) => e.detail?.attendees && e.detail.attendees.length > 0);
  const selectedEvent = eventsWithAttendees.find((e) => e.id === selectedEventId);

  // Filter out already-liked attendees
  const allAttendees: EventAttendee[] = selectedEvent?.detail?.attendees ?? [];
  const queue = allAttendees.filter((a) => !isLiked(a.id, selectedEventId ?? ""));

  const currentCards = queue.slice(cardIndex, cardIndex + 3);
  const isDone = !!selectedEventId && cardIndex >= queue.length;

  const handleLike = (attendee: EventAttendee) => {
    if (!isAuthenticated) { openAuthModal(); return; }
    if (!selectedEvent) return;
    const match = likeProfile(attendee, selectedEvent.id, selectedEvent.title);
    setCardIndex((i) => i + 1);
    if (match) setMatchModal(match);
  };

  const handlePass = () => {
    setCardIndex((i) => i + 1);
  };

  const handleEventSelect = (id: string) => {
    setSelectedEventId(id);
    setCardIndex(0);
  };

  const openChat = (match: BuddyMatch) => {
    setMatchModal(null);
    setChatMatchId(match.id);
  };

  return (
    <>
      <SmoothScroll />
      <CustomCursor />
      <NoiseOverlay />
      <Navbar />

      <main className="min-h-screen pt-20 pb-10">
        {/* Header */}
        <section className="pt-12 pb-6 px-4 text-center">
          <FadeInUp>
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-gold mb-4 px-4 py-2 rounded-full border border-gold/20 bg-gold/5">
              <Heart size={11} className="fill-gold text-gold" />
              {t("label")}
            </span>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">
              {t("title")}
            </h1>
          </FadeInUp>
          <FadeInUp delay={0.2}>
            <p className="text-sm text-foreground/50 max-w-md mx-auto">
              {t("description")}
            </p>
          </FadeInUp>
        </section>

        {/* Tabs */}
        <div className="flex justify-center px-4 mb-8">
          <div className="glass rounded-2xl p-1 inline-flex gap-1">
            <button
              onClick={() => setActiveTab("swipe")}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === "swipe" ? "bg-gold text-black" : "text-foreground/60 hover:text-foreground"}`}
            >
              <Heart size={13} />
              {t("tabDiscover")}
            </button>
            <button
              onClick={() => setActiveTab("matches")}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 relative ${activeTab === "matches" ? "bg-gold text-black" : "text-foreground/60 hover:text-foreground"}`}
            >
              <MessageCircle size={13} />
              {t("tabMatches")}
              {totalUnread > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {totalUnread}
                </span>
              )}
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* ── SWIPE TAB ── */}
          {activeTab === "swipe" && (
            <motion.div
              key="swipe"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="px-4 max-w-lg mx-auto"
            >
              {/* Event Selector */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-foreground/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <MapPin size={11} />
                  {t("selectEvent")}
                </p>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {eventsWithAttendees.map((event) => (
                    <button
                      key={event.id}
                      onClick={() => handleEventSelect(event.id)}
                      className={`flex-shrink-0 rounded-xl border-2 transition-all overflow-hidden ${selectedEventId === event.id ? "border-gold" : "border-transparent glass"}`}
                      style={{ width: 120 }}
                    >
                      <div className="relative h-16">
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                        {selectedEventId === event.id && (
                          <div className="absolute inset-0 bg-gold/30 flex items-center justify-center">
                            <Check size={16} className="text-white" />
                          </div>
                        )}
                      </div>
                      <div className="px-2 py-1.5 text-left">
                        <p className="text-[10px] font-semibold leading-tight line-clamp-1">{event.title}</p>
                        <p className="text-[9px] text-foreground/40 mt-0.5">{event.detail?.attendees.length} {t("attending")}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Area */}
              {!selectedEventId ? (
                <FadeInUp>
                  <div className="text-center py-16">
                    <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                      <Music size={26} className="text-gold" />
                    </div>
                    <h3 className="font-bold mb-2">{t("noEventSelected")}</h3>
                    <p className="text-sm text-foreground/50">{t("noEventSelectedDesc")}</p>
                  </div>
                </FadeInUp>
              ) : isDone ? (
                /* All cards exhausted */
                <FadeInUp>
                  <div className="text-center py-10">
                    <motion.div
                      className="w-20 h-20 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-5"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <Sparkles size={28} className="text-gold" />
                    </motion.div>
                    <h3 className="text-xl font-black mb-2">{t("allDoneTitle")}</h3>
                    <p className="text-sm text-foreground/50 mb-6">{t("allDoneDesc")}</p>
                    {matches.length > 0 ? (
                      <>
                        <p className="text-xs text-foreground/40 mb-4">{matches.length} {t("matchCount")}</p>
                        <div className="flex flex-wrap justify-center gap-3 mb-6">
                          {matches.map((m) => (
                            <button
                              key={m.id}
                              onClick={() => setChatMatchId(m.id)}
                              className="relative"
                            >
                              <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-gold/50">
                                <Image src={m.profile.avatar} alt={m.profile.name} width={56} height={56} className="object-cover" />
                              </div>
                              {m.unread > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                                  {m.unread}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => setActiveTab("matches")}
                          className="bg-gold text-black font-bold px-6 py-3 rounded-xl text-sm inline-flex items-center gap-2 hover:bg-gold/90 transition-colors"
                        >
                          <MessageCircle size={14} />
                          {t("viewMatches")}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => { setCardIndex(0); setSelectedEventId(null); }}
                        className="glass border border-foreground/10 font-semibold px-6 py-3 rounded-xl text-sm inline-flex items-center gap-2 hover:bg-foreground/5 transition-colors"
                      >
                        <RotateCcw size={13} />
                        {t("tryAnother")}
                      </button>
                    )}
                  </div>
                </FadeInUp>
              ) : (
                /* Card stack */
                <div>
                  <div
                    className="relative mx-auto"
                    style={{ width: "100%", maxWidth: 380, height: 480 }}
                  >
                    <AnimatePresence>
                      {[...currentCards].reverse().map((attendee, reverseIdx) => {
                        const stackIdx = currentCards.length - 1 - reverseIdx;
                        return (
                          <SwipeCard
                            key={`${selectedEventId}_${attendee.id}`}
                            attendee={attendee}
                            onLike={() => handleLike(attendee)}
                            onPass={handlePass}
                            isTop={stackIdx === 0}
                            index={stackIdx}
                          />
                        );
                      })}
                    </AnimatePresence>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center justify-center gap-6 mt-8">
                    <motion.button
                      onClick={handlePass}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      className="w-16 h-16 rounded-full glass border-2 border-red-400/40 flex items-center justify-center text-red-400 shadow-lg hover:bg-red-400/10 transition-colors"
                    >
                      <X size={26} strokeWidth={2.5} />
                    </motion.button>

                    <div className="text-center">
                      <p className="text-xs text-foreground/30">
                        {cardIndex + 1} / {queue.length}
                      </p>
                    </div>

                    <motion.button
                      onClick={() => handleLike(currentCards[0])}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      className="w-16 h-16 rounded-full bg-gold flex items-center justify-center text-black shadow-lg hover:bg-gold/90 transition-colors"
                    >
                      <Heart size={26} strokeWidth={2.5} className="fill-black" />
                    </motion.button>
                  </div>

                  <p className="text-center text-xs text-foreground/30 mt-4">
                    {t("swipeHint")}
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* ── MATCHES TAB ── */}
          {activeTab === "matches" && (
            <motion.div
              key="matches"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="px-4 max-w-lg mx-auto"
            >
              {matches.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                    <Heart size={26} className="text-gold" />
                  </div>
                  <h3 className="font-bold mb-2">{t("noMatchesYet")}</h3>
                  <p className="text-sm text-foreground/50 mb-6">{t("noMatchesDesc")}</p>
                  <button
                    onClick={() => setActiveTab("swipe")}
                    className="bg-gold text-black font-bold px-6 py-3 rounded-xl text-sm inline-flex items-center gap-2 hover:bg-gold/90 transition-colors"
                  >
                    {t("startDiscovering")}
                    <ChevronRight size={13} />
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {matches.map((match, i) => (
                    <motion.button
                      key={match.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => setChatMatchId(match.id)}
                      className="w-full glass rounded-2xl p-4 flex items-center gap-4 hover:bg-foreground/[0.03] transition-colors text-left group"
                    >
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <Image src={match.profile.avatar} alt={match.profile.name} width={48} height={48} className="object-cover" />
                        </div>
                        {match.unread > 0 && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                            {match.unread}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm">{match.profile.name}</p>
                          <span className="text-[10px] text-gold flex items-center gap-0.5">
                            <UserCheck size={9} /> Eşleşme
                          </span>
                        </div>
                        <p className="text-xs text-foreground/50 truncate mt-0.5">
                          {match.messages.length > 0 ? match.messages[match.messages.length - 1].content : "Merhaba!"}
                        </p>
                        <p className="text-[10px] text-foreground/30 mt-0.5 flex items-center gap-1">
                          <MapPin size={8} />{match.profile.eventTitle}
                        </p>
                      </div>
                      <ChevronRight size={15} className="text-foreground/30 group-hover:text-foreground/60 transition-colors flex-shrink-0" />
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />

      {/* Modals */}
      <AnimatePresence>
        {matchModal && (
          <MatchModal
            match={matchModal}
            onClose={() => setMatchModal(null)}
            onChat={() => openChat(matchModal)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {chatMatchId && (
          <ChatModal matchId={chatMatchId} onClose={() => setChatMatchId(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
