import { useMemo } from "react";
import { Restaurant } from "@/types/marketplace";
import { useLocation } from "@/context/location-context";
import { distanceKm } from "@/lib/geo";

/**
 * Given a list of restaurants (with the server-computed distanceKm based on
 * the default Musanze reference point), re-derive each one's distance
 * against the visitor's real GPS location once we have it, and sort
 * nearest-first. Falls back to the original list/order untouched until a
 * real location is available.
 */
export function useNearbyRestaurants(restaurants: Restaurant[]) {
  const { location } = useLocation();
  const isRealLocation = location.source === "gps";

  const restaurantsWithDistance = useMemo(() => {
    if (!isRealLocation) return restaurants;

    return restaurants
      .map((r) => {
        if (r.latitude == null || r.longitude == null) return r;
        return {
          ...r,
          distanceKm: distanceKm(location.latitude, location.longitude, r.latitude, r.longitude),
        };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [restaurants, isRealLocation, location.latitude, location.longitude]);

  return { restaurants: restaurantsWithDistance, isRealLocation };
}
