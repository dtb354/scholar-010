import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Reusable placeholder shown when a list has no items or an error occurs.
 */
export default function EmptyState({ icon = 'file-tray-outline', title, subtitle }) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <Ionicons name={icon} size={48} color="#94a3b8" />
      <Text className="mt-4 text-center text-base font-semibold text-slate-600 dark:text-slate-300">
        {title}
      </Text>
      {subtitle ? (
        <Text className="mt-1 text-center text-sm text-slate-400">{subtitle}</Text>
      ) : null}
    </View>
  );
}
