import { Platform } from 'react-native';

// Test IDs for development, real IDs for production
const IS_DEV = __DEV__;

export const ADMOB = {
  // App ID (set in app.json plugin, but kept here for reference)
  APP_ID: 'ca-app-pub-8217343487388036~8228223505',

  // Banner ad (Home screen bottom)
  BANNER_ID: IS_DEV
    ? 'ca-app-pub-3940256099942544/6300978111' // Google test banner
    : 'ca-app-pub-8217343487388036/4257188907',

  // Interstitial ad (shown when opening chat)
  INTERSTITIAL_ID: IS_DEV
    ? 'ca-app-pub-3940256099942544/1033173712' // Google test interstitial
    : 'ca-app-pub-8217343487388036/7649639007',
};
