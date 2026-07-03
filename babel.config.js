module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }]],
    // NOTE: do NOT add manual @babel/plugin-transform-class-properties /
    // private-methods plugins here. babel-preset-expo (pinned to the SDK 54
    // version) already down-levels `#private` fields for Hermes, and extra
    // class-field transforms double-define properties on RN core's Event
    // class, causing "property is not configurable" render errors.
    plugins: [
      // react-native-worklets (used by react-native-reanimated, a required peer
      // of nativewind) must be the LAST Babel plugin.
      'react-native-worklets/plugin',
    ],
  };
};
