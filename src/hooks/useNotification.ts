"use client";

import { useState, useCallback, useEffect } from "react";
import type { AppNotification } from "@/components/notifications/types";

const STORAGE_KEY = "spendwise_notifications";
const STORAGE_VERSION = "v2"; // bump this to wipe old mock data from localStorage

function loadFromStorage(): AppNotification[] {
  if (typeof window === "undefined") return [];
  try {
    // If stored version doesn't match, clear old data (wipes mock seed)
    const version = localStorage.getItem(`${STORAGE_KEY}_version`);
    if (version !== STORAGE_VERSION) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(`${STORAGE_KEY}_version`, STORAGE_VERSION);
      return [];
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as AppNotification[];
  } catch {
    return [];
  }
}

function saveToStorage(notifications: AppNotification[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    localStorage.setItem(`${STORAGE_KEY}_version`, STORAGE_VERSION);
  } catch {}
}

export function useNotifications() {
  // Start empty on SSR — hydrate on client in effect to avoid mismatch
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setNotifications(loadFromStorage());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    saveToStorage(notifications);
  }, [notifications, mounted]);

  const unreadCount = mounted ? notifications.filter((n) => !n.read).length : 0;

  const markRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => setNotifications([]), []);

  const push = useCallback(
    (
      n: Omit<AppNotification, "id" | "timestamp" | "read">,
      dedupeKey?: string,
    ) => {
      setNotifications((prev) => {
        if (dedupeKey && prev.some((p) => p.id === dedupeKey)) return prev;
        const next: AppNotification = {
          ...n,
          id: dedupeKey ?? crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          read: false,
        };
        return [next, ...prev];
      });
    },
    [],
  );

  return {
    notifications,
    unreadCount,
    mounted,
    markRead,
    markAllRead,
    dismiss,
    clearAll,
    push,
  };
}
