import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { navyGradient, radius, shadows, colors } from '@/lib/theme';

interface NavyHeroProps {
  shape?: 'card' | 'bleed';
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Small decorative waveform bars — the Inloopd motif */
function WaveformAccent() {
  // 5 capsule bars of varying heights
  const bars = [14, 22, 18, 28, 20];
  return (
    <View style={waveStyles.row} accessibilityElementsHidden>
      {bars.map((h, i) => (
        <View
          key={i}
          style={[
            waveStyles.bar,
            {
              height: h,
              opacity: 0.18 + i * 0.04,
            },
          ]}
        />
      ))}
    </View>
  );
}

const waveStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 5,
    marginTop: 18,
  },
  bar: {
    width: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
});

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
      <WaveformAccent />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  base: {
    padding: 28,
    paddingBottom: 20,
  },
  card: {
    borderRadius: radius.hero,
    borderWidth: 1,
    borderColor: colors.whiteAlpha(0.08),
    ...shadows.cardLift,
  },
});
