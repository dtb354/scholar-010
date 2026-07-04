import { Directory, File, Paths } from 'expo-file-system';

// Journal photos live in a dedicated folder inside the app's document
// directory, so they stay on the device and survive app restarts. Entries
// only store the file *name*; the full path is rebuilt here because the
// app container path can change between installs/updates.

const photosDir = new Directory(Paths.document, 'journal-photos');

function ensureDir() {
  if (!photosDir.exists) photosDir.create();
}

/** Returns a displayable file:// uri for a stored photo name. */
export function photoUri(name) {
  return new File(photosDir, name).uri;
}

/**
 * Copies a picked photo (temporary cache uri from the camera or image
 * library) into permanent app storage.
 * @param {string} tempUri
 * @returns {string} the stored file name
 */
export function savePhoto(tempUri) {
  ensureDir();
  const ext = tempUri.includes('.')
    ? tempUri.slice(tempUri.lastIndexOf('.') + 1).toLowerCase()
    : 'jpg';
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  new File(tempUri).copy(new File(photosDir, name));
  return name;
}

/** Removes a stored photo file. Missing files are ignored. */
export function deletePhoto(name) {
  try {
    const file = new File(photosDir, name);
    if (file.exists) file.delete();
  } catch {
    // Losing an orphaned file is not worth crashing over.
  }
}
