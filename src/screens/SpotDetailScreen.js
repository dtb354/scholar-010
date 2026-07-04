import { useCallback, useState } from 'react';
import { View, Text, FlatList, Pressable, Alert, Share } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import Badge from '../components/Badge';
import Button from '../components/Button';
import FavoriteButton from '../components/FavoriteButton';
import JournalEntryCard from '../components/JournalEntryCard';
import EmptyState from '../components/EmptyState';
import { useFavorites } from '../context/FavoritesContext';
import { moodInfo } from '../constants/moods';
import * as storage from '../storage/storage';

function formatShareDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function SpotDetailScreen({ route, navigation }) {
  const { spot } = route.params;
  const { isFavorite, toggle } = useFavorites();
  const [entries, setEntries] = useState([]);

  // Reload entries every time the screen regains focus (e.g. after adding one).
  useFocusEffect(
    useCallback(() => {
      storage.getEntries(spot.id).then(setEntries);
    }, [spot.id])
  );

  const handleEdit = (entry) => {
    navigation.navigate('AddEntry', { spot, entry });
  };

  const handleDelete = (entryId) => {
    Alert.alert('Delete entry', 'This journal entry will be removed.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const next = await storage.deleteEntry(spot.id, entryId);
          setEntries(next);
        },
      },
    ]);
  };

  // Simple progress summary derived from local entries.
  const sessions = entries.length;
  const totalMinutes = entries.reduce((sum, e) => sum + (e.duration || 0), 0);
  const avgMood = sessions
    ? (entries.reduce((sum, e) => sum + e.mood, 0) / sessions).toFixed(1)
    : '–';

  // Shares a single study session together with the hotspot info.
  const handleShareEntry = async (entry) => {
    const mood = moodInfo(entry.mood);
    const lines = [
      `📚 Study session at ${spot.title}`,
      `${mood.emoji} Felt ${mood.label.toLowerCase()} · ${entry.duration} min · ${formatShareDate(entry.createdAt)}`,
      entry.note ? `"${entry.note}"` : null,
      spot.coords
        ? `📍 https://maps.google.com/?q=${spot.coords.latitude},${spot.coords.longitude}`
        : null,
    ];
    await Share.share({
      title: `Study session at ${spot.title}`,
      message: lines.filter((l) => l !== null).join('\n'),
    });
  };

  // Shares the hotspot info together with the locally stored journal data.
  const handleShare = async () => {
    const lines = [
      `📚 ${spot.title}`,
      spot.description,
      spot.coords
        ? `📍 https://maps.google.com/?q=${spot.coords.latitude},${spot.coords.longitude}`
        : null,
      '',
      `My progress here: ${sessions} session${sessions === 1 ? '' : 's'}, ${totalMinutes} min total, avg mood ${avgMood}`,
    ];
    if (sessions > 0) {
      lines.push('', 'Journal:');
      for (const e of entries) {
        const mood = moodInfo(e.mood);
        lines.push(
          `${mood.emoji} ${mood.label} · ${e.duration} min · ${formatShareDate(e.createdAt)}` +
            (e.note ? `\n"${e.note}"` : '')
        );
      }
    }
    await Share.share({
      title: spot.title,
      message: lines.filter((l) => l !== null).join('\n'),
    });
  };

  return (
    <Screen>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24, paddingTop: 8 }}
        ListHeaderComponent={
          <View className="mb-2">
            {/* Spot header */}
            <View className="mb-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-2">
                  <Text className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {spot.title}
                  </Text>
                  <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {spot.description}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Pressable onPress={handleShare} hitSlop={8} className="mr-3">
                    <Ionicons name="share-outline" size={24} color="#64748b" />
                  </Pressable>
                  <FavoriteButton
                    active={isFavorite(spot.id)}
                    onPress={() => toggle(spot.id)}
                    size={26}
                  />
                </View>
              </View>
              <View className="mt-3 flex-row items-center justify-between">
                <Badge kind={spot.kind} />
                <Pressable
                  onPress={() => navigation.navigate('Map', { spotId: spot.id })}
                >
                  <View className="flex-row items-center">
                    <Ionicons name="map-outline" size={15} color="#00a300" />
                    <Text className="ml-1 text-xs font-semibold text-brand dark:text-brand-light">
                      View on map
                    </Text>
                  </View>
                </Pressable>
              </View>
            </View>

            {/* Progress summary */}
            <View className="mb-4 flex-row justify-between rounded-2xl bg-brand p-4">
              <Stat label="Sessions" value={String(sessions)} />
              <Stat label="Total min" value={String(totalMinutes)} />
              <Stat label="Avg mood" value={avgMood} />
            </View>

            <View className="mb-3">
              <Button
                label="Add journal entry"
                icon="add"
                onPress={() => navigation.navigate('AddEntry', { spot })}
              />
            </View>

            <Text className="mb-1 mt-2 text-base font-bold text-slate-800 dark:text-slate-100">
              Journal
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <JournalEntryCard
            entry={item}
            onShare={handleShareEntry}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="book-outline"
            title="No entries yet"
            subtitle="Log how a study session felt to track your progress over time."
          />
        }
      />
    </Screen>
  );
}

function Stat({ label, value }) {
  return (
    <View className="items-center">
      <Text className="text-2xl font-extrabold text-white">{value}</Text>
      <Text className="text-xs text-green-100">{label}</Text>
    </View>
  );
}
