// Fetches the study spots ("hotspots") from the online JSON source.

const DATA_URL =
  'https://raw.githubusercontent.com/dtb354/studyspots-data/refs/heads/main/data.json';




export async function fetchSpots() {
  const response = await fetch(DATA_URL);
  if (!response.ok) {
    throw new Error(`Failed to load study spots (${response.status})`);
  }
  const data = await response.json();
  return Array.isArray(data.items) ? data.items : [];
}
