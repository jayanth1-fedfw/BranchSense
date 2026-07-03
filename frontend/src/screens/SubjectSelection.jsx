import { useState } from 'react';
import { SUBJECTS_BY_STREAM } from '../data/topicMap';

export default function SubjectSelection({ stream, onComplete }) {
  const suggested = SUBJECTS_BY_STREAM[stream] || [];
  const [selected, setSelected] = useState(suggested);

  function toggle(subject) {
    setSelected((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  }

  return (
    <div className="animate-riseIn">
      <div className="mb-6">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-brass">
          Step 02 — Subject Declaration
        </span>
        <h1 className="mt-2 font-display text-3xl font-semibold text-paper">
          Which papers did you appear for?
        </h1>
        <p className="mt-1 text-paper/50">
          Auto-marked for {stream || 'your stream'}. Untick anything you didn't study.
        </p>
      </div>

      <div className="corner-brackets paper-texture rounded-sm p-6 sm:p-8 shadow-2xl">
        <div className="mb-4 flex items-center justify-between border-b border-charcoal/20 pb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-charcoal/50">
          <span>Answer only the applicable subjects</span>
          <span>Max marks vary</span>
        </div>

        <div className="space-y-3">
          {suggested.map((subject, i) => (
            <label
              key={subject}
              className={`flex cursor-pointer items-center gap-4 border px-4 py-3 transition-colors ${
                selected.includes(subject)
                  ? 'border-redpen bg-redpen/5'
                  : 'border-charcoal/20 hover:border-charcoal/40'
              }`}
            >
              <span className="font-mono text-xs text-charcoal/40">
                Q{String(i + 1).padStart(2, '0')}
              </span>
              <input
                type="checkbox"
                checked={selected.includes(subject)}
                onChange={() => toggle(subject)}
                className="h-4 w-4 accent-redpen"
              />
              <span className="font-display text-lg font-medium text-charcoal">{subject}</span>
              {selected.includes(subject) && (
                <span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-redpen">
                  ✓ marked
                </span>
              )}
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={() => onComplete(selected)}
        disabled={selected.length === 0}
        className="mt-6 w-full rounded-sm bg-redpen py-3 font-display text-lg font-semibold tracking-wide text-paper transition-opacity hover:opacity-90 disabled:opacity-30"
      >
        Proceed to marks entry →
      </button>
    </div>
  );
}
