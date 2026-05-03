import React, { useState } from 'react';
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, fonts, radius, spacing, shadows } from '@/lib/theme';

interface ChatComposerProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatComposer({ onSend, disabled }: ChatComposerProps) {
  const [text, setText] = useState('');

  const canSend = Boolean(text.trim()) && !disabled;

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    Haptics.selectionAsync();
    onSend(trimmed);
    setText('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {/* Soft separator */}
      <View style={styles.separator} />
      <View style={styles.container}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Ask about any item…"
            placeholderTextColor={colors.muted.light + '90'}
            multiline
            numberOfLines={undefined}
            returnKeyType="send"
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
            editable={!disabled}
          />
          <Pressable
            style={({ pressed }) => [
              styles.sendButton,
              !canSend && styles.sendButtonDisabled,
              pressed && canSend && styles.sendButtonPressed,
            ]}
            onPress={handleSend}
            disabled={!canSend}
            accessibilityLabel="Send message"
            accessibilityRole="button"
          >
            <Ionicons
              name="arrow-up"
              size={18}
              color={canSend ? '#FFFFFF' : colors.muted.light + '80'}
            />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: colors.muted.light,
    opacity: 0.15,
  },
  container: {
    backgroundColor: colors.page,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    ...shadows.cardSoft,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    backgroundColor: colors.card.white,
    borderRadius: radius.mini,
    borderWidth: 1,
    borderColor: colors.muted.light + '30',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  input: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.headline.light,
    maxHeight: 100,
    minHeight: 36,
    paddingVertical: 4,
  },
  sendButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.accent.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    // Reduce opacity instead of gray fill — cleaner signal
    backgroundColor: colors.accent.light,
    opacity: 0.4,
  },
  sendButtonPressed: {
    opacity: 0.8,
  },
});
