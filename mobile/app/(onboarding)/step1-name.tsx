import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
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
import { COUNTRIES } from '../../constants/countries';
import type { Gender } from '../../types/user';

export default function Step1NameScreen() {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [countrySearch, setCountrySearch] = useState('');
  const [loading, setLoading] = useState(false);

  const filteredCountries = countrySearch
    ? COUNTRIES.filter((c) =>
        c.name.toLowerCase().includes(countrySearch.toLowerCase()),
      )
    : COUNTRIES.slice(0, 20);

  async function handleNext() {
    if (!name.trim()) { Alert.alert('Please enter your name'); return; }
    if (!selectedCountry) { Alert.alert('Please select your country'); return; }
    if (!gender) { Alert.alert('Please select your gender'); return; }

    setLoading(true);
    try {
      await updateUserProfile(user!.uid, {
        displayName: name.trim(),
        country: selectedCountry,
        gender,
      });
      router.push('/(onboarding)/step2-interests');
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        <Text style={styles.step}>Step 1 of 2</Text>
        <Text style={styles.heading}>Tell us about yourself</Text>
        <Text style={styles.sub}>This is how your penpal will see you</Text>

        {/* Name */}
        <Text style={styles.label}>Your first name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Sofia, James, Yuki..."
          placeholderTextColor={COLORS.textMuted}
          value={name}
          onChangeText={setName}
          maxLength={30}
        />

        {/* Gender */}
        <Text style={styles.label}>I am</Text>
        <View style={styles.genderRow}>
          {(['male', 'female'] as Gender[]).map((g) => (
            <TouchableOpacity
              key={g}
              style={[styles.genderBtn, gender === g && styles.genderBtnSelected]}
              onPress={() => setGender(g)}
              activeOpacity={0.7}
            >
              <Text style={styles.genderEmoji}>{g === 'male' ? '👨' : '👩'}</Text>
              <Text style={[styles.genderText, gender === g && styles.genderTextSelected]}>
                {g === 'male' ? 'Male' : 'Female'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Country */}
        <Text style={styles.label}>Where are you from?</Text>
        {selectedCountry ? (
          <TouchableOpacity
            style={styles.selectedCountry}
            onPress={() => { setSelectedCountry(''); setCountrySearch(''); }}
          >
            <Text style={styles.selectedCountryText}>
              {COUNTRIES.find((c) => c.code === selectedCountry)?.flag}{' '}
              {COUNTRIES.find((c) => c.code === selectedCountry)?.name}
            </Text>
            <Text style={styles.changeText}>Change</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Search country..."
              placeholderTextColor={COLORS.textMuted}
              value={countrySearch}
              onChangeText={setCountrySearch}
            />
            <View style={styles.countryList}>
              {filteredCountries.map((c) => (
                <TouchableOpacity
                  key={c.code}
                  style={styles.countryItem}
                  onPress={() => {
                    setSelectedCountry(c.code);
                    setCountrySearch('');
                  }}
                >
                  <Text style={styles.countryItemText}>
                    {c.flag} {c.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleNext}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.text} />
          ) : (
            <Text style={styles.btnText}>Next →</Text>
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
  sub: { color: COLORS.textMuted, fontSize: 14, marginBottom: 32 },
  label: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '600', marginBottom: 8, marginTop: 20 },
  input: {
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 12,
    padding: 14,
    color: COLORS.text,
    fontSize: 15,
    marginBottom: 4,
  },
  genderRow: { flexDirection: 'row', gap: 12 },
  genderBtn: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    padding: 16,
    alignItems: 'center',
  },
  genderBtnSelected: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '22' },
  genderEmoji: { fontSize: 28, marginBottom: 6 },
  genderText: { color: COLORS.textSecondary, fontSize: 14 },
  genderTextSelected: { color: COLORS.primary, fontWeight: '700' },
  selectedCountry: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedCountryText: { color: COLORS.text, fontSize: 15 },
  changeText: { color: COLORS.primary, fontSize: 13 },
  countryList: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    maxHeight: 220,
    overflow: 'hidden',
  },
  countryItem: {
    padding: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  countryItemText: { color: COLORS.text, fontSize: 14 },
  btn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: COLORS.text, fontSize: 16, fontWeight: '700' },
});
