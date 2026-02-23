import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import { useCurrentMatch } from '../../hooks/useCurrentMatch';
import { useMatchHistory } from '../../hooks/useMatchHistory';
import { MatchCard } from '../../components/MatchCard';
import { CountdownTimer } from '../../components/CountdownTimer';
import { COLORS } from '../../constants/config';
import { COUNTRIES } from '../../constants/countries';

export default function HomeScreen() {
  const { user } = useAuth();
  const { profile } = useProfile(user?.uid ?? null);
  const { match, partner, loading } = useCurrentMatch(
    profile?.currentMatchId ?? null,
    user?.uid ?? null,
  );
  const { history } = useMatchHistory(user?.uid ?? null);

  const isUserA = match?.userA === user?.uid;
  const unreadCount = isUserA
    ? (match?.unreadCountA ?? 0)
    : (match?.unreadCountB ?? 0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>☕ Cup of Tea</Text>
          <Text style={styles.greeting}>
            Hi {profile?.displayName ?? ''} {getFlag(profile?.country ?? '')}
          </Text>
        </View>

        {/* Current match or waiting */}
        {loading ? null : match && partner ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>This week's penpal</Text>
            <MatchCard
              match={match}
              partner={partner}
              unreadCount={unreadCount}
            />
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Waiting for your next penpal</Text>
            <View style={styles.waitingCard}>
              <Text style={styles.waitingEmoji}>🌍</Text>
              <Text style={styles.waitingText}>
                Every Monday, a new friend from somewhere in the world.{'\n'}
                Your next penpal arrives in:
              </Text>
              <CountdownTimer />
            </View>
          </View>
        )}

        {/* Past matches */}
        {history.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Past penpals</Text>
            {history.map((h) => (
              <View key={h.id} style={styles.historyItem}>
                <Text style={styles.historyFlag}>
                  {COUNTRIES.find((c) => c.code === h.partnerCountry)?.flag ?? '🌍'}
                </Text>
                <View>
                  <Text style={styles.historyName}>{h.partnerDisplayName}</Text>
                  <Text style={styles.historyMeta}>
                    {h.messageCount} messages · {new Date(h.weekStart).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            "Travel slowly. Connect deeply." 🏕
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function getFlag(code: string) {
  return COUNTRIES.find((c) => c.code === code)?.flag ?? '';
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingBottom: 40 },
  header: {
    padding: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  logo: { color: COLORS.primary, fontSize: 18, fontWeight: '700' },
  greeting: { color: COLORS.text, fontSize: 26, fontWeight: '800', marginTop: 6 },
  section: { marginTop: 28, paddingHorizontal: 16 },
  sectionLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  waitingCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  waitingEmoji: { fontSize: 48, marginBottom: 12 },
  waitingText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 8,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 14,
  },
  historyFlag: { fontSize: 28 },
  historyName: { color: COLORS.text, fontSize: 15, fontWeight: '600' },
  historyMeta: { color: COLORS.textMuted, fontSize: 12, marginTop: 2 },
  footer: { marginTop: 40, alignItems: 'center', paddingHorizontal: 32 },
  footerText: { color: COLORS.textMuted, fontSize: 13, fontStyle: 'italic', textAlign: 'center' },
});
