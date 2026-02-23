import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  StatusBar,
  Switch,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import { updateUserProfile } from '../../services/firestore';
import { signOut } from '../../services/auth';
import { COLORS } from '../../constants/config';
import { INTERESTS } from '../../constants/interests';
import { COUNTRIES } from '../../constants/countries';
import { InterestChip } from '../../components/InterestChip';

export default function ProfileScreen() {
  const { user } = useAuth();
  const { profile } = useProfile(user?.uid ?? null);
  const [bio, setBio] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [available, setAvailable] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (profile) {
      setBio(profile.bio ?? '');
      setSelectedInterests(profile.interests ?? []);
      setAvailable(profile.isAvailableForMatching ?? true);
    }
  }, [profile]);

  function toggleInterest(id: string) {
    setDirty(true);
    setSelectedInterests((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : prev.length < 5
        ? [...prev, id]
        : prev,
    );
  }

  async function handleSave() {
    setSaving(true);
    try {
      await updateUserProfile(user!.uid, {
        bio,
        interests: selectedInterests,
        isAvailableForMatching: available,
      });
      setDirty(false);
      Alert.alert('Saved!');
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleSignOut() {
    Alert.alert('Sign out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  }

  const countryName = COUNTRIES.find((c) => c.code === profile?.country)?.name;
  const countryFlag = COUNTRIES.find((c) => c.code === profile?.country)?.flag;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>My Profile 🎒</Text>

        {/* Identity (read-only) */}
        <View style={styles.card}>
          <Text style={styles.bigName}>{profile?.displayName}</Text>
          <Text style={styles.location}>
            {countryFlag} {countryName}
          </Text>
          <Text style={styles.genderTag}>
            {profile?.gender === 'male' ? '👨 Male' : '👩 Female'}
          </Text>
        </View>

        {/* Bio */}
        <View style={styles.section}>
          <Text style={styles.label}>About me</Text>
          <TextInput
            style={styles.bioInput}
            value={bio}
            onChangeText={(v) => { setBio(v); setDirty(true); }}
            placeholder="Write a little something about yourself..."
            placeholderTextColor={COLORS.textMuted}
            multiline
            maxLength={200}
          />
          <Text style={styles.charCount}>{bio.length}/200</Text>
        </View>

        {/* Interests */}
        <View style={styles.section}>
          <Text style={styles.label}>My interests</Text>
          <View style={styles.chips}>
            {INTERESTS.map((interest) => (
              <InterestChip
                key={interest.id}
                label={interest.label}
                selected={selectedInterests.includes(interest.id)}
                onPress={() => toggleInterest(interest.id)}
              />
            ))}
          </View>
        </View>

        {/* Matching toggle */}
        <View style={styles.section}>
          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.label}>Available for matching</Text>
              <Text style={styles.toggleSub}>
                {available ? 'You'll receive a penpal every Monday' : 'Matching is paused'}
              </Text>
            </View>
            <Switch
              value={available}
              onValueChange={(v) => { setAvailable(v); setDirty(true); }}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.text}
            />
          </View>
        </View>

        {/* Save */}
        {dirty && (
          <TouchableOpacity
            style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.8}
          >
            {saving ? (
              <ActivityIndicator color={COLORS.text} />
            ) : (
              <Text style={styles.saveBtnText}>Save changes</Text>
            )}
          </TouchableOpacity>
        )}

        {/* Sign out */}
        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 24, paddingBottom: 60 },
  heading: { color: COLORS.text, fontSize: 26, fontWeight: '800', marginBottom: 20 },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 24,
  },
  bigName: { color: COLORS.text, fontSize: 24, fontWeight: '800' },
  location: { color: COLORS.textSecondary, fontSize: 15, marginTop: 4 },
  genderTag: { color: COLORS.textMuted, fontSize: 13, marginTop: 4 },
  section: { marginBottom: 24 },
  label: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '600', marginBottom: 10 },
  bioInput: {
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 12,
    padding: 14,
    color: COLORS.text,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  charCount: { color: COLORS.textMuted, fontSize: 11, textAlign: 'right', marginTop: 4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', marginLeft: -4 },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  toggleSub: { color: COLORS.textMuted, fontSize: 12, marginTop: 2 },
  saveBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: COLORS.text, fontSize: 16, fontWeight: '700' },
  signOutBtn: {
    borderWidth: 1,
    borderColor: COLORS.danger + '60',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  signOutText: { color: COLORS.danger, fontSize: 15 },
});
