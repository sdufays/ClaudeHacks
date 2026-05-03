import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Eyebrow } from '@/components/design';
import { colors, fonts, spacing, radius, shadows } from '@/lib/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [pending, setPending] = useState<null | 'apple' | 'google' | 'magic'>(null);

  const sendMagicLink = () => {
    if (!email.trim()) return;
    setPending('magic');
    setTimeout(() => {
      setPending(null);
      router.replace('/');
    }, 700);
  };

  const ssoStub = (provider: 'apple' | 'google') => {
    setPending(provider);
    setTimeout(() => {
      setPending(null);
      router.replace('/');
    }, 700);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={[styles.glow, styles.glowTopLeft]} />
      <View style={[styles.glow, styles.glowBottomRight]} />
      <View style={[styles.glow, styles.glowMidRight]} />

      <View style={styles.container}>
        <View style={styles.brand}>
          <Eyebrow style={{ marginBottom: spacing.md }}>
            A briefing from Cambridge, Mass.
          </Eyebrow>

          <Text style={styles.wordmark}>Civic Signal</Text>

          <Text style={styles.tagline}>
            Your city,{'\n'}in plain English.
          </Text>

          <Text style={styles.body}>
            We summarize Cambridge City Council, flag what affects your block,
            and pass your reactions back to council. We never tell you how to
            vote.
          </Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [
              styles.btnPrimary,
              pressed && { opacity: 0.85 },
            ]}
            onPress={() => ssoStub('apple')}
            disabled={pending !== null}
            accessibilityRole="button"
            accessibilityLabel="Continue with Apple"
          >
            {pending === 'apple' ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="logo-apple" size={20} color="#FFFFFF" />
                <Text style={styles.btnPrimaryText}>Continue with Apple</Text>
              </>
            )}
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.btnSecondary,
              pressed && { opacity: 0.85 },
            ]}
            onPress={() => ssoStub('google')}
            disabled={pending !== null}
            accessibilityRole="button"
            accessibilityLabel="Continue with Google"
          >
            {pending === 'google' ? (
              <ActivityIndicator color={colors.headline.light} />
            ) : (
              <>
                <Ionicons name="globe-outline" size={20} color={colors.headline.light} />
                <Text style={styles.btnSecondaryText}>Continue with Google</Text>
              </>
            )}
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR EMAIL ME A LINK</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.emailField}>
            <TextInput
              style={styles.emailInput}
              value={email}
              onChangeText={setEmail}
              placeholder="you@cambridgemail.com"
              placeholderTextColor={colors.muted.light}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="send"
              onSubmitEditing={sendMagicLink}
              editable={pending === null}
            />
            <Pressable
              style={({ pressed }) => [
                styles.emailSend,
                (!email.trim() || pending !== null) && { opacity: 0.4 },
                pressed && { opacity: 0.7 },
              ]}
              onPress={sendMagicLink}
              disabled={!email.trim() || pending !== null}
              accessibilityRole="button"
              accessibilityLabel="Send magic link"
            >
              {pending === 'magic' ? (
                <ActivityIndicator color={colors.accent.light} />
              ) : (
                <Ionicons name="arrow-forward" size={20} color={colors.accent.light} />
              )}
            </Pressable>
          </View>

          <Text style={styles.fineprint}>
            No passwords. We'll email you a one-tap link.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>New to Civic Signal? </Text>
          <Link href="/(auth)/signup" replace asChild>
            <Pressable accessibilityRole="link">
              <Text style={styles.footerLink}>Create an account</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.page,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
  },
  glow: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.55,
  },
  glowTopLeft: {
    width: 320,
    height: 320,
    top: -120,
    left: -100,
    backgroundColor: '#D8E4EC',
  },
  glowBottomRight: {
    width: 280,
    height: 280,
    bottom: 60,
    right: -90,
    backgroundColor: '#E2EAF1',
  },
  glowMidRight: {
    width: 200,
    height: 200,
    top: 220,
    right: -60,
    backgroundColor: '#D8E4EC',
    opacity: 0.4,
  },
  brand: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: spacing.xxl,
  },
  wordmark: {
    fontFamily: fonts.serifBold,
    fontSize: 48,
    lineHeight: 52,
    color: colors.headline.light,
    letterSpacing: -1.2,
    marginBottom: spacing.md,
  },
  tagline: {
    fontFamily: fonts.serif,
    fontSize: 28,
    lineHeight: 34,
    color: colors.headline.light,
    letterSpacing: -0.6,
    marginBottom: spacing.md,
  },
  body: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted.light,
    maxWidth: 360,
  },
  actions: {
    gap: spacing.sm + 2,
    paddingBottom: spacing.lg,
  },
  btnPrimary: {
    height: 54,
    borderRadius: radius.mini,
    backgroundColor: colors.headline.light,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    ...shadows.cardLift,
  },
  btnPrimaryText: {
    fontFamily: fonts.sansBold,
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  btnSecondary: {
    height: 54,
    borderRadius: radius.mini,
    backgroundColor: colors.card.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    ...shadows.cardSoft,
  },
  btnSecondaryText: {
    fontFamily: fonts.sansBold,
    fontSize: 16,
    color: colors.headline.light,
    letterSpacing: 0.2,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 4,
    marginVertical: spacing.sm,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.muted.light + '30',
  },
  dividerText: {
    fontFamily: fonts.sansBold,
    fontSize: 10,
    letterSpacing: 1.4,
    color: colors.muted.light,
  },
  emailField: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    borderRadius: radius.mini,
    backgroundColor: colors.card.white,
    paddingLeft: spacing.md,
    paddingRight: 6,
    ...shadows.cardSoft,
  },
  emailInput: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 16,
    color: colors.headline.light,
  },
  emailSend: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accent.light + '14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fineprint: {
    fontFamily: fonts.sans,
    fontSize: 12,
    textAlign: 'center',
    color: colors.muted.light,
    marginTop: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: spacing.lg,
  },
  footerText: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.muted.light,
  },
  footerLink: {
    fontFamily: fonts.sansBold,
    fontSize: 14,
    color: colors.accent.light,
  },
});
