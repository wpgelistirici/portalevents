"use client";

import { use, useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useTranslations } from "next-intl";
import SmoothScroll from "@/components/ui/SmoothScroll";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GradientOrb from "@/components/ui/GradientOrb";
import { FadeInUp } from "@/components/ui/AnimatedText";
import { Link } from "@/i18n/routing";
import { artists, events } from "@/lib/data";
import { useAuth } from "@/lib/auth-context";
import { useSaved } from "@/lib/saved-context";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Share2,
  Bookmark,
  ExternalLink,
  Music,
  Globe,
  Disc3,
  Tag,
  Play,
  ArrowUpRight,
  Heart,
  Headphones,
} from "lucide-react";

const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), {
  ssr: false,
});

/* Social media icons */
function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function SpotifyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

function SoundcloudIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c-.009-.06-.05-.1-.1-.1m-.899.828c-.06 0-.091.037-.104.094L0 14.479l.172 1.282c.013.06.045.094.104.094.057 0 .09-.037.104-.094l.201-1.282-.201-1.332c-.014-.057-.047-.094-.104-.094m1.8-1.16c-.063 0-.11.053-.119.114l-.218 2.472.218 2.398c.008.063.056.114.119.114.063 0 .11-.053.12-.114l.248-2.398-.248-2.472c-.01-.063-.057-.114-.12-.114m.901-.318c-.073 0-.126.058-.131.127l-.209 2.791.209 2.71c.005.07.058.127.131.127.072 0 .123-.058.132-.127l.237-2.71-.237-2.791c-.009-.07-.06-.127-.132-.127m.934-.418c-.083 0-.142.063-.148.14l-.2 3.209.2 3.082c.006.08.065.14.148.14.082 0 .14-.063.15-.14l.226-3.082-.226-3.209c-.01-.077-.068-.14-.15-.14m.918-.31c-.093 0-.158.07-.162.154l-.19 3.518.19 3.373c.004.088.069.154.162.154.093 0 .156-.07.164-.154l.217-3.373-.217-3.518c-.008-.084-.071-.154-.164-.154m1.164-.432c-.016-.09-.083-.155-.17-.155-.09 0-.158.07-.17.155l-.163 3.95.163 3.818c.012.093.08.157.17.157.088 0 .154-.064.17-.157l.186-3.818-.186-3.95m.637 3.95l.175-4.043c-.011-.1-.09-.167-.18-.167-.094 0-.17.07-.183.167l-.155 4.043.155 3.88c.013.098.09.165.183.165.094 0 .169-.07.183-.165l.175-3.88m.692-4.676c-.1 0-.182.08-.192.177l-.146 4.627.146 3.92c.01.098.092.178.192.178.1 0 .181-.08.192-.178l.166-3.92-.166-4.627c-.011-.097-.092-.177-.192-.177m.918.059c-.108 0-.195.085-.203.19l-.136 4.57.136 3.932c.008.106.095.19.203.19.109 0 .195-.084.205-.19l.154-3.932-.154-4.57c-.01-.105-.096-.19-.205-.19m.922-.236c-.119 0-.212.093-.218.207l-.127 4.806.127 3.942c.006.114.1.207.218.207.12 0 .212-.093.22-.207l.144-3.942-.144-4.806c-.008-.114-.1-.207-.22-.207m1.367-.362c-.014-.12-.112-.21-.228-.21-.12 0-.218.09-.23.21l-.118 5.168.118 3.953c.012.12.11.21.23.21.118 0 .214-.09.228-.21l.134-3.953-.134-5.168m.453 5.168l.126-5.455c-.014-.127-.118-.22-.24-.22-.124 0-.226.093-.24.22l-.111 5.455.111 3.964c.014.127.116.22.24.22.122 0 .226-.093.24-.22l.126-3.964m.83-5.863c-.128 0-.238.1-.248.233l-.102 5.621.102 3.964c.01.13.12.233.248.233.128 0 .236-.103.248-.233l.116-3.964-.116-5.621c-.012-.133-.12-.233-.248-.233m1.268.285c-.01-.14-.128-.245-.26-.245-.133 0-.25.105-.261.245l-.092 5.336.092 3.963c.011.14.128.245.261.245.132 0 .25-.105.26-.245l.104-3.963-.104-5.336m.453 5.336l.096-5.593c-.01-.147-.135-.258-.274-.258-.14 0-.264.11-.276.258l-.084 5.593.084 3.963c.012.147.136.258.276.258.139 0 .264-.11.274-.258l.096-3.963m.924-6.005c-.148 0-.277.117-.287.268l-.074 5.848.074 3.949c.01.15.14.268.287.268.148 0 .275-.117.287-.268l.084-3.949-.084-5.848c-.012-.15-.14-.268-.287-.268M21.098 8.07c-.16 0-.294.125-.303.282l-.065 6.127.065 3.93c.009.157.143.282.303.282.161 0 .293-.125.305-.282l.073-3.93-.073-6.127c-.012-.157-.144-.282-.305-.282m1.38 1.469c-.168 0-.308.132-.315.297l-.047 4.938.054 3.895c.007.165.147.297.315.297.168 0 .307-.132.315-.297l.062-3.895-.062-4.938c-.008-.165-.147-.297-.315-.297m.776-.104c-.007-.172-.154-.308-.328-.308-.176 0-.322.136-.329.308L22.5 14.48l.097 3.848c.007.172.153.308.329.308.174 0 .321-.136.328-.308l.104-3.848-.104-5.045" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

