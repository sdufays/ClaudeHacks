import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  SafeAreaView,
  Modal,
  Pressable,
} from 'react-native';
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

  const relevanceMap = Object.fromEntries(
    MOCK_RELEVANCE.map((r) => [r.itemId, r])
  );

  // Sort items by relevance score descending
  const sortedItems = [...MOCK_ITEMS].sort((a, b) => {
    const scoreA = relevanceMap[a.id]?.score ?? 0;
    const scoreB = relevanceMap[b.id]?.score ?? 0;
    return scoreB - scoreA;
  });

  const highRelevanceCount = MOCK_RELEVANCE.filter((r) => r.score >= 0.8).length;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Sticky top bar */}
      <TopBar
        profile={DEMO_PROFILE}
        onProfilePress={() => setProfileModalOpen(true)}
      />

      {/* Main scroll */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
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
              This week in Cambridge — {MOCK_ITEMS.length} items,{' '}
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

        {/* Bottom spacer so last card clears the composer */}
        <View style={{ height: spacing.xxl }} />
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
      <ChatComposer onSend={handleSend} disabled={isLoading} />

      {/* Profile modal (stub — just shows affordance) */}
      <Modal
        visible={profileModalOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setProfileModalOpen(false)}
      >
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Your Profile</Text>
            <Pressable
              style={styles.modalClose}
              onPress={() => setProfileModalOpen(false)}
              accessibilityLabel="Close profile"
            >
              <Text style={styles.modalCloseText}>Done</Text>
            </Pressable>
          </View>
          <View style={styles.modalBody}>
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
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
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
  safe: {
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
    fontSize: 26,
    lineHeight: 33,
    color: '#FFFFFF',
    letterSpacing: -0.4,
    marginBottom: spacing.sm,
  },
  heroBody: {
    fontFamily: fonts.sans,
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 22,
  },
  // Profile modal
  modalSafe: {
    flex: 1,
    backgroundColor: colors.page,
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
    paddingVertical: 4,
    paddingHorizontal: 8,
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
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.muted.light + '15',
  },
  profileLabel: {
    fontFamily: fonts.sansBold,
    fontSize: 13,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.muted.light,
  },
  profileValue: {
    fontFamily: fonts.sans,
    fontSize: 15,
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
