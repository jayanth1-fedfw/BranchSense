import { useEffect, useState } from 'react';
import Onboarding from './screens/Onboarding';
import SubjectSelection from './screens/SubjectSelection';
import TopicMarksInput from './screens/TopicMarksInput';
import LoadingScreen from './screens/LoadingScreen';
import ResultCard from './screens/ResultCard';
import { api } from './api/client';

const STEPS = [
  { key: 'onboarding', label: 'DETAILS' },
  { key: 'subjects', label: 'SUBJECTS' },
  { key: 'marks', label: 'MARKS' },
  { key: 'loading', label: 'EVALUATION' },
  { key: 'result', label: 'RESULT' },
];

export default function App() {
  const [step, setStep] = useState('onboarding');
  const [studentId, setStudentId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [apiUrl, setApiUrl] = useState('');
  const [apiStatus, setApiStatus] = useState('idle');

  const stepIndex = STEPS.findIndex((s) => s.key === step);

  useEffect(() => {
    setApiUrl(api.getApiBaseUrl());
  }, []);

  async function handleSaveApiUrl() {
    const trimmed = apiUrl.trim();
    if (!trimmed) return;
    api.setApiBaseUrl(trimmed);
    setApiStatus('saved');
    setError(null);
  }

  async function handleTestConnection() {
    const trimmed = apiUrl.trim();
    if (trimmed) {
      api.setApiBaseUrl(trimmed);
    }

    setApiStatus('testing');
    try {
      await api.checkHealth();
      setApiStatus('connected');
      setError(null);
    } catch (err) {
      setApiStatus('failed');
      setError(`Backend connection failed: ${err.message}`);
    }
  }

  async function handleOnboardingComplete(formData) {
    setError(null);
    try {
      const { student_id } = await api.registerStudent(formData);
      setStudentId(student_id);
      setProfile(formData);
      setStep('subjects');
    } catch (err) {
      setError(err.message);
    }
  }

  function handleSubjectsComplete(subjects) {
    setSelectedSubjects(subjects);
    setStep('marks');
  }

  async function handleMarksComplete(scores) {
    setError(null);
    setStep('loading');
    try {
      await api.submitScores(studentId, scores);
      const recommendation = await api.getRecommendation(studentId);
      setResult(recommendation);
      setStep('result');
    } catch (err) {
      setError(err.message);
      setStep('marks');
    }
  }

  function handleRestart() {
    setStep('onboarding');
    setStudentId(null);
    setProfile(null);
    setSelectedSubjects([]);
    setResult(null);
    setError(null);
  }

  return (
    <div className="min-h-screen font-sans">
      {/* Hall-ticket header strip */}
      <header className="border-b-4 border-brass bg-ink">
        <div className="mx-auto max-w-3xl px-5 py-4 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-semibold text-paper tracking-tight">
              BranchSense
            </span>
            <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-[0.2em] text-brass">
              Admit Card · Engineering Aptitude
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-paper/50">
            Roll No. {studentId ? studentId.slice(0, 8) : '— — — — —'}
          </span>
        </div>

        {/* Perforated progress stubs */}
        <div className="mx-auto max-w-3xl px-5 pb-3">
          <div className="flex gap-1.5">
            {STEPS.map((s, i) => (
              <div key={s.key} className="flex-1">
                <div
                  className={`h-1.5 rounded-full transition-colors ${
                    i <= stepIndex ? 'bg-brass' : 'bg-paper/15'
                  }`}
                />
                <div
                  className={`mt-1 hidden sm:block font-mono text-[9px] tracking-[0.15em] ${
                    i <= stepIndex ? 'text-brass' : 'text-paper/30'
                  }`}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        <section className="mb-6 rounded-sm border border-paper/15 bg-ink-2/70 p-4 text-paper shadow-lg">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
            <div className="flex-1">
              <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-brass">
                Backend API URL
              </label>
              <input
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="mt-1 w-full rounded-sm border border-paper/20 bg-ink px-3 py-2 font-mono text-sm text-paper outline-none focus:border-brass"
                placeholder="https://your-backend.onrender.com/api"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSaveApiUrl}
                className="rounded-sm border border-brass px-4 py-2 font-mono text-xs uppercase tracking-widest text-brass hover:bg-brass/10"
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleTestConnection}
                className="rounded-sm bg-brass px-4 py-2 font-mono text-xs uppercase tracking-widest text-ink hover:opacity-90"
              >
                Test Connection
              </button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-paper/60">
            <span>Current: {api.getApiBaseUrl()}</span>
            <span className="text-paper/30">|</span>
            <span>
              Status:{' '}
              {apiStatus === 'idle' && 'not tested'}
              {apiStatus === 'saved' && 'saved'}
              {apiStatus === 'testing' && 'testing...'}
              {apiStatus === 'connected' && 'connected'}
              {apiStatus === 'failed' && 'failed'}
            </span>
          </div>
        </section>

        {error && (
          <div className="mb-6 rounded-md border-2 border-redpen bg-redpen/10 px-4 py-3 font-mono text-sm text-redpen">
            ✕ {error}
          </div>
        )}

        {step === 'onboarding' && <Onboarding onComplete={handleOnboardingComplete} />}

        {step === 'subjects' && (
          <SubjectSelection stream={profile?.stream} onComplete={handleSubjectsComplete} />
        )}

        {step === 'marks' && (
          <TopicMarksInput subjects={selectedSubjects} onComplete={handleMarksComplete} />
        )}

        {step === 'loading' && <LoadingScreen />}

        {step === 'result' && result && (
          <ResultCard result={result} studentName={profile?.name} onRestart={handleRestart} />
        )}
      </main>

      <footer className="mx-auto max-w-3xl px-5 pb-8 text-center font-mono text-[10px] tracking-[0.2em] text-paper/25">
        THIS ADMIT CARD MUST BE PRESENTED AT THE TIME OF COUNSELLING
      </footer>
    </div>
  );
}
