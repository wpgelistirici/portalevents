"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useTranslations } from "next-intl";
import SmoothScroll from "@/components/ui/SmoothScroll";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GradientOrb from "@/components/ui/GradientOrb";
import { FadeInUp, AnimatedWords } from "@/components/ui/AnimatedText";
import { Link } from "@/i18n/routing";
import { useSaved, type SavedItemType } from "@/lib/saved-context";
import { useAuth } from "@/lib/auth-context";
import SaveToast from "@/components/ui/SaveToast";
import { events, venues, communityPosts } from "@/lib/data";
import {
  Bookmark,
  BookmarkX,
  Calendar,
  MapPin,
  Clock,
  Music,
  Building2,
  MessageSquare,
  Heart,
  Trash2,
  Lock,
  ExternalLink,
  Users,
  Star,
  ImageIcon,
} from "lucide-react";

const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), {
  ssr: false,
});

type TabType = "all" | "event" | "venue" | "post";

export default function SavedPage() {
  const t = useTranslations("SavedPage");
  const { user, isAuthenticated, isLoading, openAuthModal } = useAuth();
  const { savedItems, getSavedByType, toggleSave, isSaved } = useSaved();
  const [activeTab, setActiveTab] = useState<TabType>("all");

  const tabs: { key: TabType; icon: React.ReactNode; label: string }[] = [
    { key: "all", icon: <Bookmark size={14} />, label: t("tabs.all") },
    { key: "event", icon: <Music size={14} />, label: t("tabs.events") },
    { key: "venue", icon: <Building2 size={14} />, label: t("tabs.venues") },
    { key: "post", icon: <MessageSquare size={14} />, label: t("tabs.posts") },
  ];

  const getFilteredItems = () => {
    if (activeTab === "all") return savedItems.sort((a, b) => b.savedAt - a.savedAt);
    return getSavedByType(activeTab as SavedItemType);
  };

  const filteredItems = getFilteredItems();

  // Loading state
  if (isLoading) {
    return (
      <>
        <SmoothScroll />
        <CustomCursor />
        <NoiseOverlay />
        <Navbar />
        <main className="min-h-screen pt-32 pb-20 flex items-center justify-center">
          <motion.div
            className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </main>
      </>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <SmoothScroll />
        <CustomCursor />
        <NoiseOverlay />
        <Navbar />
        <main className="min-h-screen pt-32 pb-20">
          <div className="max-w-md mx-auto px-6 text-center">
            <FadeInUp>
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/[0.03] flex items-center justify-center">
                <Lock size={24} className="text-muted" />
              </div>
              <h1 className="text-2xl font-bold mb-3">{t("loginRequired")}</h1>
              <p className="text-sm text-muted mb-8">{t("loginRequiredDesc")}</p>
              <button
                onClick={openAuthModal}
                className="px-8 py-3 bg-primary text-white text-sm font-semibold rounded-full hover:shadow-[0_0_20px_rgba(255,45,85,0.3)] transition-all"
                data-cursor-hover
              >
                {t("loginButton")}
              </button>
            </FadeInUp>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SmoothScroll />
      <CustomCursor />
      <NoiseOverlay />
      <Navbar />

      <main className="min-h-screen pt-32 pb-20">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <GradientOrb color="primary" size={400} top="5%" right="-5%" />
          <GradientOrb color="secondary" size={350} bottom="20%" left="-5%" delay={2} />
        </div>

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <FadeInUp>
              <span className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">
                {t("label")}
              </span>
              <h1 className="display-lg mt-4 mb-4">
                <AnimatedWords text={t("title")} delay={0.2} />
              </h1>
              <p className="text-muted text-sm max-w-md mx-auto">{t("description")}</p>
            </FadeInUp>
          </div>

          {/* Tabs */}
          <FadeInUp delay={0.2}>
            <div className="flex items-center gap-2 mb-8 overflow-x-auto scrollbar-hide pb-2">
              {tabs.map((tab) => {
                const count =
                  tab.key === "all"
                    ? savedItems.length
                    : getSavedByType(tab.key as SavedItemType).length;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                      activeTab === tab.key
                        ? "bg-primary text-white shadow-[0_0_15px_rgba(255,45,85,0.2)]"
                        : "glass text-muted hover:text-white hover:bg-white/[0.05]"
                    }`}
                    data-cursor-hover
                  >
                    {tab.icon}
                    {tab.label}
                    {count > 0 && (
                      <span
                        className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          activeTab === tab.key ? "bg-white/20" : "bg-white/[0.05]"
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </FadeInUp>

          {/* Content */}
          <AnimatePresence mode="wait">
            {filteredItems.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-20"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/[0.03] flex items-center justify-center">
                  <BookmarkX size={24} className="text-white/10" />
                </div>
                <h3 className="text-lg font-bold mb-2">{t("empty.title")}</h3>
                <p className="text-sm text-muted max-w-sm mx-auto">{t("empty.description")}</p>
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {filteredItems.map((item, i) => (
                  <motion.div
                    key={`${item.type}-${item.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.05, 0.3) }}
                  >
                    {item.type === "event" && <SavedEventCard eventId={item.id} onRemove={() => toggleSave(item.id, "event")} t={t} />}
                    {item.type === "venue" && <SavedVenueCard venueId={item.id} onRemove={() => toggleSave(item.id, "venue")} t={t} />}
                    {item.type === "post" && <SavedPostCard postId={item.id} onRemove={() => toggleSave(item.id, "post")} t={t} />}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
      <SaveToast />
    </>
  );
}

/* ============================================
   SAVED EVENT CARD
   ============================================ */
function SavedEventCard({
  eventId,
  onRemove,
  t,
}: {
  eventId: string;
  onRemove: () => void;
  t: ReturnType<typeof useTranslations>;
}) {
  const event = events.find((e) => e.id === eventId);
  if (!event) return null;

  return (
    <div className="glass rounded-2xl overflow-hidden group card-hover">
      <Link href={`/events/${event.id}`}>
        <div className="relative h-40 overflow-hidden">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          <div className="absolute top-3 left-3 flex items-center gap-1.5 glass-strong px-2.5 py-1 rounded-full">
            <Music size={10} className="text-primary" />
            <span className="text-[10px] font-medium">{t("type.event")}</span>
          </div>
        </div>
      </Link>
      <div className="p-5">
        <Link href={`/events/${event.id}`}>
          <h3 className="text-sm font-bold mb-1 group-hover:text-primary transition-colors line-clamp-1">
            {event.title}
          </h3>
        </Link>
        <p className="text-xs text-muted mb-3">{event.artist}</p>
        <div className="flex flex-wrap gap-2 text-[10px] text-muted mb-4">
          <span className="flex items-center gap-1">
            <Calendar size={10} className="text-primary" />
            {event.date}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={10} className="text-primary" />
            {event.city}
          </span>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <span className="text-sm font-bold text-gradient-primary">{event.price}</span>
          <button
            onClick={onRemove}
            className="flex items-center gap-1.5 text-[10px] text-muted hover:text-red-400 transition-colors"
            data-cursor-hover
          >
            <Trash2 size={10} />
            {t("remove")}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================
   SAVED VENUE CARD
   ============================================ */
function SavedVenueCard({
  venueId,
  onRemove,
  t,
}: {
  venueId: string;
  onRemove: () => void;
  t: ReturnType<typeof useTranslations>;
}) {
  const venue = venues.find((v) => v.id === venueId);
  if (!venue) return null;

  return (
    <div className="glass rounded-2xl overflow-hidden group card-hover">
      <Link href={`/venues/${venue.id}`}>
        <div className="relative h-40 overflow-hidden">
          <Image
            src={venue.image}
            alt={venue.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          <div className="absolute top-3 left-3 flex items-center gap-1.5 glass-strong px-2.5 py-1 rounded-full">
            <Building2 size={10} className="text-accent" />
            <span className="text-[10px] font-medium">{t("type.venue")}</span>
          </div>
        </div>
      </Link>
      <div className="p-5">
        <Link href={`/venues/${venue.id}`}>
          <h3 className="text-sm font-bold mb-1 group-hover:text-accent transition-colors line-clamp-1">
            {venue.name}
          </h3>
        </Link>
        <div className="flex flex-wrap gap-2 text-[10px] text-muted mb-3">
          <span className="flex items-center gap-1">
            <MapPin size={10} className="text-accent" />
            {venue.city}
          </span>
          <span className="flex items-center gap-1">
            <Users size={10} className="text-accent" />
            {venue.capacity}
          </span>
          <span className="flex items-center gap-1">
            <Star size={10} className="text-gold fill-gold" />
            {venue.rating}
          </span>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <span className="text-xs text-white/50">{venue.type}</span>
          <button
            onClick={onRemove}
            className="flex items-center gap-1.5 text-[10px] text-muted hover:text-red-400 transition-colors"
            data-cursor-hover
          >
            <Trash2 size={10} />
            {t("remove")}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================
   SAVED POST CARD
   ============================================ */
function SavedPostCard({
  postId,
  onRemove,
  t,
}: {
  postId: string;
  onRemove: () => void;
  t: ReturnType<typeof useTranslations>;
}) {
  const post = communityPosts.find((p) => p.id === postId);
  if (!post) return null;

  return (
    <div className="glass rounded-2xl overflow-hidden group card-hover">
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 glass px-2.5 py-1 rounded-full">
            <MessageSquare size={10} className="text-secondary" />
            <span className="text-[10px] font-medium">{t("type.post")}</span>
          </div>
          <span className="text-[10px] text-muted">{post.time}</span>
        </div>
        <div className="flex items-center gap-2.5 mb-3">
          <div className="relative w-8 h-8 rounded-full overflow-hidden ring-1 ring-white/10 flex-shrink-0">
            <Image src={post.avatar} alt={post.user} fill className="object-cover" />
          </div>
          <span className="text-xs font-semibold">{post.user}</span>
        </div>
        <p className="text-xs text-white/70 leading-relaxed line-clamp-3 mb-3">{post.content}</p>
        {post.image && (
          <div className="relative h-32 rounded-xl overflow-hidden mb-3">
            <Image src={post.image} alt="Post" fill className="object-cover" />
          </div>
        )}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex items-center gap-3 text-[10px] text-muted">
            <span className="flex items-center gap-1">
              <Heart size={10} className="text-primary" />
              {post.likes}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare size={10} />
              {post.comments}
            </span>
          </div>
          <button
            onClick={onRemove}
            className="flex items-center gap-1.5 text-[10px] text-muted hover:text-red-400 transition-colors"
            data-cursor-hover
          >
            <Trash2 size={10} />
            {t("remove")}
          </button>
        </div>
      </div>
    </div>
  );
}
