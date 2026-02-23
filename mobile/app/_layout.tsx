import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useRouter, useSegments } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { COLORS } from '../constants/config';

function RootLayoutNav() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile(user?.uid ?? null);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (authLoading || (user && profileLoading)) return;

    const inAuth = segments[0] === '(auth)';
    const inOnboarding = segments[0] === '(onboarding)';
    const inApp = segments[0] === '(app)';

    if (!user) {
      if (!inAuth) router.replace('/(auth)/welcome');
    } else if (!profile?.displayName || !profile?.country || !profile?.gender) {
      if (!inOnboarding) router.replace('/(onboarding)/step1-name');
    } else {
      if (!inApp) router.replace('/(app)/home');
    }
  }, [user, profile, authLoading, profileLoading, segments]);

  if (authLoading || (user && profileLoading)) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={COLORS.primary} size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(app)" />
    </Stack>
  );
}

export default function RootLayout() {
  return <RootLayoutNav />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
