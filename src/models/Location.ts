/**
 * Domain models for the Location module: last-known/live location,
 * the movement timeline, and safe zones (geofencing).
 */

export interface LocationPoint {
  id: string;
  latitude: number;
  longitude: number;
  label?: string;
  recordedAt: string; // ISO timestamp
  accuracyMeters?: number;
  batteryAtCapture?: number;
}

export interface SafeZone {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  alertOnExit: boolean;
  alertOnEntry: boolean;
}

/**
 * Mock movement history for one device, most recent first.
 * Replace with a query against the location history API once available.
 */
export const MOCK_LOCATION_TIMELINE: LocationPoint[] = [
  {
    id: 'loc-1',
    latitude: 23.8103,
    longitude: 90.4125,
    label: 'Home — Dhanmondi',
    recordedAt: new Date().toISOString(),
    accuracyMeters: 8,
    batteryAtCapture: 82,
  },
  {
    id: 'loc-2',
    latitude: 23.7806,
    longitude: 90.4193,
    label: 'Office — Gulshan',
    recordedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    accuracyMeters: 12,
    batteryAtCapture: 91,
  },
  {
    id: 'loc-3',
    latitude: 23.7509,
    longitude: 90.3935,
    label: 'Dhaka University area',
    recordedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    accuracyMeters: 15,
    batteryAtCapture: 97,
  },
];

export const MOCK_SAFE_ZONES: SafeZone[] = [
  {
    id: 'zone-1',
    name: 'Home',
    latitude: 23.8103,
    longitude: 90.4125,
    radiusMeters: 200,
    alertOnExit: true,
    alertOnEntry: false,
  },
  {
    id: 'zone-2',
    name: 'Office',
    latitude: 23.7806,
    longitude: 90.4193,
    radiusMeters: 150,
    alertOnExit: false,
    alertOnEntry: true,
  },
];

/** Haversine distance in meters between two coordinates. */
export const distanceMeters = (
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number },
): number => {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};
