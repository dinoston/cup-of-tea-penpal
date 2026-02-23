import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { COLORS } from '../../constants/config';

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <View style={styles.inner}>
        {/* Logo area */}
        <View style={styles.logoArea}>
          <Text style={styles.teacup}>☕</Text>
          <Text style={styles.title}>Cup of Tea</Text>
          <Text style={styles.subtitle}>Penpal</Text>
          <Text style={styles.tagline}>
            In a fast world, slow down.{'\n'}
            One new friend, every week.
          </Text>
        </View>

        {/* Vibe description */}
        <View style={styles.vibeBox}>
          <Text style={styles.vibeText}>
            Like meeting someone at a guesthouse,{'\n'}
            sharing a meal, and talking through the night.{'\n'}
            No pressure. Just good conversation.
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => router.push('/(auth)/sign-up')}
            activeOpacity={0.8}
          >
            <Text style={styles.btnPrimaryText}>Start your journey</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => router.push('/(auth)/sign-in')}
            activeOpacity={0.8}
          >
            <Text style={styles.btnSecondaryText}>Already have an account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoArea: {
    alignItems: 'center',
  },
  teacup: {
    fontSize: 72,
    marginBottom: 16,
  },
  title: {
    color: COLORS.primary,
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: COLORS.accent,
    fontSize: 22,
    fontWeight: '500',
    letterSpacing: 6,
    marginTop: -4,
    marginBottom: 20,
  },
  tagline: {
    color: COLORS.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  vibeBox: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  vibeText: {
    color: COLORS.textMuted,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttons: {
    gap: 12,
  },
  btnPrimary: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
  },
  btnSecondary: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnSecondaryText: {
    color: COLORS.textSecondary,
    fontSize: 15,
  },
});
