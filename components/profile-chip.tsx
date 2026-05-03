import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import type { Profile } from '@/lib/types/shared';
import { colors, fonts, radius } from '@/lib/theme';

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

  const handlePress = () => {
    Haptics.selectionAsync();
    onPress?.();
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
      onPress={handlePress}
      accessibilityLabel={`Profile: ${firstName}`}
      accessibilityRole="button"
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
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
    // Min hit area 44pt per Apple HIG — hitSlop covers the rest
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.muted.light + '30',
    gap: 2,
  },
  chipPressed: {
    opacity: 0.7,
  },
  name: {
    fontFamily: fonts.sansSemibold,
    fontSize: 13,
    color: colors.headline.light,
  },
});
