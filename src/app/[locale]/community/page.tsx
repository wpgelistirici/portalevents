"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import SmoothScroll from "@/components/ui/SmoothScroll";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { communityPosts, events } from "@/lib/data";
import { useTranslations } from "next-intl";
import { FadeInUp, AnimatedWords, ScaleIn } from "@/components/ui/AnimatedText";
import GradientOrb from "@/components/ui/GradientOrb";
import { useAuth } from "@/lib/auth-context";
import { useSaved } from "@/lib/saved-context";
import SaveToast from "@/components/ui/SaveToast";
import {
  Heart,
  MessageCircle,
  Share2,
  Sparkles,
  ImageIcon,
  Send,
  TrendingUp,
  Users,
  Flame,
  X,
  MoreHorizontal,
  Bookmark,
  Check,
  Smile,
  Calendar,
  MapPin,
  Clock,
  Music,
  Search,
} from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { getLenis } from "@/components/ui/SmoothScroll";

const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), {
  ssr: false,
});

const trendingTopics = [
  { tag: "#NeonPulseFestival", posts: "2.4K" },
  { tag: "#İstanbulMüzik", posts: "1.8K" },
  { tag: "#TechnoNight", posts: "956" },
  { tag: "#JazzUnderStars", posts: "743" },
  { tag: "#BonoboLive", posts: "612" },
];

/* ============================================
   TYPES
   ============================================ */
interface Comment {
  id: string;
  user: string;
  avatar: string;
  content: string;
  time: string;
  likes: number;
  liked: boolean;
}

interface AttachedEvent {
  id: string;
  title: string;
  artist: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  image: string;
  genre: string;
}

interface Post {
  id: string;
  user: string;
  avatar: string;
  content: string;
  likes: number;
  comments: number;
  time: string;
  image?: string;
  liked: boolean;
  saved: boolean;
  commentList: Comment[];
  attachedEvent?: AttachedEvent;
}

/* ============================================
   MOCK COMMENTS (more for realism)
   ============================================ */
const AVATARS = {
  cem: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  zeynep: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  baris: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
  ayse: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
  mert: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
  elif: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop",
  deniz: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
  can: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
  selin: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop",
  emre: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop",
};

