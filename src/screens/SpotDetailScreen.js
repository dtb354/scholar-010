import { useCallback, useState } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import Badge from '../components/Badge';
import Button from '../components/Button';
import FavoriteButton from '../components/FavoriteButton';
import JournalEntryCard from '../components/JournalEntryCard';
import EmptyState from '../components/EmptyState';
import { useFavorites } from '../context/FavoritesContext';
import * as storage from '../storage/storage';

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

  const handleDelete = async (entryId) => {
    const next = await storage.deleteEntry(spot.id, entryId);
    setEntries(next);
  };

  // Simple progress summary derived from local entries.
  const sessions = entries.length;
  const totalMinutes = entries.reduce((sum, e) => sum + (e.duration || 0), 0);
  const avgMood = sessions
    ? (entries.reduce((sum, e) => sum + e.mood, 0) / sessions).toFixed(1)
    : '–';

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
                <FavoriteButton
                  active={isFavorite(spot.id)}
                  onPress={() => toggle(spot.id)}
                  size={26}
                />
              </View>
              <View className="mt-3 flex-row items-center justify-between">
                <Badge kind={spot.kind} />
                <Pressable
                  onPress={() => navigation.navigate('Map', { spotId: spot.id })}
                >
                  <View className="flex-row items-center">
                    <Ionicons name="map-outline" size={15} color="#6366f1" />
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
          <JournalEntryCard entry={item} onDelete={handleDelete} />
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
      <Text className="text-xs text-indigo-100">{label}</Text>
    </View>
  );
}
