import { ConfigContext } from 'expo/config';

export default ({ config }) => {
  // Filter out the invalid react-native-maps plugin entry from app.json
  config.plugins = config.plugins.filter(
    (plugin) =>
      !(
        Array.isArray(plugin) &&
        plugin[0] === 'react-native-maps'
      )
  );

  return config;
};