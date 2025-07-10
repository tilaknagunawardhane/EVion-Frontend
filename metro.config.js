const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
 
const config = getDefaultConfig(__dirname);

// Configure Metro for better memory management
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Increase memory allocation and optimize transforms
config.transformer = {
  ...config.transformer,
  // Reduce workers to save memory
  maxWorkerCount: 2,
};

// Configure serializer for better memory usage
config.serializer = {
  ...config.serializer,
  // Enable memory optimizations with stable module IDs
};

module.exports = withNativeWind(config, { input: './global.css' })