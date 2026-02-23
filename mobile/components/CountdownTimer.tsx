import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/config';
import { useCountdown } from '../hooks/useCountdown';

export function CountdownTimer() {
  const { days, hours, minutes, seconds } = useCountdown();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Next penpal arrives in</Text>
      <View style={styles.timeRow}>
        <TimeBlock value={days} unit="days" />
        <Colon />
        <TimeBlock value={hours} unit="hrs" />
        <Colon />
        <TimeBlock value={minutes} unit="min" />
        <Colon />
        <TimeBlock value={seconds} unit="sec" />
      </View>
    </View>
  );
}

function TimeBlock({ value, unit }: { value: number; unit: string }) {
  return (
    <View style={styles.block}>
      <Text style={styles.number}>{String(value).padStart(2, '0')}</Text>
      <Text style={styles.unit}>{unit}</Text>
    </View>
  );
}

function Colon() {
  return <Text style={styles.colon}>:</Text>;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  label: {
    color: COLORS.textMuted,
    fontSize: 13,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  block: {
    alignItems: 'center',
    minWidth: 48,
  },
  number: {
    color: COLORS.primary,
    fontSize: 32,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  unit: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  colon: {
    color: COLORS.primary,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
});
