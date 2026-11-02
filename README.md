# Cadence

Cadence is a web-based, interactive music theory trainer for **reading** and **listening**. It moves from first principles to advanced analysis through 14 courses and 44 lessons, with exercises at the end of every lesson and a spaced-recall practice queue that keeps earlier material alive.

The interface is installable as a PWA and is structured so the same build can be wrapped as an Android APK with Capacitor.

## What is included

- **Structured curriculum** across five levels: Foundations, Beginner, Intermediate, Advanced, and Master.
- **Lesson exercises** for staff reading, note finding, heard and written intervals, chord quality and inversion, chord and scale building, key signatures, rhythm counting and dictation, melodic dictation, scale degrees, and chord progressions.
- **Daily practice** driven by per-skill strength, review streaks, and expanding review intervals. Missed skills return sooner.
- **Piano, guitar, or both.** Note-finding, chord-building, and scale-building questions render on the selected instrument surface. Pitch class is what counts, so any octave or fret position works.
- **Synthesized audio** for piano and Karplus–Strong guitar, generated locally with the Web Audio API. No audio files to download.
- **Offline support** through a service worker. Progress, settings, and review history live in `localStorage`.
- **Responsive layout** with a desktop sidebar and a mobile bottom navigation bar.

## Run it

```bash
npm install
npm run dev
```

Vite prints the local URL. To use the port used during development:

```bash
npm run dev -- --port 5199
```

Type-check and production build:

```bash
npm run typecheck
npm run build
npm run preview
```

The production output is written to `dist/`.

## Install as a PWA

1. Open the production site (or the dev server) in Chrome, Edge, or a Chromium-based browser.
2. Use the install icon in the address bar, or the browser menu's **Install Cadence** action.
3. On Android, Chrome's menu also offers **Add to Home screen**.

The app precaches the shell, icons, and the bundled Noto Music font. Once loaded, lessons, exercises, and the instrument surfaces work without a network connection.

## Wrap as an Android APK

The repository includes `capacitor.config.json` with `webDir: "dist"`. Capacitor's Android project is generated locally and is not committed.

```bash
npm install
npm install @capacitor/core @capacitor/android
npm install -D @capacitor/cli

npm run build
npx cap add android
npx cap sync android
```

Open the native project:

```bash
npx cap open android
```

Or build a debug APK from the command line:

```bash
cd android
./gradlew assembleDebug
```

The APK is written to `android/app/build/outputs/apk/debug/app-debug.apk`. For a release build, configure signing in Android Studio and run `./gradlew assembleRelease`.

After changing web code, rebuild and sync again:

```bash
npm run build
npx cap sync android
```

### Notes for the native wrap

- Routing uses `HashRouter`, so deep links such as `#/lesson/treble-clef-reading` work from static files and from Capacitor's local server.
- Audio starts after the first user gesture, as required by mobile browsers. The instrument and **Listen** controls provide that gesture.
- The PWA manifest and service worker are not used by the native shell, but they remain useful for the browser version.
- If you publish the web build under a sub-path, adjust `base` in `vite.config.ts` and the manifest `start_url`/`scope` accordingly.

## Project structure

```text
src/
  App.tsx                 app shell, navigation, routes
  components/             staff, piano, fretboard, rhythm, session engine
  data/curriculum.ts      14 courses, 44 lessons, levels, skill blueprints
  lib/
    audio.ts              Web Audio piano and guitar synthesis
    exercises.ts          question generators, grading, topic presets
    music.ts              pitch, intervals, chords, scales, key signatures
    progress.tsx          persistence, XP, streaks, spaced repetition
    courseStats.ts        lesson/course progress helpers
  pages/                  dashboard, courses, lesson, practice, trainer, settings
  styles.css              design system and responsive rules
public/
  fonts/NotoMusic-Regular.ttf
  icons/
```

## How practice scheduling works

Each exercise answer updates every skill attached to that question:

- A wrong answer resets the skill's streak and schedules it again in about six hours.
- Correct answers advance through review intervals of roughly 6 hours, 1 day, 2 days, 4 days, 7 days, 14 days, 30 days, and 60 days.
- Strength rises with correct answers and falls with misses. The daily queue combines due reviews with the weakest skills, and falls back to a foundation mix when no history exists.
- Repeated questions on the same skill within a ten-minute sitting do not advance the interval. The skill is scheduled once, so a lesson cannot inflate a review streak.

The scheduler is intentionally local-first: all state is in `localStorage` under `cadence.progress.v1`. Clearing site data resets progress.

## Settings

- **Instrument:** piano, guitar, or both.
- **Timbre:** synthesized piano or guitar.
- **Note labels:** show or hide note names on the instrument surfaces.
- **Autoplay:** play listening questions automatically.
- **Sound:** globally mute or enable audio.
- **Daily goal:** target number of answered questions per day.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and build the production bundle |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | Run TypeScript without emitting files |
