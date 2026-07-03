import './global.css';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { SpotsProvider } from './src/context/SpotsContext';
import { FavoritesProvider } from './src/context/FavoritesContext';
import RootNavigator from './src/navigation/RootNavigator';

// StatusBar needs the theme, so it lives in a child of ThemeProvider.
function ThemedStatusBar() {
  const { isDark } = useTheme();
  return <StatusBar style={isDark ? 'light' : 'dark'} />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <SpotsProvider>
          <FavoritesProvider>
            <ThemedStatusBar />
            <RootNavigator />
          </FavoritesProvider>
        </SpotsProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
