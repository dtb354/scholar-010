import AsyncStorage from '@react-native-async-storage/async-storage';

// Local-only data that is NOT part of the online JSON: favorites + journal
// entries. Persisted on-device via AsyncStorage so it survives app restarts.

const FAVORITES_KEY = '@studyspots/favorites';
const journalKey = (spotId) => `@studyspots/journal:${spotId}`;

/* ------------------------------- Favorites ------------------------------- */

export async function getFavorites() {
  try {
    const raw = await AsyncStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function isFavorite(spotId) {
  const favorites = await getFavorites();
  return favorites.includes(spotId);
}

/** Toggles favorite state and returns the new list of favorite ids. */
export async function toggleFavorite(spotId) {
  const favorites = await getFavorites();
  const next = favorites.includes(spotId)
    ? favorites.filter((id) => id !== spotId)
    : [...favorites, spotId];
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  return next;
}

/* ----------------------------- Journal entries ---------------------------- */

export async function getEntries(spotId) {
  try {
    const raw = await AsyncStorage.getItem(journalKey(spotId));
    const entries = raw ? JSON.parse(raw) : [];
    // Newest first.
    return entries.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch {
    return [];
  }
}

/**
 * Adds a journal entry for a spot.
 * @param {number} spotId
 * @param {{ note: string, mood: number, duration: number }} data
 * @returns the created entry
 */
export async function addEntry(spotId, data) {
  const entries = await getEntries(spotId);
  const entry = {
    id: `${Date.now()}`,
    spotId,
    note: data.note ?? '',
    mood: data.mood ?? 3,
    duration: data.duration ?? 0,
    createdAt: new Date().toISOString(),
  };
  const next = [entry, ...entries];
  await AsyncStorage.setItem(journalKey(spotId), JSON.stringify(next));
  return entry;
}

/**
 * Updates an existing journal entry for a spot.
 * @param {number} spotId
 * @param {string} entryId
 * @param {{ note: string, mood: number, duration: number }} data
 * @returns the new list of entries
 */
export async function updateEntry(spotId, entryId, data) {
  const entries = await getEntries(spotId);
  const next = entries.map((e) =>
    e.id === entryId
      ? {
          ...e,
          note: data.note ?? e.note,
          mood: data.mood ?? e.mood,
          duration: data.duration ?? e.duration,
        }
      : e
  );
  await AsyncStorage.setItem(journalKey(spotId), JSON.stringify(next));
  return next;
}

export async function deleteEntry(spotId, entryId) {
  const entries = await getEntries(spotId);
  const next = entries.filter((e) => e.id !== entryId);
  await AsyncStorage.setItem(journalKey(spotId), JSON.stringify(next));
  return next;
}
