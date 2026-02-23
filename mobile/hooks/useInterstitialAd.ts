import { useEffect, useRef } from 'react';
import {
  InterstitialAd,
  AdEventType,
} from 'react-native-google-mobile-ads';
import { ADMOB } from '../constants/admob';

export function useInterstitialAd() {
  const adRef = useRef<InterstitialAd | null>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    const ad = InterstitialAd.createForAdRequest(ADMOB.INTERSTITIAL_ID, {
      requestNonPersonalizedAdsOnly: true,
    });

    const loadListener = ad.addAdEventListener(AdEventType.LOADED, () => {
      loadedRef.current = true;
    });

    const closeListener = ad.addAdEventListener(AdEventType.CLOSED, () => {
      loadedRef.current = false;
      ad.load(); // preload next ad
    });

    ad.load();
    adRef.current = ad;

    return () => {
      loadListener();
      closeListener();
    };
  }, []);

  function showAd() {
    if (adRef.current && loadedRef.current) {
      adRef.current.show();
    }
  }

  return { showAd };
}
