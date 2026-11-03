import type { ReactNode } from 'react';
import { annotateNoteNames, type NoteNaming } from '../lib/music';
import { useProgress } from '../lib/progress';

function inline(text: string, keyPrefix: string, naming: NoteNaming): ReactNode[] {
  const tokens = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g).filter(Boolean);
  return tokens.map((token, index) => {
    const key = `${keyPrefix}-${index}`;
    if (token.startsWith('**') && token.endsWith('**')) {
      return <strong key={key}>{annotateNoteNames(token.slice(2, -2), naming)}</strong>;
    }
    if (token.startsWith('*') && token.endsWith('*')) {
      return <em key={key}>{annotateNoteNames(token.slice(1, -1), naming)}</em>;
    }
    if (token.startsWith('`') && token.endsWith('`')) {
      return (
        <code key={key} className="inline-code">
          {token.slice(1, -1)}
        </code>
      );
    }
    return annotateNoteNames(token, naming);
  });
}

export default function RichText({ body, className = '' }: { body: string; className?: string }) {
  const { settings } = useProgress();
  const naming = settings.noteNaming;
  const blocks = body.split(/\n\n+/);
  return (
    <div className={`rich-text ${className}`}>
      {blocks.map((block, blockIndex) => {
        const lines = block.split('\n');
        if (lines.every((line) => line.trim().startsWith('- '))) {
          return (
            <ul key={blockIndex}>
              {lines.map((line, index) => (
                <li key={index}>{inline(line.replace(/^\s*-\s*/, ''), `${blockIndex}-${index}`, naming)}</li>
              ))}
            </ul>
          );
        }
        const ordered = lines.every((line) => /^\d+\.\s/.test(line.trim()));
        if (ordered) {
          return (
            <ol key={blockIndex}>
              {lines.map((line, index) => (
                <li key={index}>{inline(line.replace(/^\s*\d+\.\s*/, ''), `${blockIndex}-${index}`, naming)}</li>
              ))}
            </ol>
          );
        }
        return <p key={blockIndex}>{inline(block, String(blockIndex), naming)}</p>;
      })}
    </div>
  );
}
