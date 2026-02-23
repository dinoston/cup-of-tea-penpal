import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/config';

interface Props {
  label: string;
  selected: boolean;
  onPress: () => void;
  size?: 'sm' | 'md';
}

export function InterestChip({ label, selected, onPress, size = 'md' }: Props) {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipSelected, size === 'sm' && styles.chipSm]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.label, selected && styles.labelSelected, size === 'sm' && styles.labelSm]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
    margin: 4,
    backgroundColor: COLORS.card,
  },
  chipSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '22',
  },
  chipSm: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  label: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  labelSelected: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  labelSm: {
    fontSize: 12,
  },
});
