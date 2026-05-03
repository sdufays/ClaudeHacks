import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UIMessage } from 'ai';
import { colors, fonts, radius, spacing, shadows } from '@/lib/theme';

interface ChatPanelProps {
  messages: UIMessage[];
  isLoading?: boolean;
  error?: string | null;
  onClose: () => void;
}

/** Extract plain text from a UIMessage's parts array */
function getMessageText(msg: UIMessage): string {
  if (!msg.parts || msg.parts.length === 0) return '';
  return msg.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('');
}

function parseContent(text: string): Array<{ text: string; citation?: string }> {
  // Split on [1], [2], etc. superscript markers
  const parts = text.split(/(\[\d+\])/g);
  return parts.map((part) => {
    const citMatch = part.match(/^\[(\d+)\]$/);
    if (citMatch) {
      return { text: '', citation: citMatch[1] };
    }
    return { text: part };
  });
}

function AssistantBubble({ content }: { content: string }) {
  const segments = parseContent(content);
  return (
    <View style={styles.assistantBubble}>
      <Text style={styles.assistantText}>
        {segments.map((seg, i) =>
          seg.citation ? (
            <Text key={i} style={styles.citation}>
              [{seg.citation}]
            </Text>
          ) : (
            <Text key={i}>{seg.text}</Text>
          )
        )}
      </Text>
    </View>
  );
}

export function ChatPanel({ messages, isLoading, error, onClose }: ChatPanelProps) {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 80,
      friction: 12,
    }).start();
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  return (
    <Animated.View style={[styles.panel, { transform: [{ translateY }] }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ask about Cambridge</Text>
        <Pressable
          style={styles.closeButton}
          onPress={onClose}
          accessibilityLabel="Close chat"
          accessibilityRole="button"
        >
          <Ionicons name="close" size={20} color={colors.muted.light} />
        </Pressable>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.length === 0 && !isLoading && !error ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>What would you like to know?</Text>
            <Text style={styles.emptyBody}>
              Ask about any item in your digest — "Why is this controversial?", "When is the vote?", or "Who's affected?"
            </Text>
          </View>
        ) : null}

        {messages.map((msg) => {
          const text = getMessageText(msg);
          if (!text) return null;
          return msg.role === 'user' ? (
            <View key={msg.id} style={styles.userRow}>
              <View style={styles.userBubble}>
                <Text style={styles.userText}>{text}</Text>
              </View>
            </View>
          ) : (
            <View key={msg.id} style={styles.assistantRow}>
              <AssistantBubble content={text} />
            </View>
          );
        })}

        {isLoading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color={colors.accent.light} />
            <Text style={styles.loadingText}>Thinking…</Text>
          </View>
        ) : null}

        {error ? (
          <View style={styles.errorRow}>
            <Text style={styles.errorText}>
              Backend wiring in progress — please try again shortly.
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.card.white,
    borderTopLeftRadius: radius.card,
    borderTopRightRadius: radius.card,
    maxHeight: 460,
    minHeight: 220,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.muted.light + '20',
    ...shadows.cardLift,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.muted.light + '15',
  },
  headerTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 18,
    color: colors.headline.light,
  },
  closeButton: {
    padding: 4,
  },
  messages: {
    flex: 1,
  },
  messagesContent: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  emptyTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 18,
    color: colors.headline.light,
    textAlign: 'center',
  },
  emptyBody: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.muted.light,
    textAlign: 'center',
    lineHeight: 20,
  },
  userRow: {
    alignItems: 'flex-end',
  },
  userBubble: {
    backgroundColor: colors.accent.light,
    borderRadius: radius.mini,
    borderBottomRightRadius: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxWidth: '80%',
  },
  userText: {
    fontFamily: fonts.sans,
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 21,
  },
  assistantRow: {
    alignItems: 'flex-start',
  },
  assistantBubble: {
    backgroundColor: colors.page,
    borderRadius: radius.mini,
    borderBottomLeftRadius: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxWidth: '88%',
  },
  assistantText: {
    fontFamily: fonts.serif,
    fontSize: 16,
    color: colors.body.light,
    lineHeight: 24,
  },
  citation: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    color: colors.accent.light,
    lineHeight: 16,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  loadingText: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.muted.light,
  },
  errorRow: {
    backgroundColor: '#FEF2F2',
    borderRadius: radius.mini,
    padding: spacing.md,
  },
  errorText: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: '#9E4729',
    lineHeight: 20,
  },
});
