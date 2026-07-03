import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

export default function ResultCard({ result, studentName, onRestart }) {
  const { branches, all_scores, ai_summary } = result;
  const top = branches[0];

  const radarData = all_scores.slice(0, 8).map((b) => ({ branch: b.branch, score: b.score }));

  return (
    <div className="animate-riseIn">
      <div className="mb-6 text-center">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-brass">
          Result Declared
        </span>
        <h1 className="mt-2 font-display text-3xl font-semibold text-paper">
          {studentName ? `${studentName}, your certificate is ready` : 'Your BranchSense certificate'}
        </h1>
      </div>

      {/* Certificate */}
      <div className="corner-brackets paper-texture relative overflow-hidden rounded-sm p-6 sm:p-10 shadow-2xl">
        <div className="text-center font-mono text-[10px] uppercase tracking-[0.3em] text-charcoal/40">
          Certificate of Aptitude Match
        </div>

        <div className="mt-6 flex flex-col items-center">
          {/* Wax seal stamp */}
          <div className="relative flex h-32 w-32 shrink-0 animate-stamp items-center justify-center rounded-full border-[3px] border-brass bg-gradient-to-br from-brass-light to-brass shadow-[0_6px_18px_rgba(201,162,39,0.45)]">
            <div className="absolute inset-2 rounded-full border border-dashed border-ink/30" />
            <div className="text-center leading-tight">
              <div className="font-display text-2xl font-bold text-ink">{top.name}</div>
              <div className="font-mono text-[10px] tracking-wide text-ink/70">{top.score}% MATCH</div>
            </div>
          </div>
          <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-charcoal/40">
            Top Recommended Branch
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3">
          {branches.map((b, i) => (
            <div
              key={b.name}
              className={`border px-3 py-3 text-center ${
                i === 0 ? 'border-redpen bg-redpen/5' : 'border-charcoal/20'
              }`}
            >
              <div className="font-mono text-[9px] uppercase tracking-widest text-charcoal/40">
                Rank {i + 1}
              </div>
              <div className="mt-1 font-display text-lg font-semibold text-charcoal">{b.name}</div>
              <div className="font-mono text-xs text-charcoal/50">{b.score}%</div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-charcoal/50">
            Aptitude Spread
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(35,38,43,0.15)" />
                <PolarAngleAxis dataKey="branch" tick={{ fontSize: 10, fill: '#23262B', fontFamily: 'JetBrains Mono' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: '#23262B99' }} />
                <Radar name="Match %" dataKey="score" stroke="#B23A2E" fill="#B23A2E" fillOpacity={0.25} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-8 border-t-2 border-charcoal/70 pt-5">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-charcoal/50">
            Remarks of the Evaluator
          </div>
          <p className="whitespace-pre-line font-display text-base leading-relaxed text-charcoal">
            {ai_summary}
          </p>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-dashed border-charcoal/30 pt-4 font-mono text-[9px] uppercase tracking-[0.15em] text-charcoal/30">
          <span>Not valid for JEE / EAMCET counselling</span>
          <span>Issued by BranchSense</span>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button className="flex-1 rounded-sm border-2 border-brass py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-brass hover:bg-brass/10">
          Download PDF
        </button>
        <button className="flex-1 rounded-sm border-2 border-brass py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-brass hover:bg-brass/10">
          Share result
        </button>
      </div>
      <button onClick={onRestart} className="mt-4 w-full text-center font-mono text-[11px] uppercase tracking-widest text-paper/40 underline">
        Start a new attempt
      </button>
    </div>
  );
}
