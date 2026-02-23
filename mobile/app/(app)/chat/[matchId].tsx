import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useAuth } from '../../../hooks/useAuth';
import { useInterstitialAd } from '../../../hooks/useInterstitialAd';
import { useMessages } from '../../../hooks/useMessages';
import { useCurrentMatch } from '../../../hooks/useCurrentMatch';
import { useProfile } from '../../../hooks/useProfile';
import { sendMessage, markMessagesRead } from '../../../services/firestore';
import { MessageBubble } from '../../../components/MessageBubble';
import { COLORS } from '../../../constants/config';
import { COUNTRIES } from '../../../constants/countries';

export default function ChatScreen() {
  const { matchId } = useLocalSearchParams<{ matchId: string }>();
  const { user } = useAuth();
  const { profile } = useProfile(user?.uid ?? null);
  const { match, partner } = useCurrentMatch(
    profile?.currentMatchId ?? null,
    user?.uid ?? null,
  );
  const { messages, loading } = useMessages(matchId ?? null);
  const { showAd } = useInterstitialAd();
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const flatRef = useRef<FlatList>(null);
  const adShownRef = useRef(false);

  // Show interstitial once when chat opens
  useEffect(() => {
    if (!adShownRef.current) {
      adShownRef.current = true;
      setTimeout(() => showAd(), 1500);
    }
  }, []);

  // Mark messages as read when screen is focused
  useEffect(() => {
    if (match && user && matchId) {
      markMessagesRead(matchId, user.uid, match).catch(() => {});
    }
  }, [match, messages.length]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages.length]);

  async function handleSend() {
    const trimmed = text.trim();
    if (!trimmed || !matchId || !user) return;
    setSending(true);
    setText('');
    try {
      await sendMessage(matchId, user.uid, trimmed);
    } catch {
      setText(trimmed);
    } finally {
      setSending(false);
    }
  }

  const partnerFlag = COUNTRIES.find((c) => c.code === partner?.country)?.flag ?? '🌍';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.partnerName}>
            {partnerFlag} {partner?.displayName ?? '...'}
          </Text>
          {partner?.country && (
            <Text style={styles.partnerCountry}>
              {COUNTRIES.find((c) => c.code === partner.country)?.name}
            </Text>
          )}
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Messages */}
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color={COLORS.primary} />
          </View>
        ) : messages.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>☕</Text>
            <Text style={styles.emptyText}>
              Start the conversation!{'\n'}
              You have one week. Make it count.
            </Text>
          </View>
        ) : (
          <FlatList
            ref={flatRef}
            data={messages}
            keyExtractor={(m) => m.id}
            renderItem={({ item }) => (
              <MessageBubble message={item} isOwn={item.senderId === user?.uid} />
            )}
            contentContainerStyle={styles.messageList}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Input */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Say something nice..."
            placeholderTextColor={COLORS.textMuted}
            multiline
            maxLength={1000}
            returnKeyType="default"
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!text.trim() || sending) && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!text.trim() || sending}
            activeOpacity={0.8}
          >
            {sending ? (
              <ActivityIndicator color={COLORS.text} size="small" />
            ) : (
              <Text style={styles.sendIcon}>➤</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  backBtn: { paddingRight: 12 },
  backText: { color: COLORS.primary, fontSize: 22 },
  headerCenter: { flex: 1 },
  partnerName: { color: COLORS.text, fontSize: 17, fontWeight: '700' },
  partnerCountry: { color: COLORS.textMuted, fontSize: 12, marginTop: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 23,
    fontStyle: 'italic',
  },
  messageList: { paddingVertical: 12 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.surface,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: COLORS.text,
    fontSize: 15,
    maxHeight: 120,
  },
  sendBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 22,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { opacity: 0.4 },
  sendIcon: { color: COLORS.text, fontSize: 16 },
});
