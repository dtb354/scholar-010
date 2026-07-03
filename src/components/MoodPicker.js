import { View, Text, Pressable } from 'react-native';
import { MOODS } from '../constants/moods';

/**
 * Horizontal 1–5 emoji mood selector used on the Add Entry screen.
 */
export default function MoodPicker({ value, onChange }) {
  return (
    <View className="flex-row justify-between">
      {MOODS.map((mood) => {
        const selected = mood.value === value;
        return (
          <Pressable
            key={mood.value}
            onPress={() => onChange(mood.value)}
            className={`items-center rounded-2xl px-2 py-3 ${
              selected
                ? 'bg-brand/10 dark:bg-brand/20'
                : 'bg-transparent'
            }`}
            style={{ width: '18%' }}
          >
            <Text className={`text-3xl ${selected ? '' : 'opacity-50'}`}>
              {mood.emoji}
            </Text>
            <Text
              className={`mt-1 text-xs ${
                selected
                  ? 'font-semibold text-brand dark:text-brand-light'
                  : 'text-slate-400'
              }`}
            >
              {mood.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
