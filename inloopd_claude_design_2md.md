# Inloopd — Poster Design Reference

A self-contained brief for designing **single-surface marketing posters** for Inloopd with Claude. Posters here means a static fixed-canvas composition: social tiles (IG square / portrait / story), AppStore feature graphics, launch announcements, event posters, web hero images, recruitment cards.

This is *not* the iOS app design system — posters have different rules. They are one frame, no interactivity, no light/dark adaptation, no component reuse. Visual hierarchy and editorial weight matter more than UI primitives.

For deeper context: product copy lives in `inloopd_context.md`, the iOS system in `inloopd_design.md`, the Figma primitives in `inloopd_design_info.md`. This file is the only one Claude needs when the deliverable is a poster.

## 2. Identity at a glance

| Field        | Value                                                                   |
| ------------ | ----------------------------------------------------------------------- |
| Product name | **Inloopd** (always lowercase 'l', never "InLoopd" or "Inlooped") |
| Tagline      | **Stay in the loop. The easy way.**                               |
| Domain       | `inloopd.com`                                                         |
| Platform     | iOS (beta, TestFlight + waitlist)                                       |
| Built by     | MIT students                                                            |
|              |                                                                         |

The brand mark is the wordmark **Inloopd** in a serif (Playfair Display on the marketing site, SF Serif/New York in-app), often paired with a small SVG waveform glyph as the avatar/icon.

---

## 3. Color system (poster-simplified)

Posters pick **one mode per artwork** — light or dark. Don't mix. Most marketing posters lean dark (the navy gradient is the most ownable visual).

### 3.1 Core palette

| Token                   | Hex         | Use                                   |
| ----------------------- | ----------- | ------------------------------------- |
| `bg-page-light`       | `#F2F7FA` | Light-mode page background            |
| `bg-page-dark`        | `#0A0A0F` | Dark-mode page background             |
| `navy-top`            | `#294259` | Top stop of the signature gradient    |
| `navy-bottom`         | `#1A2936` | Bottom stop of the signature gradient |
| `navy-deep`           | `#080A12` | Deepest navy (dark-mode bottom)       |
| `card-white`          | `#FFFFFF` | White card / block on light pages     |
| `card-dark`           | `#171C2E` | Dark card / block on dark pages       |
| `text-headline-light` | `#1A242E` | Headlines on light bg                 |
| `text-headline-dark`  | `#F5F7FC` | Headlines on dark bg                  |
| `text-body-light`     | `#1F3345` | Body on light bg                      |
| `text-body-dark`      | `#EDF0F5` | Body on dark bg                       |
| `text-muted-light`    | `#617585` | Secondary text on light               |
| `text-muted-dark`     | `#A8B3C2` | Secondary text on dark                |
| `accent-brand-light`  | `#304D63` | Eyebrow dots, accents on light        |
| `accent-brand-dark`   | `#619EDB` | Eyebrow dots, accents on dark         |

### 3.2 Signature gradient (the most ownable look)

```css
background: linear-gradient(135deg, #294259 0%, #1A2936 100%);
/* Dark mode equivalent */
background: linear-gradient(135deg, #171C2E 0%, #080A12 100%);
```

This is the **midnight navy** — the player card, hero surfaces, and almost every premium Inloopd visual lives here. If a poster has only one block of color, make it this.

### 3.3 Topic accent palette (8 swatches)

Use sparingly — for category tags, pull-quotes, or one-color accent strips. Each topic in the app maps to one swatch (Light / Dark mode pair):

| # | Light       | Dark        | Pigment         |
| - | ----------- | ----------- | --------------- |
| 1 | `#3875A6` | `#6BAEEB` | Steel blue      |
| 2 | `#9E4729` | `#E08557` | Brick           |
| 3 | `#297A5C` | `#52B88F` | Deep teal-green |
| 4 | `#753D8F` | `#AD75D1` | Plum            |
| 5 | `#8F6B24` | `#D6AD57` | Ochre           |
| 6 | `#24578F` | `#5793D6` | Deeper blue     |
| 7 | `#943347` | `#E06B7A` | Burgundy        |
| 8 | `#42756B` | `#70B3A3` | Slate green     |

