import { Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Reusable themed button. Used on multiple screens (Detail, AddEntry, Settings).
 * @param {'primary'|'secondary'} variant
 */
export default function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled = false,
}) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`flex-row items-center justify-center rounded-xl px-5 py-3.5 active:opacity-80 ${
        disabled ? 'opacity-50 ' : ''
      }${
        isPrimary
          ? 'bg-brand'
          : 'border border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800'
      }`}
    >
      {icon ? (
        <Ionicons
          name={icon}
          size={18}
          color={isPrimary ? '#ffffff' : '#6366f1'}
          style={{ marginRight: 8 }}
        />
      ) : null}
      <Text
        className={`text-base font-semibold ${
          isPrimary ? 'text-white' : 'text-slate-800 dark:text-slate-100'
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
