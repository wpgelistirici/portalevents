"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { EventAttendee } from "./data";

export interface BuddyProfile {
  id: string;
  name: string;
  avatar: string;
  eventId: string;
  eventTitle: string;
}

export interface BuddyMessage {
  id: string;
  senderId: "me" | string;
  content: string;
  timestamp: string;
}

export interface BuddyMatch {
  id: string;
  profile: BuddyProfile;
  matchedAt: string;
  messages: BuddyMessage[];
  unread: number;
}

interface BuddyContextType {
  likes: string[];
  matches: BuddyMatch[];
  typingMatchIds: Set<string>;
  likeProfile: (
    attendee: EventAttendee,
    eventId: string,
    eventTitle: string
  ) => BuddyMatch | null;
  isLiked: (attendeeId: string, eventId: string) => boolean;
  sendMessage: (matchId: string, content: string) => void;
  markAsRead: (matchId: string) => void;
  totalUnread: number;
}

const BuddyContext = createContext<BuddyContextType | null>(null);

const LIKES_KEY = "portal_buddy_likes";
const MATCHES_KEY = "portal_buddy_matches";

const MOCK_OPENERS: Record<string, string[]> = {
  a1: ["Merhaba! 🎉 Etkinlikte görüşürüz umarım!", "Seninle aynı etkinliğe gidecek olmak harika!"],
  a2: ["Hey! Müzik zevkimiz benzer görünüyor 🎵", "Etkinlikte bir içki içelim mi?"],
  a3: ["Selam! Etkinlik öncesi buluşalım mı? ☕", "Aynı etkinliğe gidiyoruz, harika bir tesadüf!"],
  a4: ["Merhaba! Konser öncesi tanışalım 👋", "Grup olarak gitmek daha eğlenceli olur!"],
  a5: ["Hey! Bu etkinliğe çok heyecanlandım, sen de değil mi? 🔥", "Seninle aynı etkinlikte olacağız, harika!"],
  a6: ["Merhaba! Etkinlikte buluşalım 🎶", "Müzik zevkimiz örtüşüyor gibi!"],
  a7: ["Selam! Bu etkinliği çok bekliyordum 😊", "Etkinlikte grup oluşturalım mı?"],
  a8: ["Hey! Konser öncesi tanışmak ister misin? 🎸", "Aynı etkinliğe gidiyoruz, ne güzel!"],
  a9: ["Merhaba! Müzik tutkunu biriyle tanışmak güzel 🎵", "Görüşürüz! 🙌"],
};

const REPLY_PHRASES = [
  "Harika! 🎉 Görüşürüz orada!",
  "Kesinlikle! Çok heyecanlıyım 🔥",
  "Süper! Etkinlik öncesi bir noktada buluşalım mı?",
  "Mükemmel! Gruba başkalarını da alalım mı?",
  "Evet! Bu etkinliği uzun süredir bekliyordum 🎵",
  "Harika bir fikir! Görüşürüz 🙌",
];

function getMockOpener(attendeeId: string): string {
  const msgs = MOCK_OPENERS[attendeeId];
  if (msgs?.length) return msgs[Math.floor(Math.random() * msgs.length)];
  return "Merhaba! Etkinlikte görüşürüz 🎉";
}

