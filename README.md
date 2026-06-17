# The Peptide App — Prototype

> A React Native / Expo prototype built for intern selection. Demonstrates full end-to-end mobile product thinking — from onboarding UX to data persistence, scheduling logic, and deployment.

---

## What This Is

A mobile app that helps users discover, schedule, and track peptide protocols. Think of it as a "fitness app for biohackers" — guiding users from zero knowledge to a personalised dosing schedule with reconstitution calculators, outcome tracking, and expert protocol libraries.

Built in ~4 weeks as a solo project using Expo + React Native.

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Expo SDK 56 / React Native 0.85 | Fastest cross-platform iteration |
| Routing | Expo Router (file-based) | Next.js-style routing, typed routes |
| State | Zustand + AsyncStorage | Lightweight, persisted, no boilerplate |
| UI | React Native StyleSheet + expo-linear-gradient + expo-blur | Full design control, no component library lock-in |
| Animations | React Native Reanimated + Moti | Spring physics, gesture-driven |
| Language | TypeScript (strict) | Type safety across all data models |
| Build | EAS Build (Expo Application Services) | Cloud APK/IPA, no local Android SDK needed |

---

## Features Built

### Onboarding (Phases 0–11)
- Animated splash screen with star field + mountain silhouette
- 4-slide carousel (goal preview, stat bubbles, transformation, disclaimer)
- Sex + age personalisation screens
- 4-path "Get Started" selector (match goal / choose peptide / browse protocols / add stack)
- **Deep goal flow:** Goal picker → Goal detail with benefits → "What's going on?" symptom selector → "How to proceed" → "We found one for you" protocol recommendation

### Home Tab — Glassmorphism Design
- Floating glass header with blur effect (expo-blur on iOS, rgba on Android)
- 7-day calendar strip with dose indicators
- Full-bleed protocol cards with tri-stop gradient overlay + participant badge
- Scrolls behind the glass header

### Explore Tab
- Segmented control (Protocols / Peptides)
- Search + category filter
- Links to Popular Stacks and Featured Protocols browse screens

### Protocol Detail (Phase 12)
- Full rich screen: At a Glance stats (difficulty, cost, duration), Who Is This For, Why This Stack (tappable peptide rows), Dosing Schedule, Caution card, FAQ accordion
- "Start Protocol" saves to Zustand store

### Peptide Detail — 3 Tab Layout (Phase 13)
- **Learn tab:** Tagline blockquote, Overview, Who Is This For, How It Works, Week-by-Week timeline, Safety grade card (A/B/C), Common Stacks
- **Schedule tab:** Weekly cost display, Vial sizes pricing table, How to Dose, Featured Protocols horizontal scroll
- **Sources tab:** Research citations
- Titration interstitial for complex peptides (Retatrutide, etc.)

### "Add Peptide" Scheduling Wizard (Phase 14)
- Autofill banner from peptide data
- Large dose display with custom numeric keypad + preset chips
- Once/twice frequency toggle
- 7-day circle day picker (tap to toggle)
- Days/Weeks/Months duration selector with +/- stepper
- "Run indefinitely" toggle
- Full mg/mcg unit switching

### Outcomes Tracking Setup (Phase 15)
- Metric selection with filter chips (Suggested / All / Body Composition / Sleep / Recovery)
- Duration picker with visual timeline bar + end date computation
- Baseline value input per metric
- Leads into "KPV Added" confirmation screen

### Reconstitution Calculator — Step-by-Step Wizard (Phase 20)
- Step 1: Peptide selector with colored letter avatars
- Step 2: Dose input with keypad modal + presets
- Step 3: Vial size with auto-calculated BAC water recommendation
- Step 4: Final result — draw volume in mL + **syringe units calculation** (`draw mL × 100`)
- Math: `syringeUnits = (desiredDoseMcg / concentrationMcgPerMl) * 100`

