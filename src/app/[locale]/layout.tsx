import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Orbitron } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import { SavedProvider } from "@/lib/saved-context";
import { OrganizerProvider } from "@/lib/organizer-context";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PORTAL — Orada Ol",
  description:
    "Etkinlikleri keşfet, sanatçıları takip et, topluluğa katıl. Orada ol.",
  keywords: [
    "etkinlik",
    "deneyim",
    "festival",
    "konser",
    "tiyatro",
    "sanatçı",
    "mekan",
    "istanbul",
  ],
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "tr" | "en" | "zh")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} antialiased bg-background text-foreground`}
      >
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <SavedProvider>
              <OrganizerProvider>
                {children}
              </OrganizerProvider>
            </SavedProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
