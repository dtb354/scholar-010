// Fetches a walking route between two coordinates using the public OSRM API.
// Falls back to a straight line between the points when routing fails,
// so the map can always show *some* direction toward the spot.

const OSRM_URL = 'https://router.project-osrm.org/route/v1/foot';

// Straight-line distance in meters between two coords (haversine formula).
function straightDistance(from, to) {
  const R = 6371000; // Earth radius in meters
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(to.latitude - from.latitude);
  const dLon = toRad(to.longitude - from.longitude);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.latitude)) *
      Math.cos(toRad(to.latitude)) *
      Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

const WALKING_SPEED = 1.4; // meters per second (~5 km/h)

//  Returns { coords, distance, duration, isApproximate } where:
//  - coords: array of { latitude, longitude } points forming the route line
//  - distance: meters, duration: seconds
//  - isApproximate: true when OSRM failed and this is a straight line
export async function fetchRoute(from, to) {
  try {
    const url =
      `${OSRM_URL}/${from.longitude},${from.latitude};${to.longitude},${to.latitude}` +
      '?overview=full&geometries=geojson';
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Routing failed (${response.status})`);
    const data = await response.json();
    const route = data.routes?.[0];
    if (!route) throw new Error('No route found');
    return {
      coords: route.geometry.coordinates.map(([longitude, latitude]) => ({
        latitude,
        longitude,
      })),
      distance: route.distance,
      // The public OSRM demo ignores the foot profile and reports car travel
      // times, so derive the walking duration from the distance instead.
      duration: route.distance / WALKING_SPEED,
      isApproximate: false,
    };
  } catch {
    const distance = straightDistance(from, to);
    return {
      coords: [from, to],
      distance,
      duration: distance / WALKING_SPEED,
      isApproximate: true,
    };
  }
}

// "350 m" or "1.2 km"
export function formatDistance(meters) {
  return meters < 1000
    ? `${Math.round(meters)} m`
    : `${(meters / 1000).toFixed(1)} km`;
}

// "5 min" or "1 h 10 min"
export function formatDuration(seconds) {
  const minutes = Math.max(1, Math.round(seconds / 60));
  if (minutes < 60) return `${minutes} min`;
  return `${Math.floor(minutes / 60)} h ${minutes % 60} min`;
}