### Account & Settings
- Guest → Sign In flow
- My Protocols with progress bars + peptide name chips
- Stats & Activity (live from schedule + protocol stores)
- Settings: notifications toggle, LB/KG unit preference, practitioner mode
- **"Reset for Demo"** — clears all state and restarts from splash (for demos/testing)

---

## Data Architecture

```
store/
  useOnboardingStore.ts   — sex, age, goal, path, hasCompletedOnboarding
  useScheduleStore.ts     — scheduledPeptides[], takenDoses[]
  useProtocolStore.ts     — myProtocols[], activityLog[]
  useTrackingStore.ts     — tracking sessions with metrics + baselines
  useUserStore.ts         — guest/signed-in user profile
  useVialStore.ts         — reconstituted vials + blends

data/
  peptides.ts             — 13 peptides with full rich content (tagline, safety, dosing, cost)
  protocols.ts            — 7 protocols with difficulty, FAQ, whoIsThisFor, importantToKnow
  goals.ts                — 8 goals with social proof, symptom options, recommended protocols
  blends.ts               — 4 popular pre-made blends
```

All stores persist via `zustand/middleware/persist` + `@react-native-async-storage/async-storage`.

---

## Running Locally

```bash
git clone https://github.com/hruico/peptideProto.git
cd peptideProto
npm install
npx expo start
```

Scan the QR code with **Expo Go** on your phone, or press `a` for Android emulator.

**Requirements:** Node 18+, Expo CLI

---

## Android APK (Direct Install)

Latest build: https://expo.dev/accounts/hruico/projects/peptide-app/builds/fd4c3c62-ab8f-48f7-bf49-f2c79a9655f8

Download the `.apk` and install directly on any Android device (enable "Install from unknown sources" in settings).

---

## Project Structure

```
app/
  (tabs)/           — Bottom tab screens (Home, Explore, Reconstitute)
  onboarding/       — 10 onboarding screens
  protocol/         — Protocol detail
  peptide/          — Peptide detail (+ titration sub-screen)
  schedule/         — Add peptide wizard, confirmation, notifications
  tracking/         — Outcomes tracking setup flow
  reconstitute/     — Step-by-step reconstitution calculator
  account/          — Account, My Protocols, Stats, Settings
  explore/          — Popular stacks, Featured protocols

components/
  cards/            — ProtocolHeroCard, PeptideGridCard, VerifiedExpertsCard
  ui/               — SegmentedControl, WeekDateStrip, GradientButton, etc.

constants/
  theme.ts          — Design tokens (colors, spacing, typography, radii)

data/               — Static content (peptides, protocols, goals, blends)
store/              — Zustand state management
lib/                — reconstitutionMath.ts (pure calculation functions)
types/              — TypeScript interfaces
```

---

## Design Decisions Worth Noting

1. **No component library** — all UI is hand-rolled with React Native StyleSheet. This was intentional to demonstrate design implementation capability, not just API usage.

2. **Zustand over Redux** — the app needs simple, persisted state. Zustand's minimal API (no actions/reducers/selectors boilerplate) keeps the store files readable and the component code clean.

3. **Expo Router file-based routing** — mirrors the Next.js mental model. Each screen is a file, layouts handle nesting, modals use `presentation: 'modal'`. This makes the route structure self-documenting.

4. **Pure math in lib/** — `reconstitutionMath.ts` has zero React imports. The syringe unit calculation is a pure function, unit-testable without a device.

5. **Glassmorphism without a library** — `expo-blur` on iOS gives real backdrop blur. Android falls back to `rgba(18,19,42,0.82)` which approximates the effect without requiring a native module.

---

## What Would Come Next (Production Roadmap)

- Real photography for protocol cards (Unsplash/Pexels licensed)
- Expo Notifications for dose reminders (schema is ready in `useScheduleStore`)
- Auth (Clerk or Supabase) to replace the guest/signIn stub
- Practitioner mode — collection management for clinics
- Apple Health / Google Fit integration for tracked metrics
- App Store / Play Store submission (EAS Submit)
