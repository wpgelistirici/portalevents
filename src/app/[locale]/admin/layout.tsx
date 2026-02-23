"use client";

import dynamic from "next/dynamic";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import NoiseOverlay from "@/components/ui/NoiseOverlay";

const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), {
  ssr: false,
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, isLoading, openAuthModal } = useAuth();
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/${locale}`);
      openAuthModal();
    }
  }, [isLoading, isAuthenticated, router, locale, openAuthModal]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-red-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl max-w-md mx-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Yönetim Paneli</h2>
          <p className="text-white/60 mb-6">Bu sayfaya erişmek için admin hesabıyla giriş yapmalısınız.</p>
          <p className="text-xs text-white/40">Demo: admin@pulse.com / admin123</p>
          <button
            onClick={() => {
              router.push(`/${locale}`);
              openAuthModal();
            }}
            className="mt-4 px-6 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-500/80 transition-colors"
          >
            Giriş Yap
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505]">
      <CustomCursor />
      <NoiseOverlay />
      <AdminSidebar />
      <main className="ml-64 min-h-screen">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
