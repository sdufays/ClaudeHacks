import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import type { IssueTag } from '@/lib/types/shared';
import { TOPIC_COLORS } from '@/lib/topics';
import { colors } from '@/lib/theme';

interface AccentStripeProps {
  topic?: IssueTag;
  tone?: 'light' | 'dark';
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function AccentStripe({ topic, tone = 'light', children, style }: AccentStripeProps) {
  let stripeColor: string;
  if (topic) {
    stripeColor = tone === 'dark' ? TOPIC_COLORS[topic].dark : TOPIC_COLORS[topic].light;
  } else {
    stripeColor = tone === 'dark' ? colors.accent.dark : colors.accent.light;
  }

  return (
    <View style={[styles.row, style]}>
      <View style={[styles.stripe, { backgroundColor: stripeColor }]} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  stripe: {
    width: 4,
    borderRadius: 2,
  },
  content: {
    flex: 1,
    marginLeft: 20,
  },
});
