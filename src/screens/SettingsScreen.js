import { View, Text, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import { useTheme } from '../context/ThemeContext';

export default function SettingsScreen() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Screen>
      <Text className="mb-1 mt-4 text-2xl font-extrabold text-slate-900 dark:text-white">
        Settings
      </Text>
      <Text className="mb-6 text-sm text-slate-500 dark:text-slate-400">
        Personalize how the app looks.
      </Text>

      <Text className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Appearance
      </Text>
      <View className="flex-row items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
        <View className="flex-row items-center">
          <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-brand/10 dark:bg-brand/20">
            <Ionicons
              name={isDark ? 'moon' : 'sunny'}
              size={20}
              color="#6366f1"
            />
          </View>
          <View>
            <Text className="text-base font-semibold text-slate-800 dark:text-slate-100">
              Dark mode
            </Text>
            <Text className="text-xs text-slate-500 dark:text-slate-400">
              {isDark ? 'On' : 'Off'} · applied across the app
            </Text>
          </View>
        </View>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: '#cbd5e1', true: '#6366f1' }}
          thumbColor="#ffffff"
        />
      </View>

      <Text className="mt-6 text-center text-xs text-slate-400">
        Your theme choice is saved on this device.
      </Text>
    </Screen>
  );
}
