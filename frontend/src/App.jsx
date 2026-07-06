import { useState, useEffect } from 'react';
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

const NAVIGABLE_STEPS = STEPS.filter((s) => s.key !== 'loading');

export default function App() {
  const [step, setStep] = useState('onboarding');
  const [studentId, setStudentId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [topicsBySubject, setTopicsBySubject] = useState(null);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [furthestStepIndex, setFurthestStepIndex] = useState(0);

  useEffect(() => {
    api
      .getTopics()
      .then((data) => setTopicsBySubject(data.topics_by_subject))
      .catch((err) => setError(`Could not load topic list: ${err.message}`))
      .finally(() => setTopicsLoading(false));
  }, []);

  const stepIndex = STEPS.findIndex((s) => s.key === step);

  function goToStep(key) {
    const targetIndex = STEPS.findIndex((s) => s.key === key);
    if (targetIndex === -1 || targetIndex > furthestStepIndex) return;
    setError(null);
    setStep(key);
  }

  function advanceTo(key) {
    const targetIndex = STEPS.findIndex((s) => s.key === key);
    setFurthestStepIndex((prev) => Math.max(prev, targetIndex));
    setStep(key);
  }

  function goBack() {
    const navIndex = NAVIGABLE_STEPS.findIndex((s) => s.key === step);
    if (navIndex > 0) goToStep(NAVIGABLE_STEPS[navIndex - 1].key);
  }

  async function handleOnboardingComplete(formData) {
    setError(null);
    try {
      const { student_id } = await api.registerStudent(formData);
      setStudentId(student_id);
      setProfile(formData);
      advanceTo('subjects');
    } catch (err) {
      setError(err.message);
    }
  }

  function handleSubjectsComplete(subjects) {
    setSelectedSubjects(subjects);
    advanceTo('marks');
  }

  async function handleMarksComplete(scores) {
    setError(null);
    setStep('loading');
    try {
      await api.submitScores(studentId, scores);
      const recommendation = await api.getRecommendation(studentId);
      setResult(recommendation);
      advanceTo('result');
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
    setFurthestStepIndex(0);
  }

  const canGoBack = NAVIGABLE_STEPS.findIndex((s) => s.key === step) > 0 && step !== 'loading';

  return (
    <div className="min-h-screen font-sans">
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

        <div className="mx-auto max-w-3xl px-5 pb-3">
          <div className="flex gap-1.5">
            {STEPS.map((s, i) => {
              const unlocked = i <= furthestStepIndex && s.key !== 'loading';
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => unlocked && goToStep(s.key)}
                  disabled={!unlocked}
                  className={`flex-1 text-left ${unlocked ? 'cursor-pointer' : 'cursor-default'}`}
                  aria-label={`Go to ${s.label}`}
                >
                  <div
                    className={`h-1.5 rounded-full transition-colors ${
                      i <= stepIndex ? 'bg-brass' : 'bg-paper/15'
                    } ${unlocked && i !== stepIndex ? 'hover:opacity-70' : ''}`}
                  />
                  <div
                    className={`mt-1 hidden sm:block font-mono text-[9px] tracking-[0.15em] ${
                      i <= stepIndex ? 'text-brass' : 'text-paper/30'
                    }`}
                  >
                    {s.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        {canGoBack && (
          <button
            type="button"
            onClick={goBack}
            className="mb-4 flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-paper/50 hover:text-brass"
          >
            ← Back
          </button>
        )}

        {error && (
          <div className="mb-6 rounded-md border-2 border-redpen bg-redpen/10 px-4 py-3 font-mono text-sm text-redpen">
            ✕ {error}
          </div>
        )}

        {step === 'onboarding' && <Onboarding onComplete={handleOnboardingComplete} />}

        {step === 'subjects' && topicsLoading && (
          <p className="text-paper/50 font-mono text-sm">Loading subject list…</p>
        )}

        {step === 'subjects' && !topicsLoading && topicsBySubject && (
          <SubjectSelection
            stream={profile?.stream}
            availableSubjects={Object.keys(topicsBySubject)}
            onComplete={handleSubjectsComplete}
          />
        )}

        {step === 'marks' && topicsBySubject && (
          <TopicMarksInput
            subjects={selectedSubjects}
            topicsBySubject={topicsBySubject}
            onComplete={handleMarksComplete}
          />
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