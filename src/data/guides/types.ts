/**
 * A short editorial layer that sits around each lesson:
 *
 * - `idea` gives one mental model before the detail.
 * - `practice` turns the lesson into drills, names the usual mistake, and
 *   offers a stretch for players who already know the basics.
 *
 * English text is the translation key, so the Persian strings live beside the
 * English ones and can never drift out of sync.
 */
export interface GuideContent {
  id: string;
  idea: string;
  practice: string;
  faIdea: string;
  faPractice: string;
}
