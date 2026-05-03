import Link from "next/link";
import { Eyebrow, NavyHero, AccentStripe, TopicPill } from "@/components/design";
import { LandingCta } from "@/components/landing/landing-cta";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 sm:px-10 sm:py-24">
      <Eyebrow>Civic Signal &middot; Cambridge</Eyebrow>

      <h1 className="mt-6 font-serif text-5xl leading-[1.05] tracking-tight sm:text-6xl">
        What your government is doing &mdash;<br />
        and what it means for you.
      </h1>

      <p className="mt-6 max-w-xl font-sans text-lg leading-relaxed text-body-light/90">
        We read the firehose of Cambridge city council activity, surface what
        actually affects your life, and pass your reactions back to council.
        We don&rsquo;t tell you how to vote.
      </p>

      <div className="mt-8">
        <LandingCta />
      </div>

      <NavyHero className="mt-14 p-10">
        <Eyebrow tone="dark">A peek at this week&rsquo;s briefing</Eyebrow>
        <h2 className="mt-5 font-serif text-3xl leading-[1.1] text-headline-dark sm:text-4xl">
          The first billion-dollar city budget is on the table.
        </h2>
        <p className="mt-4 max-w-xl font-sans text-base leading-relaxed text-body-dark/85">
          A public hearing on the FY27 budget runs Wednesday at 6pm. As a
          Cambridge renter who bikes to work, three line items affect you
          directly.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <TopicPill topic="housing" tone="dark" />
          <TopicPill topic="transit" tone="dark" />
          <TopicPill topic="schools" tone="dark" />
        </div>
      </NavyHero>

      <div className="mt-12 space-y-6">
        <AccentStripe topic="housing">
          <Eyebrow>Policy Order &middot; Jan 27, 2026</Eyebrow>
          <h3 className="mt-2 font-serif text-2xl">
            Cambridge Street upzoning passes 6&ndash;3
          </h3>
          <p className="mt-2 font-sans text-base text-muted-light">
            Six-story buildings now permitted from Inman Square to Lechmere.
            Direct follow-on to last year&rsquo;s multifamily reform.
          </p>
        </AccentStripe>

        <AccentStripe topic="civil_liberties">
          <Eyebrow>Ordinance &middot; Apr 28, 2026</Eyebrow>
          <h3 className="mt-2 font-serif text-2xl">
            Sanctuary-city amendments adopted unanimously
          </h3>
          <p className="mt-2 font-sans text-base text-muted-light">
            Bars federal immigration enforcement on city property.
          </p>
        </AccentStripe>
      </div>

      <div className="mt-16 border-t border-muted-light/15 pt-8 flex flex-wrap gap-x-6 gap-y-2 font-sans text-sm">
        <Link href="/onboarding" className="text-accent-brand-light font-bold hover:underline">
          Set up your profile &rarr;
        </Link>
        <Link href="/digest" className="text-muted-light hover:text-body-light">
          See this week&rsquo;s briefing
        </Link>
      </div>
    </main>
  );
}
