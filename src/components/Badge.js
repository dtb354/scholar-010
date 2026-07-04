import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { kindInfo } from '../constants/kinds';

/**
 * Small pill showing a spot's kind (house / library / campus).
 * Reused on SpotCard and the detail screen.
 */
export default function Badge({ kind }) {
  const { label, icon } = kindInfo(kind);
  return (
    <View className="flex-row items-center self-start rounded-full bg-brand/10 px-2.5 py-1 dark:bg-brand/20">
      <Ionicons name={icon} size={12} color="#00a300" style={{ marginRight: 4 }} />
      <Text className="text-xs font-semibold text-brand dark:text-brand-light">
        {label}
      </Text>
    </View>
  );
}
