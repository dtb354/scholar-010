import { useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import SpotCard from '../components/SpotCard';
import EmptyState from '../components/EmptyState';
import { useSpots } from '../context/SpotsContext';
import { useFavorites } from '../context/FavoritesContext';

export default function HomeScreen({ navigation }) {
  const { spots, loading, error, reload } = useSpots();
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { isFavorite, toggle } = useFavorites();

  const visibleSpots = showFavoritesOnly
    ? spots.filter((s) => isFavorite(s.id))
    : spots;

  if (loading) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#6366f1" />
          <Text className="mt-3 text-slate-500 dark:text-slate-400">
            Loading study spots…
          </Text>
        </View>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <EmptyState
          icon="cloud-offline-outline"
          title="Couldn't load study spots"
          subtitle={error}
        />
        <View className="pb-6">
          <Pressable
            onPress={reload}
            className="flex-row items-center justify-center rounded-xl bg-brand px-5 py-3.5 active:opacity-80"
          >
            <Ionicons name="refresh" size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text className="text-base font-semibold text-white">Try again</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View className="flex-row items-center justify-between pb-3 pt-2">
        <View>
          <Text className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Study Spots
          </Text>
          <Text className="text-sm text-slate-500 dark:text-slate-400">
            {visibleSpots.length} {visibleSpots.length === 1 ? 'place' : 'places'} to focus
          </Text>
        </View>
        <Pressable
          onPress={() => setShowFavoritesOnly((v) => !v)}
          hitSlop={8}
          className={`flex-row items-center rounded-full border px-3 py-2 active:opacity-70 ${
            showFavoritesOnly
              ? 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950'
              : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'
          }`}
        >
          <Ionicons
            name={showFavoritesOnly ? 'heart' : 'heart-outline'}
            size={16}
            color={showFavoritesOnly ? '#ef4444' : '#94a3b8'}
          />
          <Text className="ml-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
            Favorites
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={visibleSpots}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24, paddingTop: 4 }}
        renderItem={({ item }) => (
          <SpotCard
            spot={item}
            isFavorite={isFavorite(item.id)}
            onPress={() => navigation.navigate('Map', { spotId: item.id })}
            onOpenDetails={() => navigation.navigate('SpotDetail', { spot: item })}
            onToggleFavorite={() => toggle(item.id)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="heart-outline"
            title="No favorites yet"
            subtitle="Tap the heart on a spot to save it here."
          />
        }
      />
    </Screen>
  );
}
