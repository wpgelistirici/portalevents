"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

/* ============================================
   TYPES
   ============================================ */
export type UserRole = "user" | "organizer" | "admin";

export interface OrganizerProfile {
  organizerName: string;
  organizerLogo: string;
  organizerDescription: string;
  organizerId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone?: string;
  role: UserRole;
  organizerProfile?: OrganizerProfile;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isOrganizer: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  loginWithSocial: (provider: string) => Promise<{ success: boolean }>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  deleteAccount: () => void;
  showAuthModal: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ============================================
   MOCK USER DATABASE
   ============================================ */
const STORAGE_KEY = "pulse_auth_user";
const USERS_STORAGE_KEY = "pulse_users_db";

const DEFAULT_AVATARS = [
  "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
];

interface StoredUser {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  phone?: string;
  role: UserRole;
  organizerProfile?: OrganizerProfile;
}

// Seed demo users
const DEMO_USERS: StoredUser[] = [
  {
    id: "demo-1",
    name: "Elif Korkmaz",
    email: "elif@demo.com",
    password: "123456",
    avatar: DEFAULT_AVATARS[0],
    phone: "0532 123 45 67",
    role: "user",
  },
  {
    id: "demo-2",
    name: "Cem Arslan",
    email: "cem@demo.com",
    password: "123456",
    avatar: DEFAULT_AVATARS[1],
    phone: "0545 987 65 43",
    role: "user",
  },
  {
    id: "demo-3",
    name: "Demo Kullanıcı",
    email: "demo@pulse.com",
    password: "demo",
    avatar: DEFAULT_AVATARS[2],
    phone: "0555 000 00 00",
    role: "user",
  },
  {
    id: "org-1",
    name: "Pulse Events",
    email: "organizer@pulse.com",
    password: "org123",
    avatar: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=200&h=200&fit=crop",
    phone: "0212 000 00 01",
    role: "organizer",
    organizerProfile: {
      organizerId: "org1",
      organizerName: "Pulse Events",
      organizerLogo: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=200&h=200&fit=crop",
      organizerDescription: "Türkiye'nin önde gelen elektronik müzik organizatörü. 2018'den bu yana 500+ etkinlik düzenledik.",
    },
  },
  {
    id: "admin-1",
    name: "Admin",
    email: "admin@pulse.com",
    password: "admin123",
    avatar: DEFAULT_AVATARS[4],
    phone: "0212 000 00 00",
    role: "admin",
  },
];

function getUsersDB(): StoredUser[] {
  if (typeof window === "undefined") return DEMO_USERS;
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEMO_USERS));
      return DEMO_USERS;
    }
    return JSON.parse(stored);
  } catch {
    return DEMO_USERS;
  }
}

function saveUsersDB(users: StoredUser[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

/* ============================================
   AUTH PROVIDER
   ============================================ */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      }
    } catch {
      // ignore
    }
    // Initialize users DB if needed
    getUsersDB();
    setIsLoading(false);
  }, []);

  // Persist user to localStorage
  const persistUser = useCallback((u: User | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Simulate network delay
  const simulateDelay = () =>
    new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 700));

  const login = useCallback(
    async (
      email: string,
      password: string,
    ): Promise<{ success: boolean; error?: string }> => {
      await simulateDelay();

      const users = getUsersDB();
      const found = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
      );

      if (!found) {
        return { success: false, error: "invalidCredentials" };
      }

      const authUser: User = {
        id: found.id,
        name: found.name,
        email: found.email,
        avatar: found.avatar,
        phone: found.phone,
        role: found.role || "user",
        organizerProfile: found.organizerProfile,
      };

      persistUser(authUser);
      return { success: true };
    },
    [persistUser],
  );

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      role: UserRole = "user",
    ): Promise<{ success: boolean; error?: string }> => {
      await simulateDelay();

      const users = getUsersDB();
      const exists = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase(),
      );

      if (exists) {
        return { success: false, error: "emailExists" };
      }

      const orgProfile: OrganizerProfile | undefined =
        role === "organizer"
          ? {
              organizerId: `org-${Date.now()}`,
              organizerName: name,
              organizerLogo: DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)],
              organizerDescription: "",
            }
          : undefined;

      const newUser: StoredUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        password,
        avatar: DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)],
        role,
        organizerProfile: orgProfile,
      };

      users.push(newUser);
      saveUsersDB(users);

      const authUser: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        role: newUser.role,
        organizerProfile: newUser.organizerProfile,
      };

      persistUser(authUser);
      return { success: true };
    },
    [persistUser],
  );

  const loginWithSocial = useCallback(
    async (provider: string): Promise<{ success: boolean }> => {
      await simulateDelay();

      const socialUser: User = {
        id: `social-${Date.now()}`,
        name: provider === "google" ? "Google Kullanıcı" : provider === "apple" ? "Apple Kullanıcı" : "Spotify Kullanıcı",
        email: `user@${provider}.com`,
        avatar: DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)],
        role: "user",
      };

      persistUser(socialUser);
      return { success: true };
    },
    [persistUser],
  );

  const logout = useCallback(() => {
    persistUser(null);
  }, [persistUser]);

  const updateUser = useCallback(
    (data: Partial<User>) => {
      if (!user) return;
      const updated = { ...user, ...data };
      persistUser(updated);

      // Sync to users DB
      const users = getUsersDB();
      const idx = users.findIndex((u) => u.id === user.id);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...data };
        saveUsersDB(users);
      }
    },
    [user, persistUser],
  );

  const changePassword = useCallback(
    async (
      currentPassword: string,
      newPassword: string,
    ): Promise<{ success: boolean; error?: string }> => {
      if (!user) return { success: false, error: "notAuthenticated" };
      await simulateDelay();

      const users = getUsersDB();
      const idx = users.findIndex((u) => u.id === user.id);

      if (idx === -1) return { success: false, error: "userNotFound" };
      if (users[idx].password !== currentPassword) {
        return { success: false, error: "wrongCurrentPassword" };
      }

      users[idx].password = newPassword;
      saveUsersDB(users);
      return { success: true };
    },
    [user],
  );

  const deleteAccount = useCallback(() => {
    if (!user) return;
    const users = getUsersDB();
    const filtered = users.filter((u) => u.id !== user.id);
    saveUsersDB(filtered);
    persistUser(null);
  }, [user, persistUser]);

  const openAuthModal = useCallback(() => setShowAuthModal(true), []);
  const closeAuthModal = useCallback(() => setShowAuthModal(false), []);

  const isOrganizer = !!user && (user.role === "organizer" || user.role === "admin");
  const isAdmin = !!user && user.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isOrganizer,
        isAdmin,
        isLoading,
        login,
        register,
        loginWithSocial,
        logout,
        updateUser,
        changePassword,
        deleteAccount,
        showAuthModal,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ============================================
   HOOK
   ============================================ */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
