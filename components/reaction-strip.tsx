import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { ReactionKind } from '@/lib/types/shared';
import { colors, fonts, radius, spacing } from '@/lib/theme';

interface ReactionStripProps {
  itemId: string;
}

type ButtonConfig = {
  kind: ReactionKind;
  label: string;
  activeColor: string;
};

const REACTIONS: ButtonConfig[] = [
  { kind: 'support', label: 'Support', activeColor: '#297A5C' },
  { kind: 'oppose', label: 'Oppose', activeColor: '#9E4729' },
  { kind: 'unsure', label: 'Unsure', activeColor: '#8F6B24' },
  { kind: 'want_more_info', label: 'More info', activeColor: '#3875A6' },
];

export function ReactionStrip({ itemId }: ReactionStripProps) {
  const [selected, setSelected] = useState<ReactionKind | null>(null);

  if (selected !== null) {
    return (
      <View style={styles.confirmedRow}>
        <View style={styles.confirmedDot} />
        <Text style={styles.confirmedText}>
          Recorded — your view is shared with council.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.row}>
      {REACTIONS.map((r) => (
        <Pressable
          key={r.kind}
          style={({ pressed }) => [
            styles.pill,
            pressed && styles.pillPressed,
          ]}
          onPress={() => setSelected(r.kind)}
          accessibilityLabel={r.label}
          accessibilityRole="button"
        >
          <Text style={styles.pillText}>{r.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.xs,
    flexWrap: 'wrap',
    marginTop: spacing.sm,
  },
  pill: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.muted.light + '60',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pillPressed: {
    backgroundColor: colors.accent.light + '18',
  },
  pillText: {
    fontFamily: fonts.sansSemibold,
    fontSize: 12,
    color: colors.muted.light,
  },
  confirmedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: spacing.sm,
  },
  confirmedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#297A5C',
  },
  confirmedText: {
    fontFamily: fonts.sansSemibold,
    fontSize: 13,
    color: colors.muted.light,
  },
});