Mid-saturation pigments — never neon, never pastel. When tinting (chip backgrounds), apply at 10–15% alpha and use the full-saturation hex for the text.

---

## 4. Typography

Inloopd's voice is **serif headlines + rounded sans body**. This contrast is the typographic identity — don't break it.

### 4.1 Font stack

```css
/* Serif — headlines, hero copy, story titles, brand mark */
font-family: 'Newsreader', 'New York', 'Playfair Display', Georgia, serif;

/* Rounded sans — body, eyebrows, captions, CTAs */
font-family: -apple-system, 'SF Pro Rounded', 'Nunito', 'Inter', system-ui, sans-serif;

/* Mono — timestamps, metadata accents (rare on posters) */
font-family: 'SF Mono', 'JetBrains Mono', ui-monospace, monospace;
```

For web-rendered posters where Apple fonts aren't installed, **Newsreader** (Google Fonts) is the closest free serif fallback to New York; **Nunito** is the closest to SF Rounded.

### 4.2 Poster size scale

Posters need much larger type than the iOS app. Suggested ranges for a 1080-wide canvas:

| Role                       | Family  | Size      | Weight                        | Notes                      |
| -------------------------- | ------- | --------- | ----------------------------- | -------------------------- |
| **Display headline** | Serif   | 96–160px | 700                           | The single hero line       |
| **Page title**       | Serif   | 64–88px  | 700                           | Secondary headline         |
| **Section title**    | Serif   | 40–52px  | 700                           | Inside multi-block posters |
| **Card title**       | Serif   | 28–36px  | 700                           | Story-card-style           |
| **Lead body**        | Rounded | 24–32px  | 500                           | Subhead under hero         |
| **Body**             | Rounded | 18–22px  | 500                           | Standard body              |
| **Caption**          | Rounded | 14–16px  | 500                           | Metadata, footnotes        |
| **Eyebrow**          | Rounded | 14–18px  | 700, kerning 1.6px, UPPERCASE | Editorial label            |
| **Brand mark**       | Serif   | 32–48px  | 700                           | Wordmark in footer/header  |

Scale these proportionally for other canvas sizes (e.g., for 1920-wide, multiply by ~1.8).

### 4.3 Voice rules

- Use **serif** for anything someone is meant to *read as a statement* (headline, quote, story title).
- Use **rounded sans** for anything *labeling* or *navigating* (eyebrow, caption, button, metadata).
- Don't mix two serifs. Don't use bold rounded as a substitute for serif headlines — they read as different products.

---

## 5. Signature visual motifs

These are the moves that make a poster *look like Inloopd* rather than a generic AI app.

### 5.1 Editorial eyebrow

A 5pt brand-accent dot followed by short uppercase rounded label. The single most recognizable Inloopd UI motif:

```html
<div style="display:flex; align-items:center; gap:10px;">
  <div style="width:8px; height:8px; border-radius:50%; background:#304D63;"></div>
  <span style="font-family: Nunito, sans-serif; font-weight:700;
               font-size:16px; letter-spacing:1.6px; text-transform:uppercase;
               color:#617585;">
    Issue No. 001
  </span>
</div>
```

Use cases on posters: `ISSUE NO. 001`, `THURSDAY, APRIL 30, 2026`, `NOW IN BETA`, `TONIGHT'S BRIEFING`, `FROM MIT`. Always uppercase, always kerned.

### 5.2 Midnight-navy hero block

A tall rectangle (or full poster) filled with the signature gradient (§3.2), 26–32pt corner radius if it's a card, no radius if it's full-bleed. Carries: serif white headline, white-translucent body (`rgba(255,255,255,0.8)`), optional waveform glyph.

