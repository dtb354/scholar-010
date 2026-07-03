// Maps a spot "kind" to a display label and an Ionicons icon name.
// Keeps kind-related presentation in one reusable place.

export const KINDS = {
  house: { label: 'House', icon: 'home' },
  library: { label: 'Library', icon: 'library' },
  campus: { label: 'Campus', icon: 'school' },
};

const FALLBACK = { label: 'Spot', icon: 'location' };

export function kindInfo(kind) {
  return KINDS[kind] ?? FALLBACK;
}
