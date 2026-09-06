"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
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

  const requestLocation = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("unsupported");
      return;
    }

    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (position) => {
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
      },
      () => {
        // Permission denied, timed out, or unavailable — quietly keep the
        // default reference point rather than interrupting the browsing flow.
        setStatus("denied");
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 10 * 60 * 1000 }
    );
  }, []);

  // On first load: use a previously saved location if we have one, otherwise
  // try a silent geolocation request automatically.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LOCATION_STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as UserLocation;
        if (typeof saved.latitude === "number" && typeof saved.longitude === "number") {
          setLocation(saved);
          setStatus("granted");
          return;
        }
      }
    } catch {
      // ignore malformed storage and fall through to a fresh request
    }
    requestLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
