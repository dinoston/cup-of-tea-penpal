import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/config';
import type { Message } from '../types/message';

interface Props {
  message: Message;
  isOwn: boolean;
}

function formatTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function MessageBubble({ message, isOwn }: Props) {
  return (
    <View style={[styles.row, isOwn ? styles.rowOwn : styles.rowOther]}>
      <View style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}>
        <Text style={[styles.text, isOwn ? styles.textOwn : styles.textOther]}>
          {message.text}
        </Text>
        <View style={styles.meta}>
          <Text style={[styles.time, isOwn ? styles.timeOwn : styles.timeOther]}>
            {formatTime(message.createdAt)}
          </Text>
          {isOwn && (
            <Text style={styles.readMark}>
              {message.readAt ? ' ✓✓' : ' ✓'}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginVertical: 2,
    marginHorizontal: 12,
    flexDirection: 'row',
  },
  rowOwn: {
    justifyContent: 'flex-end',
  },
  rowOther: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  bubbleOwn: {
    backgroundColor: COLORS.bubbleOwn,
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: COLORS.bubbleOther,
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 15,
    lineHeight: 21,
  },
  textOwn: {
    color: COLORS.bubbleOwnText,
  },
  textOther: {
    color: COLORS.bubbleOtherText,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 3,
    alignItems: 'center',
  },
  time: {
    fontSize: 10,
  },
  timeOwn: {
    color: 'rgba(250,240,230,0.6)',
  },
  timeOther: {
    color: COLORS.textMuted,
  },
  readMark: {
    fontSize: 10,
    color: 'rgba(250,240,230,0.6)',
  },
});