### 5.3 Soft rounded corners (poster scale)

Inloopd has almost no sharp edges. For posters, scale the iOS radii up:

| Surface            | Radius                      |
| ------------------ | --------------------------- |
| Mini card / chip   | 18–22px                    |
| Standard card      | 28–36px                    |
| Hero card          | 40–52px                    |
| Brand mark capsule | fully rounded (height ÷ 2) |

### 5.4 Waveform glyph

The Inloopd brand uses a stylized horizontal waveform — vertical capsule bars of varying heights (50–60 of them at ~2.5pt spacing). Two-tone: lit bars in white/full color, unlit in the same color at ~30–40% opacity. Used as:

- A decorative band across the bottom of a hero
- A "now playing" indicator in product screenshots
- The avatar/icon glyph

### 5.5 Topic-tagged pill

For posters that reference a specific topic (e.g. "AI Frontier"), use the chip pattern: capsule shape, fill = topic color at ~12% alpha, text = same topic color at full saturation, padding 8px vertical / 16px horizontal.

### 5.6 The 4pt left accent stripe

For magazine-style story blocks: a thin vertical bar (4px wide, 100% of card height, brand-accent or topic color) flush against the left edge of the content. Cheap, distinctive, very on-brand.

---

## 6. Composition recipes

Five archetypes that cover ~90% of marketing-poster needs. Pick one and adapt.

### 6.1 The Editorial Cover (recommended default)

Single hero serif headline on navy gradient, eyebrow above, small body line + brand mark below. Reads like a magazine cover.

```
┌─────────────────────────────────┐
│                                 │
│  • TONIGHT'S BRIEFING           │  ← eyebrow (top-left)
│                                 │
│                                 │
│  Stay in the loop.              │  ← serif display, white
│  The easy way.                  │
│                                 │
│  Your daily AI briefing,        │  ← rounded body, white @ 80%
│  built around what you          │
│  actually care about.           │
│                                 │
│                                 │
│  ▁▂▃▅▇▆▅▃▂▁▁▂▃▅▇▆▅▃▂▁         │  ← waveform decoration
│                                 │
│  Inloopd                        │  ← serif wordmark, bottom-left
└─────────────────────────────────┘
```

Background: `linear-gradient(135deg, #294259, #1A2936)`. Padding: 64–80px on all sides for 1080-wide.

### 6.2 The Light Editorial

Same composition as 6.1 but on `#F2F7FA` background with `#1A242E` headline, `#617585` body, `#304D63` brand-accent eyebrow dot. Quieter, more press-blurb / blog-hero. Useful when sitting next to other dark imagery.

### 6.3 The Split (text + product shot)

Left half: navy gradient with eyebrow + serif headline + CTA line. Right half: product screenshot of the iOS app, slightly tilted (~3–6°) with a soft shadow. Best for AppStore-feature-style posters and launch announcements.

### 6.4 The Pull Quote

Centered serif quote (huge, ~120px, italic optional) with attribution beneath in rounded sans. Background: light off-white (`#F2F7FA`) or full navy gradient. Useful for testimonials, press blurbs, founder soundbites.

### 6.5 The Stack

Vertical sequence of blocks, each a different surface (white card → navy block → topic-tinted strip), each with one piece of info (eyebrow, stat, caption). Best for "here's what's new" or feature roundup posters. Use 24–32px gaps between blocks.

---

## 7. Copy library (use these verbatim)

These are pre-approved Inloopd lines. Copy-paste into posters; no need to invent new ones.

### 7.1 Headlines (serif, hero)

- **Stay in the loop. The easy way.**
- **Your depth. Your topics.**
- **Not just filtering — rewriting.**
- **More news than ever. Less time than ever.**
- **Too many papers, too many launches, too many feeds, not enough hours.**
- **A starter today. Fully yours tomorrow.**
- **Your commute is about to become a compounding curriculum.**