function generateMockComments(postId: string): Comment[] {
  const comments: Record<string, Comment[]> = {
    "1": [
      { id: "c1-1", user: "Cem A.", avatar: AVATARS.cem, content: "Kesinlikle katılıyorum! O bass drop anı efsaneydi 🔊", time: "2s önce", likes: 12, liked: false },
      { id: "c1-2", user: "Zeynep M.", avatar: AVATARS.zeynep, content: "Ben de oradaydım, müthiş bir geceydi!", time: "1s önce", likes: 8, liked: false },
      { id: "c1-3", user: "Barış T.", avatar: AVATARS.baris, content: "Bir sonraki sefere haber verin beraber gidelim 🎶", time: "55dk önce", likes: 5, liked: false },
      { id: "c1-4", user: "Ayşe D.", avatar: AVATARS.ayse, content: "Klein'in ses sistemi gerçekten başka bir seviye. Amelie Lens de tam hak ettiği performansı sergiledi.", time: "50dk önce", likes: 19, liked: false },
      { id: "c1-5", user: "Mert K.", avatar: AVATARS.mert, content: "Bir dahaki sefer bilet almayı unutmayacağım 😭", time: "45dk önce", likes: 3, liked: false },
      { id: "c1-6", user: "Deniz Y.", avatar: AVATARS.deniz, content: "Warm-up DJ de çok iyiydi, adını bilen var mı?", time: "40dk önce", likes: 7, liked: false },
      { id: "c1-7", user: "Can B.", avatar: AVATARS.can, content: "Closing set'teki şarkıyı hala arıyorum, bilen varsa yazabilir mi?", time: "38dk önce", likes: 15, liked: false },
      { id: "c1-8", user: "Selin T.", avatar: AVATARS.selin, content: "Işık show'u da ayrı bir düzeydeydi. Lazerler inanılmazdı ✨", time: "35dk önce", likes: 21, liked: false },
      { id: "c1-9", user: "Emre K.", avatar: AVATARS.emre, content: "Bu senenin en iyi etkinliğiydi, tereddütsüz söylüyorum.", time: "30dk önce", likes: 33, liked: false },
      { id: "c1-10", user: "Elif K.", avatar: AVATARS.elif, content: "Arka bahçedeki ambient stage'i keşfettiniz mi? Orada da ayrı bir atmosfer vardı.", time: "25dk önce", likes: 11, liked: false },
      { id: "c1-11", user: "Cem A.", avatar: AVATARS.cem, content: "@Elif evet! Orayı keşfetmemiz yarım saat sürdü ama değdi 😅", time: "22dk önce", likes: 8, liked: false },
      { id: "c1-12", user: "Zeynep M.", avatar: AVATARS.zeynep, content: "Bir sonraki etkinlik ne zaman acaba? Klein'in sosyal medyasını takip edin derim.", time: "20dk önce", likes: 6, liked: false },
      { id: "c1-13", user: "Can B.", avatar: AVATARS.can, content: "Mart ayında büyük bir etkinlik daha olacak diye duydum, mekan aynı 🔥", time: "18dk önce", likes: 24, liked: false },
      { id: "c1-14", user: "Selin T.", avatar: AVATARS.selin, content: "Biletler çıkar çıkmaz alacağım, geçen sefer son anda bulmuştum.", time: "15dk önce", likes: 9, liked: false },
      { id: "c1-15", user: "Barış T.", avatar: AVATARS.baris, content: "Grup bileti olursa daha uygun oluyor, beraber alalım.", time: "12dk önce", likes: 13, liked: false },
      { id: "c1-16", user: "Mert K.", avatar: AVATARS.mert, content: "Sound quality açısından İstanbul'un en iyi mekanı burası bence 🎵", time: "10dk önce", likes: 17, liked: false },
      { id: "c1-17", user: "Deniz Y.", avatar: AVATARS.deniz, content: "Katılıyorum! Funktion-One sistemi fark yaratıyor.", time: "8dk önce", likes: 5, liked: false },
      { id: "c1-18", user: "Ayşe D.", avatar: AVATARS.ayse, content: "Arkadaşlar afterparty fotoğraflarını da paylaşır mısınız? 📸", time: "5dk önce", likes: 4, liked: false },
      { id: "c1-19", user: "Emre K.", avatar: AVATARS.emre, content: "Fotoğrafları story'de paylaştım, profilimden bakabilirsiniz 🙌", time: "3dk önce", likes: 7, liked: false },
      { id: "c1-20", user: "Elif K.", avatar: AVATARS.elif, content: "Harika bir gece için herkese teşekkürler! Bir sonrakinde görüşmek üzere 💜", time: "1dk önce", likes: 28, liked: false },
    ],
    "2": [
      { id: "c2-1", user: "Elif K.", avatar: AVATARS.elif, content: "Ben gidiyorum! İstanbul Avrupa yakasından 3 kişilik grubumuz var", time: "2s önce", likes: 15, liked: false },
      { id: "c2-2", user: "Zeynep M.", avatar: AVATARS.zeynep, content: "Beni de ekleyin lütfen! 🙋‍♀️", time: "1s önce", likes: 7, liked: false },
      { id: "c2-3", user: "Mert K.", avatar: AVATARS.mert, content: "Kaç günlük festival? Konaklama ayarladınız mı?", time: "55dk önce", likes: 4, liked: false },
      { id: "c2-4", user: "Deniz Y.", avatar: AVATARS.deniz, content: "İstanbul'dan otobüs kalkıyor diye duydum, araştıralım mı?", time: "50dk önce", likes: 11, liked: false },
      { id: "c2-5", user: "Can B.", avatar: AVATARS.can, content: "3 günlük festival, kamp alanı da var. Ben çadır götüreceğim 🏕️", time: "45dk önce", likes: 19, liked: false },
      { id: "c2-6", user: "Selin T.", avatar: AVATARS.selin, content: "Kamp yerine yakınlardaki pansiyonu önerebilirim, geçen sene kaldım. Çok temiz.", time: "42dk önce", likes: 14, liked: false },
      { id: "c2-7", user: "Emre K.", avatar: AVATARS.emre, content: "Line-up'ta kimler var? Henüz tam listeyi görmedim.", time: "40dk önce", likes: 3, liked: false },
      { id: "c2-8", user: "Cem A.", avatar: AVATARS.cem, content: "İlk gün techno ağırlıklı, ikinci gün house, üçüncü gün karışık diye biliyorum.", time: "38dk önce", likes: 22, liked: false },
      { id: "c2-9", user: "Barış T.", avatar: AVATARS.baris, content: "Early bird biletler hâlâ var mı? Fiyat ne kadar?", time: "35dk önce", likes: 6, liked: false },
      { id: "c2-10", user: "Ayşe D.", avatar: AVATARS.ayse, content: "Early bird bitti ama normal bilet 800 TL. Yine de değer bence 3 gün için.", time: "32dk önce", likes: 10, liked: false },
      { id: "c2-11", user: "Elif K.", avatar: AVATARS.elif, content: "Arabayla gidecek varsa yer var yanımda. Benzin paylaşalım 🚗", time: "28dk önce", likes: 17, liked: false },
      { id: "c2-12", user: "Mert K.", avatar: AVATARS.mert, content: "@Elif ben gelirim! Kaç kişilik araç?", time: "25dk önce", likes: 5, liked: false },
      { id: "c2-13", user: "Can B.", avatar: AVATARS.can, content: "WhatsApp grubu kuralım mı organizasyon için? Daha kolay olur.", time: "20dk önce", likes: 31, liked: false },
      { id: "c2-14", user: "Selin T.", avatar: AVATARS.selin, content: "Süper fikir! Ben de katılmak istiyorum gruba 🙋‍♀️", time: "18dk önce", likes: 8, liked: false },
      { id: "c2-15", user: "Deniz Y.", avatar: AVATARS.deniz, content: "Geçen seneki festivalde tanıştığım insanlarla hâlâ görüşüyorum. Bu etkinliklerin en güzel yanı bu.", time: "10dk önce", likes: 25, liked: false },
      { id: "c2-16", user: "Emre K.", avatar: AVATARS.emre, content: "Kesinlikle! Festival = yeni arkadaşlıklar. Heyecanla bekliyorum 🎉", time: "5dk önce", likes: 12, liked: false },
    ],
    "3": [
      { id: "c3-1", user: "Cem A.", avatar: AVATARS.cem, content: "Yeni albüm çok iyi, özellikle 3. parça harika!", time: "2s önce", likes: 22, liked: false },
      { id: "c3-2", user: "Barış T.", avatar: AVATARS.baris, content: "Playlist'i paylaşır mısın? 🎧", time: "1s önce", likes: 9, liked: false },
      { id: "c3-3", user: "Ayşe D.", avatar: AVATARS.ayse, content: "Migration albümü hala favorim ama bu da çok güzel olmuş. Canlı performansı merak ediyorum!", time: "55dk önce", likes: 14, liked: false },
      { id: "c3-4", user: "Selin T.", avatar: AVATARS.selin, content: "Bonobo'nun DJ setleri de çok iyi ama live show bambaşka bir deneyim. Kesinlikle gidin.", time: "50dk önce", likes: 27, liked: false },
      { id: "c3-5", user: "Emre K.", avatar: AVATARS.emre, content: "Geçen sene Londra'da canlı izlemiştim, sahne performansı mükemmel 🎹", time: "45dk önce", likes: 18, liked: false },
      { id: "c3-6", user: "Can B.", avatar: AVATARS.can, content: "Fragments albümünden sonra beklentim çok yüksekti, hayal kırıklığına uğratmadı.", time: "40dk önce", likes: 11, liked: false },
      { id: "c3-7", user: "Deniz Y.", avatar: AVATARS.deniz, content: "Vinyl olarak da çıkacak mı acaba? Koleksiyonuma eklemek istiyorum 💿", time: "35dk önce", likes: 8, liked: false },
      { id: "c3-8", user: "Elif K.", avatar: AVATARS.elif, content: "Bandcamp'te pre-order açılmış! Limited edition var.", time: "30dk önce", likes: 15, liked: false },
      { id: "c3-9", user: "Mert K.", avatar: AVATARS.mert, content: "Konser biletleri ne zaman satışa çıkıyor bilen var mı?", time: "25dk önce", likes: 6, liked: false },
      { id: "c3-10", user: "Zeynep M.", avatar: AVATARS.zeynep, content: "Önümüzdeki hafta satışa çıkacak diye duydum. Pulse'da duyuru gelir muhtemelen.", time: "20dk önce", likes: 10, liked: false },
      { id: "c3-11", user: "Cem A.", avatar: AVATARS.cem, content: "Bonobo + Nils Frahm birlikte çıksa hayal gibi olur ya 🤯", time: "15dk önce", likes: 34, liked: false },
      { id: "c3-12", user: "Barış T.", avatar: AVATARS.baris, content: "@Cem hayal değil gerçek olsun lütfen 🙏", time: "10dk önce", likes: 20, liked: false },
    ],
    "4": [
      { id: "c4-1", user: "Elif K.", avatar: AVATARS.elif, content: "Ankara'da IF Performance Hall gerçekten çok kaliteli bir mekan olmuş", time: "3s önce", likes: 18, liked: false },
      { id: "c4-2", user: "Deniz Y.", avatar: AVATARS.deniz, content: "Geçen ay MFÖ konseri vardı orada, akustik muhteşemdi 👌", time: "2s önce", likes: 10, liked: false },
      { id: "c4-3", user: "Can B.", avatar: AVATARS.can, content: "İzmir'de de benzer bir sahne açılsa keşke. Burada seçenek çok az.", time: "1s önce", likes: 14, liked: false },
      { id: "c4-4", user: "Selin T.", avatar: AVATARS.selin, content: "Ankara'nın müzik sahnesini küçümsememek lazım. Son yıllarda çok gelişti.", time: "55dk önce", likes: 22, liked: false },
      { id: "c4-5", user: "Emre K.", avatar: AVATARS.emre, content: "Eskişehir de ekleyelim listeye. Üniversite şehri olunca sürekli etkinlik oluyor.", time: "50dk önce", likes: 9, liked: false },
      { id: "c4-6", user: "Mert K.", avatar: AVATARS.mert, content: "Anadolu turnesi yapan sanatçılar artmalı. Her şey İstanbul'da olmasın.", time: "45dk önce", likes: 31, liked: false },
      { id: "c4-7", user: "Barış T.", avatar: AVATARS.baris, content: "Kesinlikle katılıyorum! Mersin, Adana, Antalya gibi şehirlerde de potansiyel var.", time: "40dk önce", likes: 16, liked: false },
      { id: "c4-8", user: "Ayşe D.", avatar: AVATARS.ayse, content: "Antalya'da yaz festivalleri çok iyi oluyor aslında. Sahil konserleri başka 🌊", time: "35dk önce", likes: 13, liked: false },
      { id: "c4-9", user: "Cem A.", avatar: AVATARS.cem, content: "Pulse üzerinden şehir bazlı filtreleme yapabiliyoruz, çok kullanışlı.", time: "30dk önce", likes: 7, liked: false },
      { id: "c4-10", user: "Zeynep M.", avatar: AVATARS.zeynep, content: "Evet ama daha fazla Anadolu şehri eklenmeli platforma 🗺️", time: "25dk önce", likes: 11, liked: false },
      { id: "c4-11", user: "Elif K.", avatar: AVATARS.elif, content: "Bu konuda topluluk olarak baskı yapabiliriz. Ne kadar talep olursa o kadar etkinlik gelir.", time: "15dk önce", likes: 19, liked: false },
      { id: "c4-12", user: "Deniz Y.", avatar: AVATARS.deniz, content: "Haklısın! Organize eden arkadaşlar varsa destek olmaya hazırız 💪", time: "8dk önce", likes: 24, liked: false },
    ],
  };
  return comments[postId] || [];
}

