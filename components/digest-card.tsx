import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Item, RelevanceLine, Action } from '@/lib/types/shared';
import { AccentStripe, Eyebrow, TopicPill } from './design';
import { ReactionStrip } from './reaction-strip';
import { colors, fonts, radius, shadows, spacing } from '@/lib/theme';

interface DigestCardProps {
  item: Item;
  relevance?: RelevanceLine;
  actions?: Action[];
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).toUpperCase();
}

function kindLabel(kind: Item['kind']): string {
  switch (kind) {
    case 'policy_order': return 'Policy Order';
    case 'city_manager_item': return 'City Manager';
    case 'resolution': return 'Resolution';
    case 'ordinance': return 'Ordinance';
    case 'committee_report': return 'Committee Report';
    case 'ballot_question': return 'Ballot Question';
    case 'communication': return 'Communication';
    default: return 'Item';
  }
}

function actionIcon(type: Action['type']): keyof typeof Ionicons.glyphMap {
  switch (type) {
    case 'attend': return 'location-outline';
    case 'vote': return 'checkmark-circle-outline';
    case 'comment': return 'chatbubble-outline';
    case 'contact': return 'mail-outline';
    default: return 'arrow-forward-circle-outline';
  }
}

export function DigestCard({ item, relevance, actions }: DigestCardProps) {
  const primaryTopic = item.topics?.[0];
  const firstAction = actions?.[0];

  const handleSource = () => {
    if (item.sourceUrl) {
      Linking.openURL(item.sourceUrl).catch(() => null);
    }
  };

  const handleAction = () => {
    if (firstAction?.url) {
      Linking.openURL(firstAction.url).catch(() => null);
    }
  };

  return (
    <View style={styles.card}>
      <AccentStripe topic={primaryTopic} tone="light">
        <View style={styles.inner}>
          {/* Eyebrow: kind + date */}
          <Eyebrow tone="light" style={{ marginBottom: spacing.xs }}>
            {kindLabel(item.kind)} · {formatDate(item.date)}
          </Eyebrow>

          {/* Serif headline */}
          <Text style={styles.headline} numberOfLines={3}>
            {item.title}
          </Text>

          {/* Relevance one-liner */}
          {relevance?.oneLiner ? (
            <Text style={styles.relevance}>{relevance.oneLiner}</Text>
          ) : null}

          {/* Summary paragraph */}
          {item.summary ? (
            <Text style={styles.summary}>{item.summary}</Text>
          ) : null}

          {/* First action */}
          {firstAction ? (
            <Pressable
              style={({ pressed }) => [
                styles.actionRow,
                pressed && styles.actionRowPressed,
              ]}
              onPress={handleAction}
              accessibilityRole="link"
              accessibilityLabel={firstAction.label}
            >
              <Ionicons
                name={actionIcon(firstAction.type)}
                size={14}
                color={colors.accent.light}
              />
              <Text style={styles.actionText}>
                {firstAction.label}
                {firstAction.location ? ` — ${firstAction.location}` : ''}
              </Text>
            </Pressable>
          ) : null}

          {/* Topic pills */}
          {item.topics && item.topics.length > 0 ? (
            <View style={styles.pillsRow}>
              {item.topics.map((t) => (
                <TopicPill key={t} topic={t} tone="light" />
              ))}
            </View>
          ) : null}

          {/* Source chip */}
          {item.sourceUrl ? (
            <Pressable
              style={styles.sourceChip}
              onPress={handleSource}
              accessibilityRole="link"
              accessibilityLabel="Open source"
            >
              <Ionicons
                name="link-outline"
                size={12}
                color={colors.muted.light}
              />
              <Text style={styles.sourceText} numberOfLines={1}>
                {item.sourceUrl.replace(/^https?:\/\//, '').split('/')[0]}
              </Text>
            </Pressable>
          ) : null}

          {/* Reaction strip */}
          <ReactionStrip itemId={item.id} />
        </View>
      </AccentStripe>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card.white,
    borderRadius: radius.card,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    paddingVertical: spacing.lg,
    paddingRight: spacing.lg,
    paddingLeft: 0, // AccentStripe handles left spacing
    ...shadows.cardSoft,
    overflow: 'hidden',
  },
  inner: {
    // AccentStripe content area
  },
  headline: {
    fontFamily: fonts.serifBold,
    fontSize: 22,
    lineHeight: 28,
    color: colors.headline.light,
    letterSpacing: -0.3,
    marginBottom: spacing.sm,
  },
  relevance: {
    fontFamily: fonts.serif,
    fontStyle: 'italic',
    fontSize: 16,
    lineHeight: 22,
    color: colors.body.light,
    marginBottom: spacing.sm,
  },
  summary: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted.light,
    marginBottom: spacing.sm,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: spacing.sm,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: colors.accent.light + '10',
    borderRadius: radius.mini,
  },
  actionRowPressed: {
    opacity: 0.7,
  },
  actionText: {
    fontFamily: fonts.sansSemibold,
    fontSize: 13,
    color: colors.accent.light,
    flex: 1,
    lineHeight: 18,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  sourceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    marginBottom: spacing.xs,
  },
  sourceText: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.muted.light,
    textDecorationLine: 'underline',
  },
});
