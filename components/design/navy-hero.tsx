import React from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { navyGradient, radius, shadows } from '@/lib/theme';

interface NavyHeroProps {
  shape?: 'card' | 'bleed';
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function NavyHero({ shape = 'card', children, style }: NavyHeroProps) {
  const isCard = shape === 'card';

  return (
    <LinearGradient
      colors={navyGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.base,
        isCard && styles.card,
        style,
      ]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  base: {
    padding: 24,
  },
  card: {
    borderRadius: radius.hero,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    ...shadows.cardLift,
  },
});