### 7.2 Body (rounded, 1–2 sentences)

- *Your daily tech briefing, built around what you actually care about.*
- *Inloopd reads the firehose so your attention stays on what's worth thinking about.*
- *200+ sources, ranked by what matters to you, written at your depth.*
- *Listen as a podcast or swipe through story tiles. Every claim links back to its source.*
- *Built from listeners with similar interests, then re-tuned overnight to your profile.*

### 7.3 Eyebrows (uppercase, kerned)

`HOW IT WORKS` · `WHY INLOOPD` · `ISSUE NO. 001` · `TONIGHT'S BRIEFING` · `NOW IN BETA` · `FROM MIT` · `BACKED BY ELEVENLABS` · `THURSDAY, APRIL 30, 2026`

### 7.4 CTAs

- `Join the waitlist`
- `Hear my starter`
- `Get it on TestFlight`
- `inloopd.com`

### 7.5 Numbers cheat sheet (safe to feature)

| Stat                | Value                                   |
| ------------------- | --------------------------------------- |
| Sources             | **200+**                          |
| Topics              | **8** canonical                   |
| Sub-specializations | **~99+**                          |
| Familiarity tiers   | **5** (Just learning → Expert)   |
| Formats             | **Podcast** + **Headlines** |
| Cadence             | **Daily** + Sunday Recap          |

---

## 8. Voice and tone

Inloopd's voice on posters should feel **editorial, warm, anti-hype, concrete**. Match these traits:

- **Concrete over abstract.** "200+ sources, ranked for you" beats "AI-powered news intelligence".
- **Anti-hype.** Avoid "next-generation", "supercharge", "revolutionize", "AI-powered" as a tag.
- **Direct second-person.** "Your briefing", not "users get a briefing".
- **Calm reduction.** "One short briefing. Every morning." beats "Comprehensive multi-modal news synthesis."
- **Opinionated about depth.** The thesis is *depth-mismatch is the real news problem*. Don't dilute it.

### 8.1 Preferred vocabulary

| Use                     | Don't use                |
| ----------------------- | ------------------------ |
| briefing                | newsletter, digest, feed |
| podcast / episode       | audio summary            |
| story tiles / Headlines | card view, feed view     |
| sources                 | citations, references    |
| Library / saved         | favorites, starred       |

---

## 9. Things NOT to do (poster guardrails)

- ❌ **Don't claim user numbers** ("10,000 users", "X% engagement") — beta-stage, no public numbers.
- ❌ **Don't claim publisher partnerships** — Inloopd reads public sources; sources are linked, not licensed.
- ❌ **Don't say "real-time"** — it's a *daily* briefing.
- ❌ **Don't use stock-photo AI imagery** — no glowing brains, no neural-network meshes, no humanoid robots. Inloopd's identity is editorial typography, not generative AI clichés.
- ❌ **Don't use neon, gradient text, glow effects, or rainbow palettes** — restraint is the whole brand.
- ❌ **Don't use sharp 90° corners on cards** — soft radii everywhere.
- ❌ **Don't mix serif families.** One serif (Newsreader/New York) only.
- ❌ **Don't use sans-serif for hero headlines.** Always serif.
- ❌ **Don't promise Android, web, or Mac.** iOS-only today.
- ❌ **Don't put the wordmark inside a colored box** — let "Inloopd" sit as type on its surface.
- ❌ **Don't use shadows heavier than `0 12px 24px rgba(0,0,0,0.25)`** — Inloopd shadows are soft and low.

---

## 10. HTML/CSS scaffolding (copy-paste starter)

A minimal poster scaffold for a 1080×1350 IG portrait, dark editorial cover style:

```html
<!DOCTYPE html>
<html>
<head>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Newsreader:wght@400;700&family=Nunito:wght@500;700&display=swap');
  body {
    margin: 0;
    width: 1080px;
    height: 1350px;
    background: linear-gradient(135deg, #294259 0%, #1A2936 100%);
    font-family: 'Nunito', sans-serif;
    color: #F5F7FC;
    padding: 80px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
  }
  .eyebrow {
    display: flex; align-items: center; gap: 12px;
    font-weight: 700; font-size: 18px;
    letter-spacing: 1.8px; text-transform: uppercase;
    color: rgba(245,247,252,0.7);
  }
  .eyebrow::before {
    content: ''; width: 10px; height: 10px;
    border-radius: 50%; background: #619EDB;
  }
  .headline {
    font-family: 'Newsreader', serif;
    font-weight: 700; font-size: 128px; line-height: 1.05;
    letter-spacing: -0.02em; margin: 32px 0 0;
  }
  .body {
    font-size: 26px; font-weight: 500; line-height: 1.5;
    color: rgba(245,247,252,0.8); max-width: 720px;
    margin-top: 36px;
  }
  .footer {
    display: flex; justify-content: space-between; align-items: end;
    font-family: 'Newsreader', serif; font-weight: 700; font-size: 40px;
  }
  .url {
    font-family: 'Nunito', sans-serif; font-weight: 500;
    font-size: 22px; color: rgba(245,247,252,0.6);
  }
</style>
</head>
<body>
  <div>
    <div class="eyebrow">Tonight's Briefing</div>
    <h1 class="headline">Stay in the loop.<br>The easy way.</h1>
    <p class="body">
      Your daily tech briefing, built around what you actually care about.
      200+ sources, ranked for you, written at your depth.
    </p>
  </div>
  <div class="footer">
    <span>Inloopd</span>
    <span class="url">inloopd.com</span>
  </div>
</body>
</html>
```

### 10.1 Common gradient + shadow recipes

```css
/* Signature navy gradient */
background: linear-gradient(135deg, #294259 0%, #1A2936 100%);

/* Light page bg */
background: #F2F7FA;

/* Soft card lift */
box-shadow: 0 4px 10px rgba(0,0,0,0.04);

/* Hero card lift (use sparingly) */
box-shadow: 0 6px 16px rgba(0,0,0,0.12);

/* Card top-edge highlight (on dark gradient) */
border: 1px solid rgba(255,255,255,0.06);
```

### 10.2 Mesh-gradient option (for more atmospheric backgrounds)

The marketing site uses a 3×3 mesh in the `0.88–0.96` luminance band (light) or `0.05–0.12` band (dark). For posters, a CSS approximation:

```css
/* Light mesh background */
background:
  radial-gradient(circle at 20% 30%, #F5F8FA 0%, transparent 50%),
  radial-gradient(circle at 80% 20%, #EBF1F5 0%, transparent 50%),
  radial-gradient(circle at 50% 80%, #E8EFF5 0%, transparent 50%),
  #F0F5F8;

/* Dark mesh background */
background:
  radial-gradient(circle at 20% 30%, #1A2540 0%, transparent 50%),
  radial-gradient(circle at 80% 20%, #0F1525 0%, transparent 50%),
  radial-gradient(circle at 50% 80%, #15192A 0%, transparent 50%),
  #0A0A0F;
```

---

## 11. Quick checklist before shipping a poster

- [ ] Single hero message — not two competing headlines
- [ ] Serif used for headlines; rounded sans for body/eyebrow/CTA
- [ ] If headline is on dark, body sits at ~80% white, not full white
- [ ] Eyebrow has the dot prefix and is uppercased + kerned
- [ ] Soft corner radii everywhere (no sharp corners on cards)
- [ ] No "AI-powered" / "next-gen" / hype boilerplate
- [ ] Wordmark "Inloopd" appears once, in serif, not boxed
- [ ] No claimed user counts, no claimed publisher partnerships
- [ ] Color palette stays inside §3; no neons, no rainbow accents
- [ ] Generous breathing room — at least 64px gutter on a 1080-wide canvas
