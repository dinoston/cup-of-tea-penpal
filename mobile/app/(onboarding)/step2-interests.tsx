import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { updateUserProfile } from '../../services/firestore';
import { COLORS } from '../../constants/config';
import { INTERESTS } from '../../constants/interests';
import { InterestChip } from '../../components/InterestChip';

export default function Step2InterestsScreen() {
  const { user } = useAuth();
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : prev.length < 5
        ? [...prev, id]
        : prev,
    );
  }

  async function handleFinish() {
    if (selected.length < 1) {
      Alert.alert('Pick at least 1 interest');
      return;
    }
    setLoading(true);
    try {
      await updateUserProfile(user!.uid, {
        interests: selected,
        isAvailableForMatching: true,
      });
      // Root layout will redirect to (app)/home
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner}>
        <Text style={styles.step}>Step 2 of 2</Text>
        <Text style={styles.heading}>What do you love?</Text>
        <Text style={styles.sub}>
          We'll use this to find you a penpal with something in common.{'\n'}
          Pick up to 5.
        </Text>

        <View style={styles.grid}>
          {INTERESTS.map((interest) => (
            <InterestChip
              key={interest.id}
              label={interest.label}
              selected={selected.includes(interest.id)}
              onPress={() => toggle(interest.id)}
            />
          ))}
        </View>

        <Text style={styles.count}>{selected.length} / 5 selected</Text>

        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleFinish}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.text} />
          ) : (
            <Text style={styles.btnText}>Let's go ☕</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  inner: { padding: 28, paddingBottom: 60 },
  step: { color: COLORS.primary, fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 8 },
  heading: { color: COLORS.text, fontSize: 28, fontWeight: '800', marginBottom: 6 },
  sub: { color: COLORS.textMuted, fontSize: 14, lineHeight: 21, marginBottom: 28 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: -4,
    marginBottom: 16,
  },
  count: {
    color: COLORS.textMuted,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 28,
  },
  btn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: COLORS.text, fontSize: 16, fontWeight: '700' },
});
