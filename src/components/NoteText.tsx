import { annotateNoteNames } from '../lib/music';
import { useProgress } from '../lib/progress';

/**
 * Renders prose with note names translated to the chosen naming system.
 * Use it for headings, summaries, and captions that sit outside RichText.
 */
export default function NoteText({ text }: { text: string }) {
  const { settings } = useProgress();
  return <>{annotateNoteNames(text, settings.noteNaming)}</>;
}