const socialConfig: Record<string, { icon: React.FC; color: string; label: string }> = {
  instagram: { icon: InstagramIcon, color: "hover:text-pink-400", label: "Instagram" },
  twitter: { icon: TwitterIcon, color: "hover:text-white", label: "X (Twitter)" },
  spotify: { icon: SpotifyIcon, color: "hover:text-green-400", label: "Spotify" },
  soundcloud: { icon: SoundcloudIcon, color: "hover:text-orange-400", label: "SoundCloud" },
  youtube: { icon: YoutubeIcon, color: "hover:text-red-500", label: "YouTube" },
};

export default function ArtistDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = use(params);
  const artist = artists.find((a) => a.id === id);
  const t = useTranslations("ArtistDetail");
  const { isAuthenticated, openAuthModal } = useAuth();
  const { isSaved: checkSaved, toggleSave } = useSaved();
  const [, setShareCopied] = useState(false);

  // Events this artist has performed at or will perform at
  const artistEvents = events.filter(
    (e) => e.artist === artist?.name
  );
  const upcomingEvents = artistEvents.filter(() => true); // all mock events are "upcoming"
  const pastEvents: typeof artistEvents = []; // no past events in mock data

  // Similar artists (same genre, excluding self)
  const similarArtists = artist
    ? artists.filter((a) => a.id !== artist.id && a.genre === artist.genre).slice(0, 3)
    : [];
  // If not enough similar by genre, fill with others
  const relatedArtists =
    similarArtists.length < 3
      ? [
          ...similarArtists,
          ...artists
            .filter((a) => a.id !== artist?.id && !similarArtists.find((s) => s.id === a.id))
            .slice(0, 3 - similarArtists.length),
        ]
      : similarArtists;

  const handleSave = () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    if (!artist) return;
    toggleSave(artist.id, "artist");
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: artist?.name,
        text: artist?.bio,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  };

  if (!artist) {
    return (
      <>
        <SmoothScroll />
        <CustomCursor />
        <NoiseOverlay />
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Music className="w-16 h-16 text-muted mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">{t("notFound")}</h1>
            <p className="text-muted mb-6">{t("notFoundDesc")}</p>
            <Link
              href="/artists"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              <ArrowLeft size={16} />
              {t("backToArtists")}
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const isSaved = checkSaved(artist.id, "artist");

  return (
    <>
      <SmoothScroll />
      <CustomCursor />
      <NoiseOverlay />
      <Navbar />
      {/* SaveToast is handled globally by SavedProvider */}

      <main className="min-h-screen">
        {/* Background orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <GradientOrb color="secondary" size={500} top="10%" left="-15%" />
          <GradientOrb color="accent" size={350} bottom="20%" right="-10%" delay={2} />
        </div>

        {/* Hero / Cover */}
        <section className="relative h-[55vh] min-h-[420px] overflow-hidden">
          <Image
            src={artist.coverImage || artist.image}
            alt={artist.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/40 to-transparent" />

          {/* Back button */}
          <div className="absolute top-28 left-6 z-10">
            <Link
              href="/artists"
              className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-white/80 hover:text-white transition-colors"
              data-cursor-hover
            >
              <ArrowLeft size={16} />
              {t("backToArtists")}
            </Link>
          </div>

          {/* Artist info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="max-w-7xl mx-auto flex items-end gap-6 md:gap-8">
              {/* Avatar */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl flex-shrink-0 hidden sm:block"
              >
                <Image
                  src={artist.image}
                  alt={artist.name}
                  width={144}
                  height={144}
                  className="object-cover w-full h-full"
                />
              </motion.div>

              <div className="flex-1 min-w-0">
                <FadeInUp>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-3 py-1 glass rounded-full text-[10px] font-medium text-secondary">
                      {artist.genre}
                    </span>
                    {artist.country && (
                      <span className="px-3 py-1 glass rounded-full text-[10px] font-medium text-white/60">
                        <Globe size={10} className="inline mr-1" />
                        {artist.country}
                      </span>
                    )}
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3">
                    {artist.name}
                  </h1>
                  <p className="text-sm text-white/60 max-w-xl line-clamp-2">{artist.bio}</p>
                </FadeInUp>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <motion.button
                  onClick={handleSave}
                  data-cursor-hover
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-11 h-11 rounded-full glass-strong flex items-center justify-center transition-colors ${isSaved ? "text-primary" : "text-white/60 hover:text-white"}`}
                >
                  <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
                </motion.button>
                <motion.button
                  onClick={handleShare}
                  data-cursor-hover
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-11 h-11 rounded-full glass-strong flex items-center justify-center text-white/60 hover:text-white transition-colors"
                >
                  <Share2 size={18} />
                </motion.button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <section className="relative z-10 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex flex-wrap items-center gap-6 md:gap-10 py-5 text-sm">
              <div className="flex items-center gap-2 text-white/60">
                <Users size={16} className="text-secondary" />
                <span className="font-semibold text-white">{artist.followers}</span> {t("followers")}
              </div>
              {artist.monthlyListeners && (
                <div className="flex items-center gap-2 text-white/60">
                  <Headphones size={16} className="text-secondary" />
                  <span className="font-semibold text-white">{artist.monthlyListeners}</span> {t("monthlyListeners")}
                </div>
              )}
              <div className="flex items-center gap-2 text-white/60">
                <Calendar size={16} className="text-secondary" />
                <span className="font-semibold text-white">{artist.upcoming}</span> {t("upcomingEvents")}
              </div>
              {artist.activeYears && (
                <div className="flex items-center gap-2 text-white/60">
                  <Disc3 size={16} className="text-secondary" />
                  <span className="text-white">{artist.activeYears}</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Main content */}
        <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left / Main content - 2 cols */}
            <div className="lg:col-span-2 space-y-10">
              {/* About */}
              <FadeInUp>
                <div className="glass rounded-2xl p-6 md:p-8">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Music size={18} className="text-secondary" />
                    {t("about")}
                  </h2>
                  <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">
                    {artist.longBio || artist.bio}
                  </p>

                  {/* Tags */}
                  {artist.tags && artist.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/5">
                      <Tag size={14} className="text-secondary mt-0.5" />
                      {artist.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 glass rounded-full text-[11px] text-white/60">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Labels */}
                  {artist.labels && artist.labels.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mt-4">
                      <Disc3 size={14} className="text-secondary" />
                      <span className="text-xs text-white/40 mr-1">{t("labels")}:</span>
                      {artist.labels.map((label) => (
                        <span key={label} className="text-xs text-white/60">{label}</span>
                      ))}
                    </div>
                  )}
                </div>
              </FadeInUp>

              {/* Upcoming Events */}
              {upcomingEvents.length > 0 && (
                <FadeInUp delay={0.1}>
                  <div>
                    <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                      <Calendar size={18} className="text-secondary" />
                      {t("upcomingEventsTitle")}
                    </h2>
                    <div className="space-y-3">
                      {upcomingEvents.map((event) => (
                        <Link key={event.id} href={`/events/${event.id}` as "/events/[id]"} data-cursor-hover>
                          <motion.div
                            className="group glass rounded-2xl overflow-hidden flex items-center gap-4 hover:bg-white/[0.04] transition-colors"
                            whileHover={{ x: 4 }}
                          >
                            <div className="relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0">
                              <Image src={event.image} alt={event.title} fill className="object-cover" />
                            </div>
                            <div className="flex-1 min-w-0 py-3 pr-4">
                              <h3 className="text-sm font-bold group-hover:text-secondary transition-colors truncate">
                                {event.title}
                              </h3>
                              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-white/50">
                                <span className="flex items-center gap-1">
                                  <Calendar size={12} />
                                  {event.date}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock size={12} />
                                  {event.time}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin size={12} />
                                  {event.venue}, {event.city}
                                </span>
                              </div>
                              <div className="mt-2">
                                <span className="text-xs font-semibold text-secondary">{event.price}</span>
                              </div>
                            </div>
                            <ArrowUpRight size={18} className="text-white/20 group-hover:text-secondary mr-4 flex-shrink-0 transition-colors" />
                          </motion.div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </FadeInUp>
              )}

              {/* Past Events (placeholder) */}
              {pastEvents.length > 0 && (
                <FadeInUp delay={0.15}>
                  <div>
                    <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                      <Clock size={18} className="text-white/40" />
                      {t("pastEventsTitle")}
                    </h2>
                    <div className="space-y-3">
                      {pastEvents.map((event) => (
                        <Link key={event.id} href={`/events/${event.id}` as "/events/[id]"} data-cursor-hover>
                          <div className="glass rounded-2xl p-4 flex items-center gap-4 opacity-60 hover:opacity-80 transition-opacity">
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                              <Image src={event.image} alt={event.title} fill className="object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-semibold truncate">{event.title}</h3>
                              <p className="text-xs text-white/40 mt-1">{event.date} - {event.venue}</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </FadeInUp>
              )}

              {/* No events */}
              {upcomingEvents.length === 0 && pastEvents.length === 0 && (
                <FadeInUp delay={0.1}>
                  <div className="glass rounded-2xl p-10 text-center">
                    <Calendar size={40} className="text-white/10 mx-auto mb-3" />
                    <p className="text-sm text-white/40">{t("noEvents")}</p>
                  </div>
                </FadeInUp>
              )}

              {/* Similar Artists */}
              {relatedArtists.length > 0 && (
                <FadeInUp delay={0.2}>
                  <div>
                    <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                      <Heart size={18} className="text-secondary" />
                      {t("similarArtists")}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {relatedArtists.map((a) => (
                        <Link key={a.id} href={`/artists/${a.id}` as "/artists/[id]"} data-cursor-hover>
                          <motion.div
                            className="group glass rounded-2xl overflow-hidden"
                            whileHover={{ y: -4 }}
                          >
                            <div className="relative h-40 overflow-hidden">
                              <Image src={a.image} alt={a.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                              <div className="absolute bottom-0 left-0 right-0 p-4">
                                <span className="px-2 py-0.5 glass rounded-full text-[9px] font-medium text-secondary">
                                  {a.genre}
                                </span>
                                <h3 className="text-sm font-bold mt-1 group-hover:text-secondary transition-colors">
                                  {a.name}
                                </h3>
                                <p className="text-[11px] text-white/40 mt-0.5">
                                  {a.followers} {t("followers")}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </FadeInUp>
              )}
            </div>

            {/* Right sidebar */}
            <div className="space-y-6">
              {/* Social Media */}
              {artist.socialMedia && Object.keys(artist.socialMedia).length > 0 && (
                <FadeInUp delay={0.1}>
                  <div className="glass rounded-2xl p-6">
                    <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                      <Share2 size={14} className="text-secondary" />
                      {t("socialMedia")}
                    </h3>
                    <div className="space-y-2">
                      {Object.entries(artist.socialMedia).map(([key, url]) => {
                        if (!url) return null;
                        if (key === "website") return null; // shown separately
                        const config = socialConfig[key];
                        if (!config) return null;
                        const Icon = config.icon;
                        return (
                          <a
                            key={key}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-cursor-hover
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-white/50 ${config.color}`}
                          >
                            <Icon />
                            <span className="text-sm">{config.label}</span>
                            <ExternalLink size={12} className="ml-auto opacity-40" />
                          </a>
                        );
                      })}
                      {artist.socialMedia.website && (
                        <a
                          href={artist.socialMedia.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-cursor-hover
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-white/50 hover:text-secondary"
                        >
                          <Globe size={18} />
                          <span className="text-sm">{t("officialWebsite")}</span>
                          <ExternalLink size={12} className="ml-auto opacity-40" />
                        </a>
                      )}
                    </div>
                  </div>
                </FadeInUp>
              )}

              {/* Quick Info */}
              <FadeInUp delay={0.15}>
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                    <Music size={14} className="text-secondary" />
                    {t("quickInfo")}
                  </h3>
                  <div className="space-y-3">
                    {artist.country && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/40">{t("country")}</span>
                        <span className="text-white/80">{artist.country}</span>
                      </div>
                    )}
                    {artist.city && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/40">{t("city")}</span>
                        <span className="text-white/80">{artist.city}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/40">{t("genre")}</span>
                      <span className="text-white/80">{artist.genre}</span>
                    </div>
                    {artist.activeYears && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/40">{t("activeYears")}</span>
                        <span className="text-white/80">{artist.activeYears}</span>
                      </div>
                    )}
                    {artist.monthlyListeners && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/40">{t("monthlyListenersShort")}</span>
                        <span className="text-white/80">{artist.monthlyListeners}</span>
                      </div>
                    )}
                  </div>
                </div>
              </FadeInUp>

              {/* Listen CTA */}
              {artist.socialMedia?.spotify && (
                <FadeInUp delay={0.2}>
                  <a
                    href={artist.socialMedia.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor-hover
                    className="block"
                  >
                    <motion.div
                      className="rounded-2xl p-5 bg-gradient-to-br from-green-500/20 to-green-600/5 border border-green-500/20 group hover:border-green-500/40 transition-colors"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                          <Play size={18} className="text-green-400 ml-0.5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-green-400">{t("listenOnSpotify")}</p>
                          <p className="text-[11px] text-green-400/50">{artist.monthlyListeners} {t("monthlyListeners")}</p>
                        </div>
                        <ExternalLink size={14} className="ml-auto text-green-400/40 group-hover:text-green-400/80 transition-colors" />
                      </div>
                    </motion.div>
                  </a>
                </FadeInUp>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
