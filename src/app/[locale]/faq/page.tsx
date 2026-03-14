"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import SmoothScroll from "@/components/ui/SmoothScroll";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GradientOrb from "@/components/ui/GradientOrb";
import { FadeInUp } from "@/components/ui/AnimatedText";
import { ChevronDown, HelpCircle, Search } from "lucide-react";

const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), {
  ssr: false,
});

const faqCategories = [
  {
    title: "Genel",
    items: [
      {
        q: "PORTAL nedir?",
        a: "PORTAL, canlı etkinlik ve konser deneyimini dijitalleştiren bir platformdur. Etkinlik keşfi, bilet satın alma, topluluk etkileşimi ve organizatör araçlarını tek bir çatı altında sunar.",
      },
      {
        q: "PORTAL'ı kullanmak ücretsiz mi?",
        a: "Evet, etkinlik keşfi, topluluk özellikleri ve bilet satın alma katılımcılar için tamamen ücretsizdir. Organizatörler için farklı fiyatlandırma planları mevcuttur.",
      },
      {
        q: "Hangi şehirlerde aktifsiniz?",
        a: "Şu anda İstanbul, Ankara, İzmir, Antalya ve Bursa'da aktif olarak hizmet veriyoruz. Yakında daha fazla şehre genişlemeyi planlıyoruz.",
      },
    ],
  },
  {
    title: "Biletler",
    items: [
      {
        q: "Biletimi nasıl kullanırım?",
        a: "Satın aldığınız bilet, 'Biletlerim' sayfasında QR kod olarak görünür. Etkinlik girişinde bu QR kodu göstermeniz yeterlidir. QR kod güvenlik için periyodik olarak güncellenir.",
      },
      {
        q: "Bilet iadesi yapabilir miyim?",
        a: "Etkinlikten 48 saat öncesine kadar bilet iadesi yapabilirsiniz. İade işlemi 'Biletlerim' sayfasından gerçekleştirilebilir. İade, ödeme yönteminize 3-5 iş günü içinde yansır.",
      },
      {
        q: "Biletimi başka birine transfer edebilir miyim?",
        a: "Evet, aktif biletlerinizi 'Biletlerim' sayfasındaki transfer butonu ile başka bir PORTAL kullanıcısına gönderebilirsiniz.",
      },
    ],
  },
  {
    title: "Organizatörler",
    items: [
      {
        q: "Organizatör olmak için ne yapmalıyım?",
        a: "Hesabınızdan organizatör başvurusu yapabilirsiniz. Başvurunuz incelendikten sonra organizatör panelinize erişebilirsiniz. Demo hesapla da paneli deneyebilirsiniz.",
      },
      {
        q: "Etkinlik oluşturmak ücretli mi?",
        a: "Starter planı ile aylık 2 etkinliğe kadar ücretsiz oluşturabilirsiniz. Daha fazlası için Pro veya Enterprise planlarımıza göz atabilirsiniz.",
      },
      {
        q: "Doping sistemi nedir?",
        a: "Doping, etkinliklerinizin platformda daha fazla görünürlük kazanmasını sağlayan bir tanıtım aracıdır. Ana sayfa öne çıkarma, arama sonuçlarında üst sıra ve topluluk önerileri gibi seçenekler mevcuttur.",
      },
    ],
  },
  {
    title: "Hesap & Güvenlik",
    items: [
      {
        q: "Şifremi nasıl sıfırlarım?",
        a: "Giriş ekranında 'Şifremi Unuttum' bağlantısına tıklayarak e-posta adresinize sıfırlama linki gönderebilirsiniz.",
      },
      {
        q: "Hesabımı nasıl silebilirim?",
        a: "Hesap Ayarları sayfasından hesap silme talebinde bulunabilirsiniz. Talebin ardından verileriniz 30 gün içinde kalıcı olarak silinir.",
      },
      {
        q: "Verilerim güvende mi?",
        a: "Evet, tüm verileriniz şifreli olarak saklanır ve KVKK mevzuatına uygun şekilde işlenir. Detaylar için Gizlilik Politikamızı inceleyebilirsiniz.",
      },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div className="glass rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left"
        data-cursor-hover
      >
        <span className="text-sm font-medium pr-4">{q}</span>
        <ChevronDown
          size={16}
          className={`text-muted flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-sm text-muted leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = faqCategories
    .map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          !searchQuery ||
          item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.a.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((cat) => cat.items.length > 0);

  return (
    <>
      <SmoothScroll />
      <CustomCursor />
      <NoiseOverlay />
      <Navbar />

      <main className="min-h-screen pt-32 pb-20">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <GradientOrb color="primary" size={400} top="10%" right="-10%" />
          <GradientOrb
            color="secondary"
            size={300}
            bottom="20%"
            left="-5%"
            delay={3}
          />
        </div>

        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <FadeInUp>
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <HelpCircle size={28} className="text-primary" />
              </div>
              <h1 className="display-lg mb-4">
                Sıkça Sorulan
                <br />
                <span className="text-gradient-primary">Sorular</span>
              </h1>
              <p className="text-muted text-sm max-w-md mx-auto mb-8">
                Aradığınız cevabı bulamadıysanız bize ulaşmaktan çekinmeyin.
              </p>
            </FadeInUp>

            <FadeInUp delay={0.1}>
              <div className="relative max-w-md mx-auto">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                />
                <input
                  type="text"
                  placeholder="Soru ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 glass rounded-xl text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted"
                />
              </div>
            </FadeInUp>
          </div>

          <div className="space-y-10">
            {filteredCategories.map((category, i) => (
              <FadeInUp key={category.title} delay={0.1 + i * 0.05}>
                <h2 className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4">
                  {category.title}
                </h2>
                <div className="space-y-2">
                  {category.items.map((item) => (
                    <FAQItem key={item.q} q={item.q} a={item.a} />
                  ))}
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
