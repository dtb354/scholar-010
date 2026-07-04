import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Badge from './Badge';
import FavoriteButton from './FavoriteButton';

/**
 * List row for a study spot. Reused on the Home list (and any future list such
 * as a favorites-only view). Tapping the card triggers `onPress`; the heart and
 * "details" affordances are separate actions.
 */
export default function SpotCard({ spot, isFavorite, onPress, onToggleFavorite, onOpenDetails }) {
  return (
    <Pressable
      onPress={onPress}
      className="mb-3 flex-row items-center rounded-2xl border border-slate-200 bg-white p-4 active:opacity-90 dark:border-slate-700 dark:bg-slate-800"
    >
      <View className="mr-3 h-11 w-11 items-center justify-center rounded-xl bg-brand/10 dark:bg-brand/20">
        <Ionicons name="location" size={22} color="#00a300" />
      </View>

      <View className="flex-1">
        <Text
          numberOfLines={1}
          className="text-base font-bold text-slate-800 dark:text-slate-100"
        >
          {spot.title}
        </Text>
        <Text
          numberOfLines={1}
          className="mb-2 mt-0.5 text-sm text-slate-500 dark:text-slate-400"
        >
          {spot.description}
        </Text>
        <View className="flex-row items-center justify-between">
          <Badge kind={spot.kind} />
          {onOpenDetails ? (
            <Pressable
              onPress={onOpenDetails}
              hitSlop={8}
              className="flex-row items-center active:opacity-60"
            >
              <Text className="mr-0.5 text-xs font-semibold text-brand dark:text-brand-light">
                Journal
              </Text>
              <Ionicons name="chevron-forward" size={13} color="#00a300" />
            </Pressable>
          ) : null}
        </View>
      </View>

      <FavoriteButton active={isFavorite} onPress={onToggleFavorite} />
    </Pressable>
  );
}
