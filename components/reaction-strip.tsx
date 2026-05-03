import React, { useState, useRef, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
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

function ReactionPill({
  config,
  selected,
  onSelect,
}: {
  config: ButtonConfig;
  selected: boolean;
  onSelect: () => void;
}) {
  const colorAnim = useRef(new Animated.Value(selected ? 1 : 0)).current;

  // Move interaction logic into the event handler (rerender-move-effect-to-event)
  const handlePress = useCallback(() => {
    Haptics.selectionAsync();
    onSelect();
    Animated.timing(colorAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [onSelect, colorAnim]);

  const backgroundColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(0,0,0,0)', config.activeColor + '22'],
  });

  const borderColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.muted.light + '60', config.activeColor],
  });

  const textColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.muted.light, config.activeColor],
  });

  return (
    <Animated.View
      style={[
        styles.pill,
        { backgroundColor, borderColor },
        selected && styles.pillSelected,
      ]}
    >
      <Pressable
        onPress={handlePress}
        accessibilityLabel={config.label}
        accessibilityRole="button"
        style={styles.pillPressable}
      >
        <Animated.Text style={[styles.pillText, { color: textColor }]}>
          {config.label}
        </Animated.Text>
      </Pressable>
    </Animated.View>
  );
}

export function ReactionStrip({ itemId: _itemId }: ReactionStripProps) {
  const [selected, setSelected] = useState<ReactionKind | null>(null);
  const confirmedOpacity = useRef(new Animated.Value(0)).current;

  // Stable callbacks per reaction kind — avoids inline arrow on every render
  // (rerender-functional-setstate, rerender-move-effect-to-event)
  const handleSelect = useCallback(
    (kind: ReactionKind) => {
      if (selected !== null) return; // already voted
      setSelected(kind);
      Animated.timing(confirmedOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    },
    [selected, confirmedOpacity]
  );

  const selectedConfig = REACTIONS.find((r) => r.kind === selected);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {REACTIONS.map((r) => (
          <ReactionPill
            key={r.kind}
            config={r}
            selected={selected === r.kind}
            onSelect={() => handleSelect(r.kind)}
          />
        ))}
      </View>
      {selected !== null ? (
        <Animated.View style={[styles.confirmedRow, { opacity: confirmedOpacity }]}>
          <View
            style={[
              styles.confirmedDot,
              { backgroundColor: selectedConfig?.activeColor ?? '#297A5C' },
            ]}
          />
          <Text style={styles.confirmedText}>
            Recorded — your view is shared with council.
          </Text>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  pill: {
    flex: 1,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.muted.light + '60',
    overflow: 'hidden',
  },
  pillSelected: {
    borderWidth: 1.5,
  },
  pillPressable: {
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillText: {
    fontFamily: fonts.sansSemibold,
    fontSize: 12,
    color: colors.muted.light,
    textAlign: 'center',
  },
  confirmedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: spacing.xs,
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
