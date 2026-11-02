# Cadence

Cadence is a web-based, interactive music theory trainer for **reading** and **listening**. It moves from first principles to advanced analysis through 14 courses and 44 lessons, with exercises at the end of every lesson and a spaced-recall practice queue that keeps earlier material alive.

The interface is installable as a PWA and is structured so the same build can be wrapped as an Android APK with Capacitor.

## What is included

- **Structured curriculum** across five levels: Foundations, Beginner, Intermediate, Advanced, and Master.
- **Lesson exercises** for staff reading, note finding, heard and written intervals, chord quality and inversion, chord and scale building, key signatures, rhythm counting and dictation, melodic dictation, scale degrees, and chord progressions.
- **Daily practice** driven by per-skill strength, review streaks, and expanding review intervals. Missed skills return sooner.
- **Piano, guitar, or both.** Note-finding, chord-building, and scale-building questions render on the selected instrument surface. Pitch class is what counts, so any octave or fret position works.
- **Synthesized audio** for piano and Karplus–Strong guitar, generated locally with the Web Audio API. No audio files to download.
- **Offline support** through a service worker. Progress, settings, and review history live in `localStorage`, with optional account sync across devices.
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

## Deploy to GitHub Pages

The repository includes `.github/workflows/deploy.yml`, which builds the app and publishes `dist/` whenever `main` is pushed.

1. Create a GitHub repository and push this project to its `main` branch.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Push to `main` (or run **Deploy to GitHub Pages** from the Actions tab).

The workflow detects the deployment path automatically:

- A project repository such as `cadence` is served from `https://<user>.github.io/cadence/` and is built with `BASE_PATH=/cadence/`.
- A user site repository named `<user>.github.io` is served from the domain root and is built with `BASE_PATH=/`.

For a custom domain configured in **Settings → Pages**, the project site still lives under `/<repo>/`, so leave the automatic base path alone. The workflow only switches to `/` when a `public/CNAME` file exists, which is appropriate when the site is genuinely served from the domain root.

To reproduce a Pages build locally:

```bash
BASE_PATH=/cadence/ npm run build
BASE_PATH=/cadence/ npm run preview
```

If you only want to serve it from a plain GitHub repository without Actions, you can build with `BASE_PATH=/<repo>/` and publish the contents of `dist/` to a `gh-pages` branch, but the included workflow is the simpler path.

## Accounts and cross-device sync

Progress is local-first: the app works fully offline and keeps writing to `localStorage`. Signing in adds an optional copy in Supabase so lessons, skills, XP, streaks, and settings follow you between phone and computer. A build without Supabase credentials keeps working normally and shows a short setup note in Settings instead.

Enable it once:

1. Create a free project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, run [`supabase/schema.sql`](supabase/schema.sql). It creates the `progress` table and row-level security policies so each user can only read and write their own row.
3. In **Authentication → URL Configuration**, set **Site URL** to the deployed address (for example `https://parsasam.ir/Cadance/`), and add that address plus `http://localhost:5173/` to **Redirect URLs**. The email link returns to the app root, where Supabase's PKCE flow completes.
4. Copy the project URL and the **anon public** key from **Project Settings → API** into `.env.local`. The URL is the project root only — `https://<project-ref>.supabase.co`, **not** the `/rest/v1/` endpoint:

   ```bash
   cp .env.example .env.local
   ```

5. For GitHub Pages, add both names as repository **variables** under **Settings → Secrets and variables → Actions → Variables**: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. The workflow passes them into the build.

Then open **Settings → Account**, enter an email, and follow the link. There is no password to store. The anon key is safe to ship in the bundle because row-level security restricts every request to the signed-in user.

How merging works:

- XP and daily question counts are tracked **per device**. Merging takes the maximum per device and then sums, so syncing the same two devices repeatedly never double counts.
- Lesson records keep the earliest completion, the best score, and the highest attempt count.
- Skills keep the most recently reviewed record.
- Settings follow the most recent change; a fresh device adopts the account's settings instead of overwriting them with defaults.
- Resetting progress records a reset timestamp, so the next sync clears the other devices instead of restoring old data.
- Practice is never blocked on the network. Changes are pushed shortly after activity and pulled when the app regains focus.

Supabase's built-in email sender is rate-limited and intended for testing. For real sign-ups, configure SMTP under **Authentication → Emails** with any transactional provider.

**Android note:** the native app cannot yet receive an `https://` email link. Completing sign-in in the APK needs a custom scheme (for example `com.cadence.musictheory://auth`) plus `@capacitor/browser` and `@capacitor/app` listeners. Until that is wired, sync works in the browser and installed PWA on both devices.

**Backups:** **Settings → Data → Export backup** downloads a JSON snapshot. **Import** restores one and treats it as a reset, so it replaces older copies on other devices.

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
    progress.tsx          React state, auth, sync, XP, spaced repetition
    progressState.ts      document shape, per-device counters, merge rules
    supabase.ts           optional Supabase client (env-driven)
    courseStats.ts        lesson/course progress helpers
  pages/                  dashboard, courses, lesson, practice, trainer, settings
  styles.css              design system and responsive rules
supabase/
  schema.sql              progress table, RLS policies, updated_at trigger
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

The scheduler is intentionally local-first: all state is in `localStorage` under `cadence.progress.v1`. Clearing site data resets the local copy. An account only adds a synced copy; offline practice still works and merges when the connection returns.

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
| `npm test` | Run the progress merge and migration tests |
| `npm run typecheck` | Run TypeScript without emitting files |
