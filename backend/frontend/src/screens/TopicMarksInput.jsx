import { useState } from 'react';
import { TOPICS_BY_SUBJECT } from '../data/topicMap';

export default function TopicMarksInput({ subjects, onComplete }) {
  const [marks, setMarks] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function setMark(subject, topic, value, max) {
    const num = value === '' ? '' : Math.max(0, Math.min(Number(value), max));
    setMarks((prev) => ({
      ...prev,
      [subject]: { ...prev[subject], [topic]: num },
    }));
  }

  function buildScoresPayload() {
    const scores = [];
    for (const subject of subjects) {
      for (const { topic, max } of TOPICS_BY_SUBJECT[subject] || []) {
        const value = marks[subject]?.[topic];
        if (value !== '' && value !== undefined) {
          scores.push({ subject, topic, marks: Number(value), max });
        }
      }
    }
    return scores;
  }

  const totalFields = subjects.reduce((sum, s) => sum + (TOPICS_BY_SUBJECT[s]?.length || 0), 0);
  const filledFields = buildScoresPayload().length;
  const totalMarksSoFar = buildScoresPayload().reduce((sum, s) => sum + s.marks, 0);
  const totalMaxSoFar = buildScoresPayload().reduce((sum, s) => sum + s.max, 0);
  const isComplete = filledFields === totalFields && totalFields > 0;

  let qNum = 0;

  async function handleSubmit() {
    setSubmitting(true);
    await onComplete(buildScoresPayload());
    setSubmitting(false);
  }

  return (
    <div className="animate-riseIn">
      <div className="mb-6">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-brass">
          Step 03 — Answer Sheet
        </span>
        <h1 className="mt-2 font-display text-3xl font-semibold text-paper">
          Enter your marks, topic by topic
        </h1>
        <p className="mt-1 text-paper/50">
          Not your subject total — the topic-wise breakdown is what BranchSense reads.
        </p>
      </div>

      <div className="corner-brackets paper-lines paper-texture rounded-sm p-6 sm:p-8 shadow-2xl">
        {subjects.map((subject) => (
          <div key={subject} className="mb-8 last:mb-0">
            <div className="mb-3 flex items-center gap-2 border-b-2 border-charcoal/70 pb-1.5">
              <h2 className="font-display text-sm font-bold uppercase tracking-[0.15em] text-charcoal">
                Section — {subject}
              </h2>
            </div>

            <div className="space-y-1">
              {(TOPICS_BY_SUBJECT[subject] || []).map(({ topic, max }) => {
                qNum += 1;
                const val = marks[subject]?.[topic] ?? '';
                return (
                  <div
                    key={topic}
                    className="flex items-center gap-3 py-2"
                  >
                    <span className="w-8 shrink-0 font-mono text-xs text-charcoal/40">
                      {String(qNum).padStart(2, '0')}.
                    </span>
                    <span className="flex-1 text-sm text-charcoal">{topic}</span>
                    <div className="flex shrink-0 items-baseline gap-1 font-mono">
                      <input
                        type="number"
                        min="0"
                        max={max}
                        value={val}
                        onChange={(e) => setMark(subject, topic, e.target.value, max)}
                        className={`w-14 border-b-2 bg-transparent px-1 text-right text-sm font-semibold focus:outline-none ${
                          val !== '' ? 'border-redpen text-redpen' : 'border-charcoal/30 text-charcoal'
                        }`}
                      />
                      <span className="text-xs text-charcoal/40">/ {max}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="mt-6 flex items-center justify-between border-t-2 border-charcoal/70 pt-4 font-mono">
          <span className="text-[10px] uppercase tracking-[0.2em] text-charcoal/50">
            {filledFields} / {totalFields} answered
          </span>
          <span className="text-sm font-bold text-charcoal">
            Total: {totalMarksSoFar} / {totalMaxSoFar}
          </span>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!isComplete || submitting}
        className="mt-6 w-full rounded-sm bg-redpen py-3 font-display text-lg font-semibold tracking-wide text-paper transition-opacity hover:opacity-90 disabled:opacity-30"
      >
        {submitting ? 'Submitting answer sheet…' : 'Submit for evaluation →'}
      </button>
    </div>
  );
}
