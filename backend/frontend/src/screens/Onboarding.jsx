import { useState } from 'react';

const BOARDS = ['CBSE', 'AP Board', 'TS Board', 'Maharashtra State Board', 'Other'];
const STREAMS = [
  { code: 'MPC', label: 'Maths · Physics · Chemistry' },
  { code: 'BiPC', label: 'Bio · Physics · Chemistry' },
  { code: 'MEC', label: 'Maths · Economics · Commerce' },
];

export default function Onboarding({ onComplete }) {
  const [form, setForm] = useState({ name: '', board: '', year: '', stream: '' });
  const [submitting, setSubmitting] = useState(false);

  const isValid = form.name && form.board && form.year && form.stream;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isValid) return;
    setSubmitting(true);
    await onComplete({ ...form, year: Number(form.year) });
    setSubmitting(false);
  }

  return (
    <div className="animate-riseIn">
      <div className="mb-6">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-brass">
          Step 01 — Candidate Details
        </span>
        <h1 className="mt-2 font-display text-3xl font-semibold text-paper">
          Fill in your admit card
        </h1>
        <p className="mt-1 text-paper/50">Enter details exactly as you would on an exam hall ticket.</p>
      </div>

      <div className="corner-brackets paper-texture rounded-sm p-6 sm:p-8 shadow-2xl">
        <div className="flex gap-6">
          <div className="hidden sm:flex h-28 w-24 shrink-0 items-center justify-center border-2 border-dashed border-charcoal/30 bg-white/40 font-mono text-[9px] uppercase tracking-widest text-charcoal/40">
            Photo
          </div>

          <form onSubmit={handleSubmit} className="flex-1 space-y-5">
            <div>
              <label className="font-mono text-[11px] uppercase tracking-[0.15em] text-charcoal/60">
                Candidate name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full border-b-2 border-charcoal/30 bg-transparent px-1 py-1.5 font-display text-lg text-charcoal focus:border-redpen focus:outline-none"
                placeholder="e.g. Priya Reddy"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-[11px] uppercase tracking-[0.15em] text-charcoal/60">
                  Board
                </label>
                <select
                  value={form.board}
                  onChange={(e) => setForm({ ...form, board: e.target.value })}
                  className="mt-1 w-full border-b-2 border-charcoal/30 bg-transparent px-1 py-1.5 font-mono text-sm text-charcoal focus:border-redpen focus:outline-none"
                >
                  <option value="">Select</option>
                  {BOARDS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-mono text-[11px] uppercase tracking-[0.15em] text-charcoal/60">
                  Year
                </label>
                <input
                  type="number"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  className="mt-1 w-full border-b-2 border-charcoal/30 bg-transparent px-1 py-1.5 font-mono text-sm text-charcoal focus:border-redpen focus:outline-none"
                  placeholder="2026"
                  min="2000"
                  max="2035"
                />
              </div>
            </div>

            <div>
              <label className="font-mono text-[11px] uppercase tracking-[0.15em] text-charcoal/60">
                Stream opted
              </label>
              <div className="mt-2 space-y-2">
                {STREAMS.map((s) => (
                  <button
                    type="button"
                    key={s.code}
                    onClick={() => setForm({ ...form, stream: s.code })}
                    className={`flex w-full items-center justify-between border px-3 py-2 text-left transition-colors ${
                      form.stream === s.code
                        ? 'border-redpen bg-redpen/5'
                        : 'border-charcoal/20 hover:border-charcoal/40'
                    }`}
                  >
                    <span className="font-display font-semibold text-charcoal">{s.code}</span>
                    <span className="font-mono text-[10px] uppercase tracking-wide text-charcoal/50">
                      {s.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!isValid || submitting}
        className="mt-6 w-full rounded-sm bg-redpen py-3 font-display text-lg font-semibold tracking-wide text-paper transition-opacity hover:opacity-90 disabled:opacity-30"
      >
        {submitting ? 'Issuing admit card…' : 'Proceed to subjects →'}
      </button>
    </div>
  );
}
