// 1–5 mood scale shared between the mood picker and journal entry display.

export const MOODS = [
  { value: 1, emoji: '😣', label: 'Rough' },
  { value: 2, emoji: '😕', label: 'Meh' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '😄', label: 'Great' },
];

export function moodInfo(value) {
  return MOODS.find((m) => m.value === value) ?? MOODS[2];
}
