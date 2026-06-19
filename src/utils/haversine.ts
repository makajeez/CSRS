import { type Coordinates, type Outpost } from "../types";

const EARTH_RADIUS_KM = 6371;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Returns the great-circle distance in km between two coordinates.
 */
export function haversineDistance(a: Coordinates, b: Coordinates): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);

  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);

  const h =
    sinLat * sinLat +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

/**
 * Returns the nearest outpost to a given incident coordinate,
 * along with the calculated distance in km.
 */
export function findNearestOutpost(
  incidentCoords: Coordinates,
  outposts: Outpost[]
): { outpost: Outpost; distanceKm: number } | null {
  if (!outposts.length) return null;

  let nearest: Outpost = outposts[0];
  let minDistance = haversineDistance(incidentCoords, outposts[0].location);

  for (let i = 1; i < outposts.length; i++) {
    const dist = haversineDistance(incidentCoords, outposts[i].location);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = outposts[i];
    }
  }

  return { outpost: nearest, distanceKm: parseFloat(minDistance.toFixed(2)) };
}

/**
 * Returns all outposts sorted by distance from a given coordinate.
 */
export function sortOutpostsByDistance(
  incidentCoords: Coordinates,
  outposts: Outpost[]
): Array<Outpost & { distanceKm: number }> {
  return outposts
    .map((o) => ({
      ...o,
      distanceKm: parseFloat(haversineDistance(incidentCoords, o.location).toFixed(2)),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm);
}
