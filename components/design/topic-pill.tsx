import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import type { IssueTag } from '@/lib/types/shared';
import { TOPIC_COLORS, TOPIC_LABEL } from '@/lib/topics';
import { fonts, radius } from '@/lib/theme';

interface TopicPillProps {
  topic: IssueTag;
  tone?: 'light' | 'dark';
  style?: StyleProp<ViewStyle>;
}

export function TopicPill({ topic, tone = 'light', style }: TopicPillProps) {
  const color = tone === 'dark' ? TOPIC_COLORS[topic].dark : TOPIC_COLORS[topic].light;
  const label = TOPIC_LABEL[topic];

  return (
    <View style={[styles.pill, { backgroundColor: color + '1F' }, style]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});