export function BuddyProvider({ children }: { children: ReactNode }) {
  const [likes, setLikes] = useState<string[]>([]);
  const [matches, setMatches] = useState<BuddyMatch[]>([]);
  const [typingMatchIds, setTypingMatchIds] = useState<Set<string>>(new Set());

  // Stable refs so callbacks never need state in their dep arrays
  const likesRef = useRef<string[]>([]);
  const matchesRef = useRef<BuddyMatch[]>([]);

  // Keep refs in sync with state (one-way, no loop risk)
  useEffect(() => { likesRef.current = likes; }, [likes]);
  useEffect(() => { matchesRef.current = matches; }, [matches]);

  // Load from localStorage once on mount
  useEffect(() => {
    try {
      const storedLikes = localStorage.getItem(LIKES_KEY);
      if (storedLikes) {
        const parsed = JSON.parse(storedLikes);
        setLikes(parsed);
        likesRef.current = parsed;
      }
      const storedMatches = localStorage.getItem(MATCHES_KEY);
      if (storedMatches) {
        const parsed = JSON.parse(storedMatches);
        setMatches(parsed);
        matchesRef.current = parsed;
      }
    } catch {}
  }, []);

  // All callbacks have [] deps — fully stable, no re-creation on state change

  const isLiked = useCallback((attendeeId: string, eventId: string) => {
    return likesRef.current.includes(`${attendeeId}_${eventId}`);
  }, []);

  const likeProfile = useCallback(
    (
      attendee: EventAttendee,
      eventId: string,
      eventTitle: string
    ): BuddyMatch | null => {
      const key = `${attendee.id}_${eventId}`;
      if (likesRef.current.includes(key)) return null;

      const newLikes = [...likesRef.current, key];
      likesRef.current = newLikes;
      setLikes(newLikes);
      localStorage.setItem(LIKES_KEY, JSON.stringify(newLikes));

      if (Math.random() >= 0.65) return null;

      const alreadyMatched = matchesRef.current.find(
        (m) => m.profile.id === attendee.id && m.profile.eventId === eventId
      );
      if (alreadyMatched) return null;

      const newMatch: BuddyMatch = {
        id: `match_${attendee.id}_${eventId}_${Date.now()}`,
        profile: {
          id: attendee.id,
          name: attendee.showName
            ? attendee.name
            : attendee.name.split(" ")[0] + " •",
          avatar: attendee.avatar,
          eventId,
          eventTitle,
        },
        matchedAt: new Date().toISOString(),
        messages: [
          {
            id: `msg_${Date.now()}`,
            senderId: attendee.id,
            content: getMockOpener(attendee.id),
            timestamp: new Date().toISOString(),
          },
        ],
        unread: 1,
      };

      const newMatches = [newMatch, ...matchesRef.current];
      matchesRef.current = newMatches;
      setMatches(newMatches);
      localStorage.setItem(MATCHES_KEY, JSON.stringify(newMatches));

      return newMatch;
    },
    [] // stable — reads from refs
  );

  const sendMessage = useCallback((matchId: string, content: string) => {
    // Step 1: add user's message immediately
    setMatches((prev) => {
      const newMsg: BuddyMessage = {
        id: `msg_${Date.now()}`,
        senderId: "me",
        content,
        timestamp: new Date().toISOString(),
      };
      const updated = prev.map((m) =>
        m.id !== matchId ? m : { ...m, messages: [...m.messages, newMsg] }
      );
      localStorage.setItem(MATCHES_KEY, JSON.stringify(updated));
      matchesRef.current = updated;
      return updated;
    });

    // Step 2: show typing indicator
    setTypingMatchIds((prev) => new Set([...prev, matchId]));

    // Step 3: after a realistic delay, add reply and clear typing
    const delay = 1200 + Math.random() * 1000;
    setTimeout(() => {
      const match = matchesRef.current.find((m) => m.id === matchId);
      if (!match) return;

      const reply: BuddyMessage = {
        id: `msg_reply_${Date.now()}`,
        senderId: match.profile.id,
        content: REPLY_PHRASES[Math.floor(Math.random() * REPLY_PHRASES.length)],
        timestamp: new Date().toISOString(),
      };

      setMatches((prev) => {
        const updated = prev.map((m) =>
          m.id !== matchId ? m : { ...m, messages: [...m.messages, reply] }
        );
        localStorage.setItem(MATCHES_KEY, JSON.stringify(updated));
        matchesRef.current = updated;
        return updated;
      });

      setTypingMatchIds((prev) => {
        const next = new Set(prev);
        next.delete(matchId);
        return next;
      });
    }, delay);
  }, []); // stable

  const markAsRead = useCallback((matchId: string) => {
    setMatches((prev) => {
      // Skip update if already all read to avoid unnecessary re-renders
      if (!prev.some((m) => m.id === matchId && m.unread > 0)) return prev;
      const updated = prev.map((m) =>
        m.id === matchId ? { ...m, unread: 0 } : m
      );
      localStorage.setItem(MATCHES_KEY, JSON.stringify(updated));
      matchesRef.current = updated;
      return updated;
    });
  }, []); // stable — uses functional updater

  const totalUnread = matches.reduce((sum, m) => sum + m.unread, 0);

  return (
    <BuddyContext.Provider
      value={{ likes, matches, typingMatchIds, likeProfile, isLiked, sendMessage, markAsRead, totalUnread }}
    >
      {children}
    </BuddyContext.Provider>
  );
}

export function useBuddy() {
  const ctx = useContext(BuddyContext);
  if (!ctx) throw new Error("useBuddy must be used within BuddyProvider");
  return ctx;
}
