// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add support for more file types if needed
config.resolver.assetExts.push(
  // Add any additional asset extensions here
);

module.exports = config;

