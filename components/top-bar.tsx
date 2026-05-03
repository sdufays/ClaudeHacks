import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Profile } from '@/lib/types/shared';
import { ProfileChip } from './profile-chip';
import { colors, fonts, spacing } from '@/lib/theme';

interface TopBarProps {
  profile: Profile;
  onProfilePress?: () => void;
}

export function TopBar({ profile, onProfilePress }: TopBarProps) {
  return (
    <View style={styles.bar}>
      <Text style={styles.wordmark}>Civic Signal</Text>
      <ProfileChip profile={profile} onPress={onProfilePress} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.page,
  },
  wordmark: {
    fontFamily: fonts.serifBold,
    fontSize: 22,
    color: colors.headline.light,
    letterSpacing: -0.3,
  },
});
