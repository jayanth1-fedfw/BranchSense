export default function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center animate-riseIn">
      <div className="relative flex h-28 w-28 items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-brass/20" />
        <div className="absolute inset-0 rounded-full border-4 border-t-brass border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        <span className="font-display text-3xl text-brass">✓</span>
      </div>
      <p className="mt-8 font-display text-2xl font-semibold text-paper animate-inkPulse">
        Your answer sheet is under evaluation
      </p>
      <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-paper/40">
        Cross-checking topic strengths against 15+ engineering branches
      </p>
    </div>
  );
}