const COMMENTS_PER_PAGE = 5;

/* ============================================
   POST DETAIL MODAL (Instagram-like)
   ============================================ */
function PostDetailModal({
  post,
  onClose,
  onLike,
  onSave,
  onAddComment,
  onLikeComment,
  t,
  userAvatar,
}: {
  post: Post;
  onClose: () => void;
  onLike: () => void;
  onSave: () => void;
  onAddComment: (text: string) => void;
  onLikeComment: (commentId: string) => void;
  t: ReturnType<typeof useTranslations>;
  userAvatar: string | null;
}) {
  const [commentText, setCommentText] = useState("");
  const [visibleCount, setVisibleCount] = useState(COMMENTS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const loadTriggerRef = useRef<HTMLDivElement>(null);

  const visibleComments = post.commentList.slice(0, visibleCount);
  const hasMore = visibleCount < post.commentList.length;

  // Lock body scroll + stop Lenis when modal open
  useEffect(() => {
    const lenis = getLenis();
    lenis?.stop();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, []);

  // Infinite scroll: load more when trigger element is visible
  useEffect(() => {
    const trigger = loadTriggerRef.current;
    if (!trigger) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          setIsLoadingMore(true);
          // Simulate network delay
          setTimeout(() => {
            setVisibleCount((prev) => prev + COMMENTS_PER_PAGE);
            setIsLoadingMore(false);
          }, 600);
        }
      },
      { root: scrollAreaRef.current, threshold: 0.1 },
    );

    observer.observe(trigger);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, visibleCount]);

  // When user adds a new comment, ensure it's visible (bump visibleCount)
  const prevCommentCount = useRef(post.commentList.length);
  useEffect(() => {
    if (post.commentList.length > prevCommentCount.current) {
      setVisibleCount(post.commentList.length);
      setTimeout(() => {
        commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
    prevCommentCount.current = post.commentList.length;
  }, [post.commentList.length]);

  // Focus input on open
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  const handleSubmit = () => {
    if (!commentText.trim()) return;
    onAddComment(commentText.trim());
    setCommentText("");
  };

  const hasImage = !!post.image;

  return (
    <motion.div
      className="fixed inset-0 z-[960] flex items-center justify-center overscroll-contain"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        data-cursor-hover
      >
        <X size={18} />
      </button>

      {/* Modal */}
      <motion.div
        className={`relative z-10 w-[95vw] max-w-5xl max-h-[90vh] rounded-2xl overflow-hidden flex ${
          hasImage ? "flex-col md:flex-row" : "flex-col"
        }`}
        style={{ background: "#0a0a0b" }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Left - Image (desktop only, if image exists) */}
        {hasImage && (
          <div className="relative w-full md:w-[55%] bg-black flex-shrink-0">
            <div className="relative w-full h-64 md:h-full md:min-h-[500px]">
              <Image
                src={post.image!}
                alt="Post"
                fill
                className="object-cover md:object-contain"
              />
            </div>
          </div>
        )}

        {/* Right - Post details + Comments */}
        <div
          className={`flex flex-col flex-1 min-h-0 ${
            hasImage ? "md:w-[45%]" : "max-w-2xl mx-auto w-full"
          }`}
        >
          {/* Post header */}
          <div className="flex items-center gap-3 p-4 border-b border-white/5 flex-shrink-0">
            <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-primary/20">
              <Image src={post.avatar} alt={post.user} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold">{post.user}</h4>
              <span className="text-[10px] text-muted">{post.time}</span>
            </div>
            <button className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center text-muted" data-cursor-hover>
              <MoreHorizontal size={14} />
            </button>
          </div>

          {/* Scrollable area: Post content + Comments */}
          <div ref={scrollAreaRef} className="flex-1 overflow-y-auto min-h-0 overscroll-contain">
            {/* Post content (shown as first "comment" like Instagram) */}
            <div className="px-4 py-4 flex gap-3 border-b border-white/[0.03]">
              <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                <Image src={post.avatar} alt={post.user} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm leading-relaxed">
                  <span className="font-semibold mr-1.5">{post.user}</span>
                  <span className="text-white/80">{post.content}</span>
                </p>
                {post.attachedEvent && (
                  <Link href={`/events/${post.attachedEvent.id}`} onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2.5 mt-2.5 p-2.5 rounded-lg bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors">
                      <div className="relative w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
                        <Image src={post.attachedEvent.image} alt={post.attachedEvent.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold truncate">{post.attachedEvent.title}</p>
                        <p className="text-[10px] text-muted">{post.attachedEvent.artist} · {post.attachedEvent.date}</p>
                      </div>
                    </div>
                  </Link>
                )}
                <span className="text-[10px] text-muted mt-1.5 block">{post.time}</span>
              </div>
            </div>

            {/* Comments */}
            {post.commentList.length > 0 ? (
              <div>
                {visibleComments.map((comment, idx) => (
                  <motion.div
                    key={comment.id}
                    initial={idx >= visibleCount - COMMENTS_PER_PAGE ? { opacity: 0, y: 10 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: idx >= visibleCount - COMMENTS_PER_PAGE ? (idx % COMMENTS_PER_PAGE) * 0.05 : 0 }}
                    className="px-4 py-3.5 flex gap-3 group hover:bg-white/[0.01] transition-colors"
                  >
                    <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                      <Image src={comment.avatar} alt={comment.user} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-relaxed">
                        <span className="font-semibold mr-1.5">{comment.user}</span>
                        <span className="text-white/75">{comment.content}</span>
                      </p>
                      <div className="flex items-center gap-4 mt-1.5">
                        <span className="text-[10px] text-muted">{comment.time}</span>
                        <button
                          className={`text-[10px] font-semibold transition-colors ${
                            comment.liked ? "text-primary" : "text-muted hover:text-white"
                          }`}
                          data-cursor-hover
                        >
                          {comment.likes > 0 && `${comment.likes} `}{t("like")}
                        </button>
                        <button className="text-[10px] font-semibold text-muted hover:text-white transition-colors" data-cursor-hover>
                          {t("reply")}
                        </button>
                      </div>
                    </div>
                    <motion.button
                      onClick={() => onLikeComment(comment.id)}
                      className="mt-1 flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
                      whileTap={{ scale: 0.8 }}
                      data-cursor-hover
                    >
                      <Heart
                        size={12}
                        className={comment.liked ? "text-primary fill-primary" : "text-muted"}
                      />
                    </motion.button>
                  </motion.div>
                ))}

                {/* Load more trigger / spinner */}
                {hasMore && (
                  <div ref={loadTriggerRef} className="flex items-center justify-center py-4">
                    {isLoadingMore ? (
                      <motion.div
                        className="w-5 h-5 border-2 border-white/10 border-t-primary rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      />
                    ) : (
                      <span className="text-[10px] text-muted">{t("scrollForMore")}</span>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <MessageCircle size={32} className="text-white/[0.06] mb-3" />
                <p className="text-sm font-semibold mb-1">{t("noCommentsTitle")}</p>
                <p className="text-xs text-muted">{t("noCommentsDesc")}</p>
              </div>
            )}
            <div ref={commentsEndRef} />
          </div>

          {/* Actions bar */}
          <div className="border-t border-white/5 px-4 py-3 flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={onLike}
                  whileTap={{ scale: 0.85 }}
                  data-cursor-hover
                >
                  <Heart
                    size={22}
                    className={`transition-colors ${
                      post.liked ? "text-primary fill-primary" : "text-white hover:text-white/70"
                    }`}
                  />
                </motion.button>
                <button
                  onClick={() => inputRef.current?.focus()}
                  data-cursor-hover
                >
                  <MessageCircle size={22} className="text-white hover:text-white/70 transition-colors" />
                </button>
                <button data-cursor-hover>
                  <Share2 size={20} className="text-white hover:text-white/70 transition-colors" />
                </button>
              </div>
              <motion.button
                onClick={onSave}
                whileTap={{ scale: 0.85 }}
                data-cursor-hover
              >
                <Bookmark
                  size={22}
                  className={`transition-colors ${
                    post.saved ? "text-gold fill-gold" : "text-white hover:text-white/70"
                  }`}
                />
              </motion.button>
            </div>
            <p className="text-xs font-semibold mb-1">
              {post.likes} {t("likesCount")}
            </p>
          </div>

          {/* Comment input */}
          <div className="border-t border-white/5 px-4 py-3 flex items-center gap-3 flex-shrink-0">
            <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
              {userAvatar ? (
                <Image src={userAvatar} alt="You" fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-[10px] font-bold">
                  ?
                </div>
              )}
            </div>
            <input
              ref={inputRef}
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder={t("commentPlaceholder")}
              className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-white/20"
            />
            <AnimatePresence>
              {commentText.trim() && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={handleSubmit}
                  className="text-primary text-sm font-semibold hover:text-primary/80 transition-colors"
                  data-cursor-hover
                >
                  {t("postComment")}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ============================================
   POST CARD COMPONENT (Feed - simplified, no inline comments)
   ============================================ */
function PostCard({
  post,
  onLike,
  onSave,
  onOpenDetail,
  t,
}: {
  post: Post;
  onLike: () => void;
  onSave: () => void;
  onOpenDetail: () => void;
  t: ReturnType<typeof useTranslations>;
}) {
  const [showShareToast, setShowShareToast] = useState(false);

  const handleShare = () => {
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2000);
  };

  return (
    <motion.div className="glass rounded-2xl overflow-hidden">
      <div className="p-6">
        {/* User header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary/20">
              <Image src={post.avatar} alt={post.user} fill className="object-cover" />
            </div>
            <div>
              <h4 className="text-sm font-semibold">{post.user}</h4>
              <span className="text-[10px] text-muted">{post.time}</span>
            </div>
          </div>
          <button className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center text-muted hover:text-white transition-colors" data-cursor-hover>
            <MoreHorizontal size={14} />
          </button>
        </div>

        {/* Content */}
        <p className="text-sm text-foreground/80 leading-relaxed mb-4">{post.content}</p>

        {/* Post image */}
        {post.image && (
          <div
            className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-4 cursor-pointer"
            onClick={onOpenDetail}
            data-cursor-hover
          >
            <Image src={post.image} alt="Post" fill className="object-cover" />
          </div>
        )}

        {/* Attached event */}
        {post.attachedEvent && (
          <Link href={`/events/${post.attachedEvent.id}`}>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 mb-4 hover:bg-white/[0.05] transition-colors group/event" data-cursor-hover>
              <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <Image src={post.attachedEvent.image} alt={post.attachedEvent.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <Music size={14} className="text-white/80" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate group-hover/event:text-primary transition-colors">
                  {post.attachedEvent.title}
                </p>
                <p className="text-[11px] text-muted truncate">{post.attachedEvent.artist}</p>
                <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted">
                  <span className="flex items-center gap-1">
                    <Calendar size={9} className="text-primary" />
                    {post.attachedEvent.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={9} className="text-primary" />
                    {post.attachedEvent.venue}
                  </span>
                </div>
              </div>
              <div className="text-[9px] text-accent bg-accent/5 px-2 py-1 rounded-full flex-shrink-0">
                {post.attachedEvent.genre}
              </div>
            </div>
          </Link>
        )}

        {/* Engagement stats */}
        <div className="flex items-center justify-between text-[11px] text-muted mb-3">
          <div className="flex items-center gap-1">
            {post.likes > 0 && (
              <>
                <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                  <Heart size={8} className="text-primary fill-primary" />
                </div>
                <span>{post.likes}</span>
              </>
            )}
          </div>
          <button
            onClick={onOpenDetail}
            className="hover:underline cursor-pointer"
            data-cursor-hover
          >
            {post.comments} {t("commentsCount")}
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 pt-3 border-t border-white/5">
          <motion.button
            onClick={onLike}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium transition-all ${
              post.liked ? "text-primary" : "text-muted hover:text-primary hover:bg-white/[0.03]"
            }`}
            whileTap={{ scale: 0.95 }}
            data-cursor-hover
          >
            <motion.div
              animate={post.liked ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Heart size={15} className={post.liked ? "fill-primary" : ""} />
            </motion.div>
            {t("like")}
          </motion.button>

          <button
            onClick={onOpenDetail}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium text-muted hover:text-secondary hover:bg-white/[0.03] transition-all"
            data-cursor-hover
          >
            <MessageCircle size={15} />
            {t("comment")}
          </button>

          <div className="relative flex-1">
            <button
              onClick={handleShare}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium text-muted hover:text-accent hover:bg-white/[0.03] transition-all"
              data-cursor-hover
            >
              <Share2 size={15} />
              {t("shareAction")}
            </button>
            <AnimatePresence>
              {showShareToast && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-medium text-green-400 bg-green-500/10 border border-green-500/20 whitespace-nowrap"
                >
                  <Check size={10} />
                  {t("linkCopied")}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            onClick={onSave}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              post.saved ? "text-gold" : "text-muted hover:text-gold hover:bg-white/[0.03]"
            }`}
            whileTap={{ scale: 0.9 }}
            data-cursor-hover
          >
            <Bookmark size={15} className={post.saved ? "fill-gold" : ""} />
          </motion.button>
        </div>
      </div>

      {/* Preview: last comment teaser */}
      {post.commentList.length > 0 && (
        <button
          onClick={onOpenDetail}
          className="w-full px-6 py-3 border-t border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-colors text-left"
          data-cursor-hover
        >
          {post.commentList.length > 1 && (
            <p className="text-xs text-muted mb-1.5">
              {t("viewAllComments", { count: post.comments })}
            </p>
          )}
          <div className="flex items-start gap-2">
            <span className="text-xs font-semibold flex-shrink-0">
              {post.commentList[post.commentList.length - 1].user}
            </span>
            <span className="text-xs text-white/60 line-clamp-1">
              {post.commentList[post.commentList.length - 1].content}
            </span>
          </div>
        </button>
      )}
    </motion.div>
  );
}

/* ============================================
   MAIN COMMUNITY PAGE
   ============================================ */
export default function CommunityPage() {
  const t = useTranslations("CommunityPage");
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { toggleSave, isSaved } = useSaved();

  // Initialize posts with mock data
  const [posts, setPosts] = useState<Post[]>(() =>
    communityPosts.map((p) => {
      const commentList = generateMockComments(p.id);
      return {
        ...p,
        liked: false,
        saved: false,
        commentList,
        comments: commentList.length,
      };
    }),
  );

  // Sync saved state from context once loaded
  useEffect(() => {
    setPosts((prev) =>
      prev.map((p) => ({ ...p, saved: isSaved(p.id, "post") })),
    );
  }, [isSaved]);

  // Detail modal state
  const [detailPostId, setDetailPostId] = useState<string | null>(null);
  const detailPost = detailPostId ? posts.find((p) => p.id === detailPostId) ?? null : null;

  // Post composer state
  const [composerText, setComposerText] = useState("");
  const [composerImage, setComposerImage] = useState<string | null>(null);
  const [composerEvent, setComposerEvent] = useState<AttachedEvent | null>(null);
  const [showEventPicker, setShowEventPicker] = useState(false);
  const [eventSearch, setEventSearch] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle photo upload
  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setComposerImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }, []);

  // Create new post
  const handleCreatePost = useCallback(async () => {
    if (!composerText.trim() && !composerImage && !composerEvent) return;

    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    setIsPosting(true);
    await new Promise((r) => setTimeout(r, 800));

    const newPost: Post = {
      id: `user-${Date.now()}`,
      user: user?.name || "Kullanıcı",
      avatar: user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      content: composerText,
      likes: 0,
      comments: 0,
      time: t("justNow"),
      image: composerImage || undefined,
      liked: false,
      saved: false,
      commentList: [],
      attachedEvent: composerEvent || undefined,
    };

    setPosts((prev) => [newPost, ...prev]);
    setComposerText("");
    setComposerImage(null);
    setComposerEvent(null);
    setIsPosting(false);
  }, [composerText, composerImage, composerEvent, isAuthenticated, openAuthModal, user, t]);

  // Post actions
  const handleLike = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p,
      ),
    );
  }, []);

  const handleSave = useCallback((postId: string) => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    const newState = toggleSave(postId, "post");
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, saved: newState } : p)),
    );
  }, [isAuthenticated, openAuthModal, toggleSave]);

  const handleAddComment = useCallback(
    (postId: string, text: string) => {
      if (!isAuthenticated) {
        openAuthModal();
        return;
      }

      const newComment: Comment = {
        id: `uc-${Date.now()}`,
        user: user?.name || "Kullanıcı",
        avatar: user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
        content: text,
        time: t("justNow"),
        likes: 0,
        liked: false,
      };

      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, commentList: [...p.commentList, newComment], comments: p.comments + 1 }
            : p,
        ),
      );
    },
    [isAuthenticated, openAuthModal, user, t],
  );

  const handleLikeComment = useCallback((postId: string, commentId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              commentList: p.commentList.map((c) =>
                c.id === commentId
                  ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 }
                  : c,
              ),
            }
          : p,
      ),
    );
  }, []);

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

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <FadeInUp>
              <span className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">
                {t("label")}
              </span>
              <h1 className="display-lg mt-4 mb-6">
                <AnimatedWords text={t("title")} delay={0.2} />
              </h1>
              <p className="text-muted text-sm max-w-md mx-auto">{t("description")}</p>
            </FadeInUp>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main feed */}
            <div className="lg:col-span-2 space-y-6">
              {/* Post composer */}
              <FadeInUp>
                <div className="glass rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      {isAuthenticated && user ? (
                        <Image src={user.avatar} alt={user.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold">
                          ?
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={composerText}
                        onChange={(e) => setComposerText(e.target.value)}
                        onClick={() => !isAuthenticated && openAuthModal()}
                        placeholder={t("composerPlaceholder")}
                        className="w-full bg-transparent text-sm resize-none focus:outline-none placeholder:text-muted min-h-[80px]"
                        rows={3}
                      />

                      {/* Uploaded image preview */}
                      <AnimatePresence>
                        {composerImage && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="relative mb-3"
                          >
                            <div className="relative h-48 rounded-xl overflow-hidden">
                              <Image src={composerImage} alt="Upload" fill className="object-cover" />
                              <div className="absolute inset-0 bg-black/10" />
                            </div>
                            <button
                              onClick={() => setComposerImage(null)}
                              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                              data-cursor-hover
                            >
                              <X size={12} />
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Attached event preview */}
                      <AnimatePresence>
                        {composerEvent && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="relative mb-3"
                          >
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                              <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                                <Image src={composerEvent.image} alt={composerEvent.title} fill className="object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold truncate">{composerEvent.title}</p>
                                <p className="text-[10px] text-muted truncate">{composerEvent.artist}</p>
                                <div className="flex items-center gap-2 mt-1 text-[10px] text-muted">
                                  <span className="flex items-center gap-0.5">
                                    <Calendar size={8} className="text-primary" />
                                    {composerEvent.date}
                                  </span>
                                  <span className="flex items-center gap-0.5">
                                    <MapPin size={8} className="text-primary" />
                                    {composerEvent.city}
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={() => setComposerEvent(null)}
                                className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted hover:text-white transition-colors flex-shrink-0"
                                data-cursor-hover
                              >
                                <X size={10} />
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Event picker dropdown */}
                      <AnimatePresence>
                        {showEventPicker && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-3 overflow-hidden"
                          >
                            <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
                              {/* Search */}
                              <div className="p-3 border-b border-white/5">
                                <div className="flex items-center gap-2 bg-white/[0.03] rounded-lg px-3 py-2">
                                  <Search size={12} className="text-muted flex-shrink-0" />
                                  <input
                                    type="text"
                                    value={eventSearch}
                                    onChange={(e) => setEventSearch(e.target.value)}
                                    placeholder={t("searchEvent")}
                                    className="flex-1 bg-transparent text-xs focus:outline-none placeholder:text-white/20"
                                    autoFocus
                                  />
                                </div>
                              </div>
                              {/* Event list */}
                              <div className="max-h-[200px] overflow-y-auto overscroll-contain">
                                {events
                                  .filter((e) =>
                                    e.title.toLowerCase().includes(eventSearch.toLowerCase()) ||
                                    e.artist.toLowerCase().includes(eventSearch.toLowerCase()),
                                  )
                                  .map((ev) => (
                                    <button
                                      key={ev.id}
                                      onClick={() => {
                                        setComposerEvent({
                                          id: ev.id,
                                          title: ev.title,
                                          artist: ev.artist,
                                          date: ev.date,
                                          time: ev.time,
                                          venue: ev.venue,
                                          city: ev.city,
                                          image: ev.image,
                                          genre: ev.genre,
                                        });
                                        setShowEventPicker(false);
                                        setEventSearch("");
                                      }}
                                      className="w-full flex items-center gap-3 p-3 hover:bg-white/[0.03] transition-colors text-left"
                                      data-cursor-hover
                                    >
                                      <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                                        <Image src={ev.image} alt={ev.title} fill className="object-cover" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold truncate">{ev.title}</p>
                                        <p className="text-[10px] text-muted truncate">{ev.artist} · {ev.date}</p>
                                      </div>
                                      <div className="text-[9px] text-muted bg-white/[0.03] px-2 py-0.5 rounded-full flex-shrink-0">
                                        {ev.genre}
                                      </div>
                                    </button>
                                  ))}
                                {events.filter((e) =>
                                  e.title.toLowerCase().includes(eventSearch.toLowerCase()) ||
                                  e.artist.toLowerCase().includes(eventSearch.toLowerCase()),
                                ).length === 0 && (
                                  <div className="py-6 text-center text-xs text-muted">{t("noEventFound")}</div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex items-center gap-4">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                          <button
                            onClick={() => {
                              if (!isAuthenticated) {
                                openAuthModal();
                                return;
                              }
                              fileInputRef.current?.click();
                            }}
                            className={`flex items-center gap-1.5 text-xs transition-colors ${
                              composerImage ? "text-primary" : "text-muted hover:text-primary"
                            }`}
                            data-cursor-hover
                          >
                            <ImageIcon size={14} />
                            {t("addPhoto")}
                          </button>
                          <button
                            onClick={() => {
                              if (!isAuthenticated) {
                                openAuthModal();
                                return;
                              }
                              setShowEventPicker(!showEventPicker);
                            }}
                            className={`flex items-center gap-1.5 text-xs transition-colors ${
                              composerEvent ? "text-accent" : showEventPicker ? "text-accent" : "text-muted hover:text-accent"
                            }`}
                            data-cursor-hover
                          >
                            <Music size={14} />
                            {t("addEvent")}
                          </button>
                        </div>
                        <motion.button
                          onClick={handleCreatePost}
                          disabled={isPosting || (!composerText.trim() && !composerImage && !composerEvent)}
                          className={`flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-full transition-all ${
                            composerText.trim() || composerImage || composerEvent
                              ? "bg-primary text-white hover:shadow-[0_0_15px_rgba(123,97,255,0.3)]"
                              : "bg-white/[0.05] text-muted cursor-not-allowed"
                          }`}
                          whileTap={composerText.trim() || composerImage || composerEvent ? { scale: 0.95 } : {}}
                          data-cursor-hover
                        >
                          {isPosting ? (
                            <motion.div
                              className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                          ) : (
                            <Send size={12} />
                          )}
                          {t("share")}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeInUp>

              {/* Feed posts */}
              <AnimatePresence>
                {posts.map((post, i) => (
                  <FadeInUp key={post.id} delay={Math.min(i * 0.08, 0.4)}>
                    <PostCard
                      post={post}
                      onLike={() => handleLike(post.id)}
                      onSave={() => handleSave(post.id)}
                      onOpenDetail={() => setDetailPostId(post.id)}
                      t={t}
                    />
                  </FadeInUp>
                ))}
              </AnimatePresence>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Community stats */}
              <ScaleIn>
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                    <Users size={14} className="text-primary" />
                    {t("communityLabel")}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { value: "150K+", label: t("stats.members") },
                      { value: "24K", label: t("stats.online") },
                      { value: "8.5K", label: t("stats.dailyPosts") },
                      { value: "120+", label: t("stats.cities") },
                    ].map((stat, j) => (
                      <div key={j} className="text-center p-3 rounded-xl bg-white/[0.02]">
                        <div className="text-lg font-bold text-gradient-primary">{stat.value}</div>
                        <div className="text-[10px] text-muted uppercase tracking-wider">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScaleIn>

              {/* Trending topics */}
              <ScaleIn delay={0.1}>
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                    <Flame size={14} className="text-gold" />
                    {t("trendingTopics")}
                  </h3>
                  <div className="space-y-3">
                    {trendingTopics.map((topic, j) => (
                      <button
                        key={j}
                        data-cursor-hover
                        className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.03] transition-colors group"
                      >
                        <div className="text-left">
                          <span className="text-sm font-medium group-hover:text-gold transition-colors">
                            {topic.tag}
                          </span>
                          <span className="block text-[10px] text-muted">
                            {topic.posts} {t("posts")}
                          </span>
                        </div>
                        <TrendingUp size={12} className="text-muted group-hover:text-gold transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              </ScaleIn>

              {/* Premium CTA */}
              <ScaleIn delay={0.2}>
                <div className="glass rounded-2xl p-6 text-center border border-dashed border-gold/20">
                  <Sparkles size={24} className="text-gold mx-auto mb-3" />
                  <h4 className="text-sm font-bold mb-2">{t("premiumTitle")}</h4>
                  <p className="text-[11px] text-muted mb-4 leading-relaxed">{t("premiumDescription")}</p>
                  <button
                    data-cursor-hover
                    className="px-5 py-2.5 bg-gold/10 text-gold text-xs font-semibold rounded-full hover:bg-gold/20 transition-all"
                  >
                    {t("premiumButton")}
                  </button>
                </div>
              </ScaleIn>
            </div>
          </div>
        </div>
      </main>

      {/* Post Detail Modal */}
      <AnimatePresence>
        {detailPost && (
          <PostDetailModal
            post={detailPost}
            onClose={() => setDetailPostId(null)}
            onLike={() => handleLike(detailPost.id)}
            onSave={() => handleSave(detailPost.id)}
            onAddComment={(text) => handleAddComment(detailPost.id, text)}
            onLikeComment={(cId) => handleLikeComment(detailPost.id, cId)}
            t={t}
            userAvatar={user?.avatar ?? null}
          />
        )}
      </AnimatePresence>

      <Footer />
      <SaveToast />
    </>
  );
}
