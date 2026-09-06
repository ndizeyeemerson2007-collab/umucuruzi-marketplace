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
    const next: UserLocation = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      label: "Your current location",
      source: "gps",
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
        if (typeof saved.latitude === "number" && typeof saved.longitude === "number") {
          setLocation(saved);
          setStatus("granted");
          hasSavedLocation = true;
        }
      }
      if (!hasSavedLocation) {
        requestLocation();
        return;
      }

      // Refresh cached coordinates automatically only when permission was
      // already granted. Otherwise the user can explicitly tap the location
      // control to trigger the browser permission prompt.
      if (navigator.permissions) {
        navigator.permissions
          .query({ name: "geolocation" })
          .then((permission) => {
            if (permission.state === "granted") requestLocation();
          })
          .catch(() => undefined);
      }
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
