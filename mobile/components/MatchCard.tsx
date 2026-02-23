import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { COLORS } from '../constants/config';
import { COUNTRIES } from '../constants/countries';
import { INTERESTS } from '../constants/interests';
import { InterestChip } from './InterestChip';
import type { Match } from '../types/match';
import type { UserProfile } from '../types/user';

interface Props {
  match: Match;
  partner: UserProfile;
  unreadCount: number;
}

function getFlag(countryCode: string) {
  return COUNTRIES.find((c) => c.code === countryCode)?.flag ?? '🌍';
}

function daysLeft(expiresAt: number) {
  const diff = expiresAt - Date.now();
  return Math.max(0, Math.ceil(diff / 86400000));
}

export function MatchCard({ match, partner, unreadCount }: Props) {
  const sharedInterestLabels = match.sharedInterests
    .map((id) => INTERESTS.find((i) => i.id === id)?.label ?? id)
    .slice(0, 3);

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.flag}>{getFlag(partner.country)}</Text>
        <View style={styles.headerText}>
          <Text style={styles.name}>{partner.displayName}</Text>
          <Text style={styles.country}>
            {COUNTRIES.find((c) => c.code === partner.country)?.name ?? partner.country}
          </Text>
        </View>
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>

      {/* Shared interests */}
      {sharedInterestLabels.length > 0 && (
        <View style={styles.interests}>
          <Text style={styles.interestsLabel}>You both enjoy</Text>
          <View style={styles.chips}>
            {sharedInterestLabels.map((label) => (
              <InterestChip
                key={label}
                label={label}
                selected={false}
                onPress={() => {}}
                size="sm"
              />
            ))}
          </View>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.expires}>{daysLeft(match.expiresAt)}d left</Text>
        <TouchableOpacity
          style={styles.chatBtn}
          onPress={() => router.push(`/chat/${match.id}`)}
          activeOpacity={0.8}
        >
          <Text style={styles.chatBtnText}>Open Chat ☕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  flag: {
    fontSize: 40,
    marginRight: 14,
  },
  headerText: {
    flex: 1,
  },
  name: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '700',
  },
  country: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  badge: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '700',
  },
  interests: {
    marginBottom: 16,
  },
  interestsLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: -4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  expires: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  chatBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  chatBtnText: {
    color: COLORS.text,
    fontWeight: '700',
    fontSize: 14,
  },
});
