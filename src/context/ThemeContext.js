import { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themes } from '../theme/colors';

const STORAGE_KEY = '@studyspots/theme';

const ThemeContext = createContext(undefined);

/**
 * Provides the app-wide layout/theme mode ('light' | 'dark').
 *
 * - Keeps the choice in React state (the Context API).
 * - Drives NativeWind's colorScheme so every `dark:` className reacts.
 * - Persists to AsyncStorage so the setting survives an app restart.
 */
export function ThemeProvider({ children }) {
  const { setColorScheme } = useColorScheme();
  const [theme, setThemeState] = useState('light');
  const [isReady, setIsReady] = useState(false);

  // Load the saved theme once on startup.
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        const initial = saved === 'dark' || saved === 'light' ? saved : 'light';
        setThemeState(initial);
        setColorScheme(initial);
      } catch {
        setColorScheme('light');
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  const applyTheme = async (next) => {
    setThemeState(next);
    setColorScheme(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore write failures; the in-memory value still applies for this session.
    }
  };

  const toggleTheme = () => applyTheme(theme === 'dark' ? 'light' : 'dark');

  const value = {
    theme,
    isDark: theme === 'dark',
    colors: themes[theme],
    setTheme: applyTheme,
    toggleTheme,
    isReady,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (ctx === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
