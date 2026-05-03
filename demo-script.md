# Civic Signal — 2-minute demo script

**Total runtime:** 1:55 (5s buffer under 2:00).
**Persona on screen:** Alex — Inman Square, renter, bikes, no kids.
**Setup before record:** iOS Simulator open to the **Login** screen. Mock data already populated; six items live in the digest.

> Speak calm and editorial. Match the app's tone.

---

## SCENE 1 — Hook (0:00–0:12)

[Hold on Login screen. Don't tap yet.]

> "A typical Cambridge city council meeting has sixty-plus items. Almost no one reads them. Civic Signal reads them for you and tells you which ones actually affect *your* life — without telling you how to vote."

---

## SCENE 2 — Login (0:12–0:32)

[Tap the email field. Type `alex@example.com`. Tap **Continue with email**. Brief loading. Land on the digest.]

> "Sign-in is one tap. New users go through a thirty-second profile — address, housing, commute. I've already done that. Address tells the relevance engine my street and neighborhood. Bike commute means bike infrastructure stories surface. Renter means housing stories surface."

---

## SCENE 3 — Tonight's briefing (0:32–0:48)

[Land on the home feed. Hold on the navy hero card.]

> "Tonight's briefing. Six items the council touched. One affects me directly. The feed is sorted by personal relevance — not by date, not by drama."

[Slow scroll — first card is Garden Street, second is Cambridge Street zoning.]

---

## SCENE 4 — A specific item (0:48–1:13)

[Stop on the **Garden Street** card. Let the italic relevance line breathe on screen.]

> "Top of the feed: Garden Street stays one-way with separated bike lanes — five-to-four. The italic line is the system explaining *why* this is in front of me: 'Garden Street is on your bike route. The five-to-four vote keeps the protected lane you already use.'"

[Scroll to **Cambridge Street zoning** card.]

> "Next one: Inman Square — *my* neighborhood — capped at six stories in the new zoning. That detail came from an eighty-page ordinance. Civic Signal pulled it out and tied it to my address."

---

## SCENE 5 — Feedback loop (1:13–1:28)

[On the Cambridge Street card, tap **Support** in the reaction strip. Watch the pill fill, then the row replaces with the confirmation.]

> "I tap Support. That signal goes back to council, anonymized and aggregated by neighborhood. And — this matters — Civic Signal does *not* show me what other people picked. We give you a button to be heard, not a poll to copy."

---

## SCENE 6 — Chat with citations (1:28–1:50)

[Tap the chat composer at the bottom. Type: "what's controversial about the parking permit increase?" Tap send. Streamed response appears in the slide-up panel.]

> "And I can ask anything. Streaming Opus, with citations to the source bills, both sides surfaced when the council was split. Notice it never says 'you should support this' — that's a hard rule in the orchestrator."

---

## SCENE 7 — Closer (1:50–1:55)

[Cut back to the digest hero.]

> "We don't tell you how to vote. We tell you what your government is doing — and we tell your government what you think."

[End on the wordmark.]

---

## Notes for the recorder

- **Run order:** start app, sign in, scroll, tap card, react, chat. No cutting between takes if you can avoid it — one continuous demo reads more confident than a montage.
- **If chat doesn't stream:** the canned FY27 fallback kicks in when no `AI_GATEWAY_API_KEY` is set. Set the key before recording (`.env.local`, restart `npm run ios`).
- **Sim chrome:** hide the keyboard before showing the chat response by tapping outside the textarea.
- **Length cushion:** the script lands at ~1:55. If you stretch, drop the second sentence in Scene 3.
