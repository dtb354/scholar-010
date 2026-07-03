import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Heart toggle for favoriting a spot. Reused on SpotCard and the detail screen.
 */
export default function FavoriteButton({ active, onPress, size = 22 }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      className="rounded-full p-1.5 active:opacity-60"
    >
      <Ionicons
        name={active ? 'heart' : 'heart-outline'}
        size={size}
        color={active ? '#ef4444' : '#94a3b8'}
      />
    </Pressable>
  );
}
