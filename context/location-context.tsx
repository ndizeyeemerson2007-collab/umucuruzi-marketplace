"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
  useRef,
} from "react";
import { DEFAULT_LOCATION, UserLocation } from "@/lib/geo";

const LOCATION_STORAGE_KEY = "umucuruzi:location";
const LOCATION_CACHE_MAX_AGE_MS = 15 * 60 * 1000;

export type LocationStatus = "idle" | "loading" | "granted" | "denied" | "unsupported";

interface LocationContextValue {
  location: UserLocation;
  status: LocationStatus;
  /** Ask the browser for the user's real position (triggers the permission prompt if needed). */
  requestLocation: () => void;
}

const LocationContext = createContext<LocationContextValue | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<UserLocation>({
    ...DEFAULT_LOCATION,
    source: "default",
  });
  const [status, setStatus] = useState<LocationStatus>("idle");
  const watchIdRef = useRef<number | null>(null);

  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null && typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const applyPosition = useCallback((position: GeolocationPosition) => {
    const { latitude, longitude, accuracy } = position.coords;
    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180 ||
      (Number.isFinite(accuracy) && accuracy > 50_000)
    ) {
      setStatus("denied");
      return;
    }

    const next: UserLocation = {
      latitude,
      longitude,
      label: "Your current location",
      source: "gps",
      updatedAt: Date.now(),
    };
    setLocation(next);
    setStatus("granted");
    try {
      window.localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore write errors
    }
  }, []);

  const requestLocation = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("unsupported");
      return;
    }

    setStatus("loading");
    stopWatching();
    watchIdRef.current = navigator.geolocation.watchPosition(
      applyPosition,
      () => {
        // Permission denied, timed out, or unavailable — keep the last usable
        // location rather than interrupting the browsing flow.
        setStatus("denied");
        stopWatching();
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [applyPosition, stopWatching]);

  // On first load: use a previously saved location if we have one, otherwise
  // try a silent geolocation request automatically.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LOCATION_STORAGE_KEY);
      let hasSavedLocation = false;
      if (raw) {
        const saved = JSON.parse(raw) as UserLocation;
        const isFresh =
          typeof saved.updatedAt === "number" &&
          Date.now() - saved.updatedAt < LOCATION_CACHE_MAX_AGE_MS;
        if (
          saved.source === "gps" &&
          isFresh &&
          typeof saved.latitude === "number" &&
          typeof saved.longitude === "number"
        ) {
          setLocation(saved);
          setStatus("granted");
          hasSavedLocation = true;
        } else {
          window.localStorage.removeItem(LOCATION_STORAGE_KEY);
        }
      }
      if (!hasSavedLocation) {
        requestLocation();
        return;
      }

      // Always refresh a cached position. This prevents a previous browser
      // session or a moved user from being stuck with an old location.
      requestLocation();
    } catch {
      // ignore malformed storage and fall through to a fresh request
      requestLocation();
    }
  }, [requestLocation]);

  useEffect(() => stopWatching, [stopWatching]);

  return (
    <LocationContext.Provider value={{ location, status, requestLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocation must be used within a LocationProvider");
  return ctx;
}
