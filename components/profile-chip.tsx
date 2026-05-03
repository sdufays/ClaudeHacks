import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Profile } from '@/lib/types/shared';
import { colors, fonts, radius, spacing } from '@/lib/theme';

interface ProfileChipProps {
  profile: Profile;
  onPress?: () => void;
}

function commuteIcon(mode: Profile['commute']): keyof typeof Ionicons.glyphMap {
  switch (mode) {
    case 'bike': return 'bicycle-outline';
    case 'transit': return 'train-outline';
    case 'drive': return 'car-outline';
    case 'walk': return 'walk-outline';
    case 'wfh': return 'home-outline';
    default: return 'person-outline';
  }
}

function housingIcon(status: Profile['housing']): keyof typeof Ionicons.glyphMap {
  switch (status) {
    case 'rent': return 'key-outline';
    case 'own': return 'home-outline';
    default: return 'business-outline';
  }
}

export function ProfileChip({ profile, onPress }: ProfileChipProps) {
  const firstName = profile.name.split(' ')[0];

  return (
    <Pressable
      style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
      onPress={onPress}
      accessibilityLabel={`Profile: ${firstName}`}
      accessibilityRole="button"
    >
      <Ionicons
        name={housingIcon(profile.housing)}
        size={13}
        color={colors.muted.light}
        style={{ marginRight: 2 }}
      />
      <Ionicons
        name={commuteIcon(profile.commute)}
        size={13}
        color={colors.muted.light}
        style={{ marginRight: 4 }}
      />
      <Text style={styles.name}>{firstName}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card.white,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.muted.light + '30',
    gap: 2,
  },
  chipPressed: {
    opacity: 0.75,
  },
  name: {
    fontFamily: fonts.sansSemibold,
    fontSize: 13,
    color: colors.headline.light,
  },
});
