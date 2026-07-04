import { View, Text, Pressable, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { moodInfo } from '../constants/moods';
import { photoUri } from '../storage/photos';

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Displays a single journal entry (mood, duration, note, date).
 * Reused wherever entries are listed.
 */
export default function JournalEntryCard({ entry, onShare, onEdit, onDelete }) {
  const mood = moodInfo(entry.mood);

  return (
    <View className="mb-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Text className="text-2xl">{mood.emoji}</Text>
          <View className="ml-2">
            <Text className="font-semibold text-slate-800 dark:text-slate-100">
              {mood.label}
            </Text>
            <Text className="text-xs text-slate-400">
              {formatDate(entry.createdAt)}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center">
          {entry.duration > 0 ? (
            <View className="mr-2 flex-row items-center rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-700">
              <Ionicons name="time-outline" size={13} color="#94a3b8" />
              <Text className="ml-1 text-xs text-slate-500 dark:text-slate-300">
                {entry.duration} min
              </Text>
            </View>
          ) : null}
          {onShare ? (
            <Pressable
              onPress={() => onShare(entry)}
              hitSlop={8}
              className="mr-3"
            >
              <Ionicons name="share-outline" size={16} color="#64748b" />
            </Pressable>
          ) : null}
          {onEdit ? (
            <Pressable
              onPress={() => onEdit(entry)}
              hitSlop={8}
              className="mr-3"
            >
              <Ionicons name="pencil-outline" size={16} color="#64748b" />
            </Pressable>
          ) : null}
          {onDelete ? (
            <Pressable onPress={() => onDelete(entry.id)} hitSlop={8}>
              <Ionicons name="trash-outline" size={16} color="#ef4444" />
            </Pressable>
          ) : null}
        </View>
      </View>

      {entry.note ? (
        <Text className="mt-3 text-sm leading-5 text-slate-600 dark:text-slate-300">
          {entry.note}
        </Text>
      ) : null}

      {/* Photos stored on the device for this entry */}
      {entry.photos?.length ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-3"
        >
          {entry.photos.map((name) => (
            <Image
              key={name}
              source={{ uri: photoUri(name) }}
              className="mr-2 h-28 w-28 rounded-xl"
            />
          ))}
        </ScrollView>
      ) : null}
    </View>
  );
}
