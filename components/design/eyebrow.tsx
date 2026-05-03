import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { colors, fonts } from '@/lib/theme';

interface EyebrowProps {
  tone?: 'light' | 'dark';
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Eyebrow({ tone = 'light', children, style }: EyebrowProps) {
  const dotColor = tone === 'dark' ? colors.accent.dark : colors.accent.light;
  const textColor = tone === 'dark' ? colors.muted.dark : colors.muted.light;

  return (
    <View style={[styles.row, style]}>
      <View style={[styles.dot, { backgroundColor: dotColor }]} />
      <Text style={[styles.text, { color: textColor }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  text: {
    fontFamily: fonts.sansBold,
    fontSize: 12,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
});
