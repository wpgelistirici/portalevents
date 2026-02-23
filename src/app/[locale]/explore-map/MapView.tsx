"use client";

import { useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Event } from "@/lib/data";

/* ============================================
   CUSTOM MARKER ICON
   ============================================ */
function createPulseIcon(isSelected: boolean) {
  const size = isSelected ? 44 : 32;
  return L.divIcon({
    className: "pulse-marker",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `
      <div style="width:${size}px;height:${size}px;position:relative;cursor:pointer;">
        ${
          isSelected
            ? `<div style="
                position:absolute;inset:-8px;border-radius:50%;
                background:rgba(255,45,85,0.12);
                animation:marker-pulse 1.5s ease-out infinite;
              "></div>
              <div style="
                position:absolute;inset:-4px;border-radius:50%;
                background:rgba(255,45,85,0.08);
                animation:marker-pulse 1.5s ease-out infinite 0.3s;
              "></div>`
            : ""
        }
        <div style="
          width:100%;height:100%;border-radius:50%;
          background:${isSelected ? "linear-gradient(135deg,#FF2D55,#FF6B8A)" : "linear-gradient(135deg,#FF2D55,#FF2D55CC)"};
          border:${isSelected ? "3px" : "2px"} solid ${isSelected ? "#fff" : "rgba(255,255,255,0.6)"};
          box-shadow:0 4px 16px rgba(255,45,85,${isSelected ? "0.5" : "0.35"}),0 0 24px rgba(255,45,85,${isSelected ? "0.25" : "0.08"});
          display:flex;align-items:center;justify-content:center;
          transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);
        ">
          <svg width="${isSelected ? 18 : 14}" height="${isSelected ? 18 : 14}" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 18V5l12-2v13"/>
            <circle cx="6" cy="18" r="3"/>
            <circle cx="18" cy="16" r="3"/>
          </svg>
        </div>
      </div>
    `,
  });
}

/* ============================================
   DARK MAP STYLES
   ============================================ */
const darkMapCSS = `
  .leaflet-tile {
    filter: brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7);
  }
  .leaflet-container {
    background: #0a0a0b;
    font-family: inherit;
  }
  .leaflet-control-zoom {
    border: none !important;
    margin-right: 16px !important;
    margin-bottom: 200px !important;
  }
  .leaflet-control-zoom a {
    background: rgba(10, 10, 11, 0.88) !important;
    backdrop-filter: blur(16px) !important;
    color: rgba(255, 255, 255, 0.6) !important;
    border: 1px solid rgba(255, 255, 255, 0.06) !important;
    width: 40px !important;
    height: 40px !important;
    line-height: 40px !important;
    font-size: 18px !important;
    transition: all 0.2s !important;
  }
  .leaflet-control-zoom a:hover {
    background: rgba(10, 10, 11, 0.95) !important;
    color: #FF2D55 !important;
    border-color: rgba(255, 45, 85, 0.2) !important;
  }
  .leaflet-control-zoom-in {
    border-radius: 14px 14px 0 0 !important;
  }
  .leaflet-control-zoom-out {
    border-radius: 0 0 14px 14px !important;
  }
  .leaflet-control-attribution {
    background: rgba(10, 10, 11, 0.6) !important;
    backdrop-filter: blur(8px) !important;
    color: rgba(255, 255, 255, 0.2) !important;
    font-size: 8px !important;
    border-radius: 8px 0 0 0 !important;
    padding: 2px 8px !important;
    border: none !important;
  }
  .leaflet-control-attribution a {
    color: rgba(255, 45, 85, 0.4) !important;
  }
  @keyframes marker-pulse {
    0% { transform: scale(0.85); opacity: 1; }
    100% { transform: scale(2); opacity: 0; }
  }
  .pulse-marker {
    background: transparent !important;
    border: none !important;
  }
  .pulse-tooltip {
    background: rgba(10, 10, 11, 0.92) !important;
    backdrop-filter: blur(16px) !important;
    border: 1px solid rgba(255, 255, 255, 0.06) !important;
    border-radius: 12px !important;
    padding: 10px 14px !important;
    color: #fff !important;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5) !important;
    font-family: inherit !important;
  }
  .pulse-tooltip .leaflet-tooltip-tip {
    display: none;
  }
  .leaflet-tooltip-top::before {
    border-top-color: rgba(10, 10, 11, 0.92) !important;
  }
