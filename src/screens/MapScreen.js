import { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import MapView, { Marker, Callout, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useSpots } from '../context/SpotsContext';
import { useTheme } from '../context/ThemeContext';
import { darkMapStyle } from '../theme/colors';
import { fetchRoute, formatDistance, formatDuration } from '../api/directions';

// Region zoom levels (smaller delta = closer zoom).
const CLOSE_DELTA = { latitudeDelta: 0.01, longitudeDelta: 0.01 };
const AREA_DELTA = { latitudeDelta: 0.15, longitudeDelta: 0.15 };

// Fallback region centered on the spots' area (Rotterdam) before we know more.
const DEFAULT_REGION = {
  latitude: 51.924,
  longitude: 4.53,
  ...AREA_DELTA,
};

// Padding around the route when fitting the camera to it.
const ROUTE_EDGE_PADDING = { top: 120, right: 60, bottom: 80, left: 60 };

export default function MapScreen({ route: navRoute, navigation }) {
  const { spots } = useSpots();
  const { isDark } = useTheme();
  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedSpotId, setSelectedSpotId] = useState(
    navRoute.params?.spotId ?? null
  );
  const [routeInfo, setRouteInfo] = useState(null); // { coords, distance, duration, isApproximate }
  const [routeLoading, setRouteLoading] = useState(false);

  const selectedSpot = spots.find((s) => s.id === selectedSpotId);

  // Keep the selection in sync when arriving from Home with a new spot.
  useEffect(() => {
    if (navRoute.params?.spotId != null) {
      setSelectedSpotId(navRoute.params.spotId);
    }
  }, [navRoute.params]);

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

  // Fetch a walking route to the selected spot once we know where the user is.
  useEffect(() => {
    if (!selectedSpot || !userLocation) {
      setRouteInfo(null);
      return;
    }
    let cancelled = false;
    setRouteLoading(true);
    fetchRoute(userLocation, selectedSpot.coords).then((result) => {
      if (cancelled) return;
      setRouteInfo(result);
      setRouteLoading(false);
      mapRef.current?.fitToCoordinates(result.coords, {
        edgePadding: ROUTE_EDGE_PADDING,
        animated: true,
      });
    });
    return () => {
      cancelled = true;
    };
  }, [selectedSpotId, spots.length, userLocation]);

  // Without a route to fit, zoom the camera onto the target spot.
  useEffect(() => {
    if (selectedSpot && !userLocation && mapRef.current) {
      mapRef.current.animateToRegion(
        { ...selectedSpot.coords, ...CLOSE_DELTA },
        600
      );
    }
  }, [selectedSpotId, spots.length]);

  const initialRegion = selectedSpot
    ? { ...selectedSpot.coords, ...CLOSE_DELTA }
    : DEFAULT_REGION;

  const centerOnUser = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion(
        { ...userLocation, ...CLOSE_DELTA },
        600
      );
    }
  };

  const clearRoute = () => {
    setSelectedSpotId(null);
    setRouteInfo(null);
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
        {routeInfo ? (
          <Polyline
            coordinates={routeInfo.coords}
            strokeColor="#008100"
            strokeWidth={4}
            lineDashPattern={routeInfo.isApproximate ? [10, 8] : undefined}
          />
        ) : null}

        {spots.map((spot) => (
          <Marker
            key={spot.id}
            coordinate={spot.coords}
            title={spot.title}
            pinColor={spot.id === selectedSpotId ? '#008100' : '#ef4444'}
            onPress={() => setSelectedSpotId(spot.id)}
          >
            <Callout onPress={() => navigation.navigate('SpotDetail', { spot })}>
              <View style={{ width: 200, padding: 4 }}>
                <Text style={{ fontWeight: '700', fontSize: 14, color: '#0f172a' }}>
                  {spot.title}
                </Text>
                <Text style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                  {spot.description}
                </Text>
                <Text style={{ fontSize: 12, color: '#008100', marginTop: 6, fontWeight: '600' }}>
                  Open journal ›
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Route banner: destination, distance and walking time. */}
      {selectedSpot && (routeInfo || routeLoading) ? (
        <View
          className="absolute left-4 right-4 top-4 flex-row items-center rounded-2xl bg-white p-3 shadow-lg dark:bg-slate-800"
          style={{ elevation: 4 }}
        >
          <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-green-50 dark:bg-green-950">
            <Ionicons name="walk" size={20} color="#008100" />
          </View>
          <View className="flex-1">
            <Text
              className="text-sm font-bold text-slate-900 dark:text-white"
              numberOfLines={1}
            >
              {selectedSpot.title}
            </Text>
            {routeLoading ? (
              <View className="mt-0.5 flex-row items-center">
                <ActivityIndicator size="small" color="#00a300" />
                <Text className="ml-2 text-xs text-slate-500 dark:text-slate-400">
                  Finding route…
                </Text>
              </View>
            ) : (
              <Text className="text-xs text-slate-500 dark:text-slate-400">
                {formatDistance(routeInfo.distance)} ·{' '}
                {formatDuration(routeInfo.duration)} walk
                {routeInfo.isApproximate ? ' (straight line)' : ''}
              </Text>
            )}
          </View>
          <Pressable onPress={clearRoute} hitSlop={8} className="active:opacity-60">
            <Ionicons
              name="close-circle"
              size={24}
              color={isDark ? '#64748b' : '#94a3b8'}
            />
          </Pressable>
        </View>
      ) : null}

      {/* Re-center on the user's current location. */}
      {userLocation ? (
        <Pressable
          onPress={centerOnUser}
          className="absolute bottom-6 right-5 h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg dark:bg-slate-800"
          style={{ elevation: 4 }}
        >
          <Ionicons name="locate" size={22} color="#008100" />
        </Pressable>
      ) : null}
    </View>
  );
}
