import { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useSpots } from '../context/SpotsContext';
import { useTheme } from '../context/ThemeContext';
import { darkMapStyle } from '../theme/colors';

// Region zoom levels (smaller delta = closer zoom).
const CLOSE_DELTA = { latitudeDelta: 0.01, longitudeDelta: 0.01 };
const AREA_DELTA = { latitudeDelta: 0.15, longitudeDelta: 0.15 };

// Fallback region centered on the spots' area (Rotterdam) before we know more.
const DEFAULT_REGION = {
  latitude: 51.924,
  longitude: 4.53,
  ...AREA_DELTA,
};

export default function MapScreen({ route, navigation }) {
  const { spots } = useSpots();
  const { isDark } = useTheme();
  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);

  const focusSpotId = route.params?.spotId;
  const focusSpot = spots.find((s) => s.id === focusSpotId);

  // Ask for location permission and grab the user's current position.
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      try {
        const loc = await Location.getCurrentPositionAsync({});
        setUserLocation(loc.coords);
      } catch {
        // Location unavailable; map still works without the user dot.
      }
    })();
  }, []);

  // When arriving with a target spot, zoom the camera onto it.
  useEffect(() => {
    if (focusSpot && mapRef.current) {
      mapRef.current.animateToRegion(
        { ...focusSpot.coords, ...CLOSE_DELTA },
        600
      );
    }
  }, [focusSpotId, spots.length]);

  const initialRegion = focusSpot
    ? { ...focusSpot.coords, ...CLOSE_DELTA }
    : DEFAULT_REGION;

  const centerOnUser = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion(
        { ...userLocation, ...CLOSE_DELTA },
        600
      );
    }
  };

  return (
    <View className="flex-1">
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton={false}
        customMapStyle={isDark ? darkMapStyle : []}
      >
        {spots.map((spot) => (
          <Marker
            key={spot.id}
            coordinate={spot.coords}
            title={spot.title}
            pinColor={spot.id === focusSpotId ? '#4f46e5' : '#ef4444'}
          >
            <Callout onPress={() => navigation.navigate('SpotDetail', { spot })}>
              <View style={{ width: 200, padding: 4 }}>
                <Text style={{ fontWeight: '700', fontSize: 14, color: '#0f172a' }}>
                  {spot.title}
                </Text>
                <Text style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                  {spot.description}
                </Text>
                <Text style={{ fontSize: 12, color: '#4f46e5', marginTop: 6, fontWeight: '600' }}>
                  Open journal ›
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Re-center on the user's current location. */}
      {userLocation ? (
        <Pressable
          onPress={centerOnUser}
          className="absolute bottom-6 right-5 h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg dark:bg-slate-800"
          style={{ elevation: 4 }}
        >
          <Ionicons name="locate" size={22} color="#4f46e5" />
        </Pressable>
      ) : null}
    </View>
  );
}
