import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Themed page container used on every screen for a consistent background,
 * safe-area handling and padding. Reused across all screens (requirement 1).
 */
export default function Screen({ children, edges = ['top'], padded = true }) {
  return (
    <SafeAreaView edges={edges} className="flex-1 bg-slate-50 dark:bg-slate-900">
      <View className={`flex-1 ${padded ? 'px-4' : ''}`}>{children}</View>
    </SafeAreaView>
  );
}
