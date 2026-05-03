import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, UIMessage } from 'ai';

import { TopBar } from '@/components/top-bar';
import { NavyHero, Eyebrow } from '@/components/design';
import { DigestCard } from '@/components/digest-card';
import { ChatComposer } from '@/components/chat-composer';
import { ChatPanel } from '@/components/chat-panel';

import {
  DEMO_PROFILE,
  MOCK_ITEMS,
  MOCK_RELEVANCE,
  MOCK_ACTIONS,
} from '@/lib/mock';
import { colors, fonts, spacing, radius } from '@/lib/theme';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [chatOpen, setChatOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // AI SDK v6 useChat — gracefully handles no-backend case
  const transport = useMemo(() => new DefaultChatTransport({ api: '/api/chat' }), []);
  const { messages, sendMessage, status, error } = useChat({ transport });

  const isLoading = status === 'submitted' || status === 'streaming';

  const handleSend = useCallback(
    (text: string) => {
      setChatOpen(true);
      sendMessage({ text }).catch(() => {
        // Backend not yet wired — ChatPanel shows inline error
      });
    },
    [sendMessage]
  );

  // Memoize derived data — mock data is stable but pattern matters for real data
  // (js-index-maps: build Map once; rerender-derived-state-no-effect)
  const relevanceMap = useMemo(
    () => Object.fromEntries(MOCK_RELEVANCE.map((r) => [r.itemId, r])),
    []
  );

  const sortedItems = useMemo(
    () =>
      [...MOCK_ITEMS].sort((a, b) => {
        const scoreA = relevanceMap[a.id]?.score ?? 0;
        const scoreB = relevanceMap[b.id]?.score ?? 0;
        return scoreB - scoreA;
      }),
    [relevanceMap]
  );

  const highRelevanceCount = useMemo(
    () => MOCK_RELEVANCE.filter((r) => r.score >= 0.8).length,
    []
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Sticky top bar */}
      <TopBar
        profile={DEMO_PROFILE}
        onProfilePress={() => setProfileModalOpen(true)}
      />

      {/* Main scroll */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + spacing.xxl },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero */}
        <View style={styles.heroWrapper}>
          <NavyHero shape="card">
            <Eyebrow tone="dark" style={{ marginBottom: spacing.md }}>
              Tonight's Briefing · Cambridge
            </Eyebrow>
            <Text style={styles.heroHeadline}>
              This week in Cambridge
            </Text>
            <Text style={styles.heroSub}>
              {MOCK_ITEMS.length} items tracked —{' '}
              {highRelevanceCount > 0
                ? `${highRelevanceCount} affect${highRelevanceCount === 1 ? 's' : ''} you directly`
                : 'all tracked for you'}
            </Text>
            <Text style={styles.heroBody}>
              Budget hearings begin Tuesday. Your voice is welcome at City Hall.
            </Text>
          </NavyHero>
        </View>

        {/* Digest list */}
        {sortedItems.map((item) => (
          <DigestCard
            key={item.id}
            item={item}
            relevance={relevanceMap[item.id]}
            actions={MOCK_ACTIONS[item.id]}
          />
        ))}
      </ScrollView>

      {/* Chat panel (inline, slides up above composer) */}
      {chatOpen ? (
        <ChatPanel
          messages={messages as UIMessage[]}
          isLoading={isLoading}
          error={error ? String(error) : null}
          onClose={() => setChatOpen(false)}
        />
      ) : null}

      {/* Chat composer — fixed at bottom */}
      <View style={{ paddingBottom: insets.bottom }}>
        <ChatComposer onSend={handleSend} disabled={isLoading} />
      </View>

      {/* Profile modal */}
      <Modal
        visible={profileModalOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setProfileModalOpen(false)}
      >
        <View style={[styles.modalRoot, { paddingTop: insets.top }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Your Profile</Text>
            <Pressable
              style={styles.modalClose}
              onPress={() => setProfileModalOpen(false)}
              accessibilityLabel="Close profile"
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Text style={styles.modalCloseText}>Done</Text>
            </Pressable>
          </View>
          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={[
              styles.modalBody,
              { paddingBottom: insets.bottom + spacing.xl },
            ]}
          >
            <ProfileRow label="Name" value={DEMO_PROFILE.name} />
            <ProfileRow label="Address" value={DEMO_PROFILE.address} />
            <ProfileRow
              label="Neighborhood"
              value={DEMO_PROFILE.neighborhood ?? '—'}
            />
            <ProfileRow
              label="Housing"
              value={DEMO_PROFILE.housing === 'rent' ? 'Renter' : 'Owner'}
            />
            <ProfileRow
              label="Commute"
              value={
                DEMO_PROFILE.commute.charAt(0).toUpperCase() +
                DEMO_PROFILE.commute.slice(1)
              }
            />
            <View style={styles.modalNote}>
              <Text style={styles.modalNoteText}>
                Profile fields are used only to surface items relevant to you.
                They are never shared with council in any form that identifies you.
              </Text>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.profileRow}>
      <Text style={styles.profileLabel}>{label}</Text>
      <Text style={styles.profileValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.page,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing.sm,
  },
  heroWrapper: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  heroHeadline: {
    fontFamily: fonts.serifBold,
    fontSize: 34,
    lineHeight: 40,
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: spacing.xs,
  },
  heroSub: {
    fontFamily: fonts.sansBold,
    fontSize: 13,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.65)',
    marginBottom: spacing.md,
  },
  heroBody: {
    fontFamily: fonts.sans,
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 22,
  },
  // Profile modal
  modalRoot: {
    flex: 1,
    backgroundColor: colors.page,
  },
  modalScroll: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.muted.light + '20',
  },
  modalTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 22,
    color: colors.headline.light,
  },
  modalClose: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    minHeight: 44,
    justifyContent: 'center',
  },
  modalCloseText: {
    fontFamily: fonts.sansSemibold,
    fontSize: 16,
    color: colors.accent.light,
  },
  modalBody: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.muted.light + '15',
  },
  profileLabel: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.muted.light,
  },
  profileValue: {
    fontFamily: fonts.serif,
    fontSize: 16,
    color: colors.body.light,
  },
  modalNote: {
    marginTop: spacing.md,
    backgroundColor: colors.card.white,
    borderRadius: radius.mini,
    padding: spacing.md,
  },
  modalNoteText: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted.light,
    lineHeight: 19,
  },
});
