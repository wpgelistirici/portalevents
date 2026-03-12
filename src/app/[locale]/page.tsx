"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import SmoothScroll from "@/components/ui/SmoothScroll";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import FeaturedEvents from "@/components/home/FeaturedEvents";

import ArtistShowcase from "@/components/home/ArtistShowcase";
import VenueSpotlight from "@/components/home/VenueSpotlight";
import CommunityPreview from "@/components/home/CommunityPreview";
import OrganizerCTA from "@/components/home/OrganizerCTA";
import MobileApp from "@/components/home/MobileApp";
import Footer from "@/components/layout/Footer";
import IntroVideo from "@/components/ui/IntroVideo";

const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), {
  ssr: false,
});

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false);

  if (!introComplete) {
    return <IntroVideo onComplete={() => setIntroComplete(true)} />;
  }

  return (
    <>
      <SmoothScroll />
      <CustomCursor />
      <NoiseOverlay />
      <Navbar />

      <main>
        {/* Hero Section */}
        <Hero />

        <div className="section-divider" />

        {/* Featured Events */}
        <FeaturedEvents />

        <div className="section-divider" />

        {/* Artist Showcase */}
        <ArtistShowcase />

        <div className="section-divider" />

        {/* Venue Spotlight */}
        <VenueSpotlight />

        <div className="section-divider" />

        {/* Community Preview */}
        <CommunityPreview />

        <div className="section-divider" />

        {/* Mobile App */}
        <MobileApp />

        <div className="section-divider" />

        {/* Organizer CTA */}
        <OrganizerCTA />
      </main>

      <Footer />
    </>
  );
}
