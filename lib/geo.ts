// Default "delivering to" reference point used to compute display
// distances until the app has a real customer location (browser geolocation
// or a location picker). Musanze town center, Rwanda.
export const DEFAULT_LOCATION = {
  label: "Musanze, Rwanda",
  latitude: -1.4998,
  longitude: 29.6339,
};

/**
 * Haversine distance between two lat/lng points, in kilometers.
 */
export function distanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}