`;

/* ============================================
   MAP VIEW COMPONENT
   ============================================ */
interface MapViewProps {
  events: Event[];
  center: { lat: number; lng: number };
  selectedEvent: Event | null;
  onSelectEvent: (event: Event) => void;
  onMarkerPosition?: (pos: { x: number; y: number } | null) => void;
}

export default function MapView({
  events,
  center,
  selectedEvent,
  onSelectEvent,
  onMarkerPosition,
}: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const styleRef = useRef<HTMLStyleElement | null>(null);
  const onSelectRef = useRef(onSelectEvent);
  onSelectRef.current = onSelectEvent;
  const onMarkerPosRef = useRef(onMarkerPosition);
  onMarkerPosRef.current = onMarkerPosition;

  // Initialize map once
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Inject dark styles
    const styleEl = document.createElement("style");
    styleEl.id = "pulse-map-styles";
    styleEl.textContent = darkMapCSS;
    document.head.appendChild(styleEl);
    styleRef.current = styleEl;

    const map = L.map(mapContainerRef.current, {
      center: [center.lat, center.lng],
      zoom: 12,
      zoomControl: true,
      attributionControl: true,
      zoomAnimation: true,
      markerZoomAnimation: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
      maxZoom: 19,
    }).addTo(map);

    map.zoomControl.setPosition("bottomright");
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      if (styleRef.current) {
        styleRef.current.remove();
        styleRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update markers when events or selection change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove old markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    // Add new markers
    events.forEach((event) => {
      if (!event.detail?.lat || !event.detail?.lng) return;

      const isSelected = selectedEvent?.id === event.id;
      const icon = createPulseIcon(isSelected);

      const marker = L.marker([event.detail.lat, event.detail.lng], {
        icon,
        zIndexOffset: isSelected ? 1000 : 0,
      })
        .addTo(map)
        .on("click", () => onSelectRef.current(event));

      marker.bindTooltip(
        `<div style="font-weight:700;font-size:12px;margin-bottom:3px;letter-spacing:-0.01em;">${event.title}</div>
         <div style="font-size:10px;color:rgba(255,255,255,0.5);display:flex;align-items:center;gap:6px;">
           <span>${event.artist}</span>
           <span style="color:rgba(255,255,255,0.15);">·</span>
           <span>${event.venue}</span>
         </div>
         <div style="font-size:10px;color:#FF2D55;font-weight:600;margin-top:4px;">${event.price}</div>`,
        {
          direction: "top",
          offset: [0, -(isSelected ? 24 : 18)],
          className: "pulse-tooltip",
          permanent: false,
        },
      );

      markersRef.current.set(event.id, marker);
    });
  }, [events, selectedEvent]);

  // Fly to selected event and report pixel position
  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      onMarkerPosRef.current?.(null);
      return;
    }
    if (!selectedEvent?.detail?.lat || !selectedEvent?.detail?.lng) {
      onMarkerPosRef.current?.(null);
      return;
    }

    const latLng = L.latLng(selectedEvent.detail.lat, selectedEvent.detail.lng);

    const reportPosition = () => {
      const pt = map.latLngToContainerPoint(latLng);
      onMarkerPosRef.current?.({ x: pt.x, y: pt.y });
    };

    map.flyTo(latLng, 15, { duration: 0.8 });
    // Report after flyTo animation
    map.once("moveend", reportPosition);

    // Also update on zoom/move so the panel follows
    const onMove = () => {
      if (selectedEvent) reportPosition();
    };
    map.on("move", onMove);

    return () => {
      map.off("move", onMove);
      map.off("moveend", reportPosition);
    };
  }, [selectedEvent]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full"
    />
  );
}
