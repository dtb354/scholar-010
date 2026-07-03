import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import SpotDetailScreen from '../screens/SpotDetailScreen';
import AddEntryScreen from '../screens/AddEntryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { useTheme } from '../context/ThemeContext';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { isDark, colors } = useTheme();

  // Feed the theme colors into React Navigation so headers/backgrounds match.
  const navTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme : DefaultTheme).colors,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      primary: colors.primary,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTitleStyle: { color: colors.text, fontWeight: '700' },
          headerTintColor: colors.primary,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
            title: 'Scholar',
            headerRight: () => (
              <Pressable
                onPress={() => navigation.navigate('Settings')}
                hitSlop={10}
              >
                <Ionicons name="settings-outline" size={22} color={colors.primary} />
              </Pressable>
            ),
          })}
        />
        <Stack.Screen name="Map" component={MapScreen} options={{ title: 'Map' }} />
        <Stack.Screen
          name="SpotDetail"
          component={SpotDetailScreen}
          options={{ title: 'Study Spot' }}
        />
        <Stack.Screen
          name="AddEntry"
          component={AddEntryScreen}
          options={{ title: 'New Entry', presentation: 'modal' }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: 'Settings' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
