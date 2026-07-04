// Central color palette. Used by NativeWind (via tailwind.config) for className
// styling, and imperatively here for components that don't accept className
// (e.g. MapView customMapStyle, StatusBar, navigation header options).

export const palette = {
  brand: '#008100',
  brandLight: '#00a300',
  brandDark: '#005c00',
};

export const themes = {
  light: {
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#0f172a',
    textMuted: '#64748b',
    border: '#e2e8f0',
    primary: palette.brand,
    card: '#ffffff',
  },
  dark: {
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f1f5f9',
    textMuted: '#94a3b8',
    border: '#334155',
    primary: palette.brandLight,
    card: '#1e293b',
  },
};

// Google Maps style array to darken the map in dark mode.
export const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
];
