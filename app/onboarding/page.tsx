import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import { Eyebrow } from "@/components/design";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-mesh-light">
      <header className="border-b border-muted-light/10 bg-card-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-[760px] px-6 py-4 flex items-center gap-2">
          <span className="font-serif text-xl font-bold text-headline-light tracking-tight">
            Civic Signal
          </span>
          <span className="font-sans text-xs text-muted-light">Cambridge</span>
        </div>
      </header>

      <main className="mx-auto max-w-[760px] px-6 py-12 sm:py-16">
        <Eyebrow>Step 1 of 1 &middot; about 30 seconds</Eyebrow>
        <h1 className="mt-5 font-serif text-4xl leading-[1.1] text-headline-light sm:text-5xl">
          Tell us a little about you.
        </h1>
        <p className="mt-4 max-w-xl font-sans text-base leading-relaxed text-body-light/85">
          We use this to surface the council items that actually affect your life.
          We never share it with anyone, and we never tell you how to vote.
        </p>

        <div className="mt-10">
          <OnboardingForm />
        </div>
      </main>
    </div>
  );
}
