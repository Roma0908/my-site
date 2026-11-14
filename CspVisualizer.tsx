import React, { useEffect, useState } from 'react';
import { useApp } from '../state/AppContext';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';

export const CspVisualizer: React.FC = () => {
  const { cspResult, t } = useApp();
  const steps = cspResult.smart.steps;
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setStepIdx(0);
    setPlaying(false);
  }, [steps]);

  useEffect(() => {
    if (!playing) return;
    if (stepIdx >= steps.length - 1) {
      setPlaying(false);
      return;
    }
    const timer = setTimeout(() => setStepIdx((s) => s + 1), 450);
    return () => clearTimeout(timer);
  }, [playing, stepIdx, steps.length]);

  const currentStep = steps[stepIdx];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold">CSP Search Visualizer (MRV + Forward Checking)</h1>
          <p className="text-xs text-slate-500">
            Step through variable assignments, forward-checking domain pruning, and backtracks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setStepIdx(0)}
            className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPlaying(!playing)}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold flex items-center gap-1.5"
          >
            {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {playing ? t.common.pause : t.common.play}
          </button>
          <button
            onClick={() => setStepIdx((s) => Math.min(steps.length - 1, s + 1))}
            disabled={stepIdx >= steps.length - 1}
            className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold flex items-center gap-1 disabled:opacity-40"
          >
            <SkipForward className="w-4 h-4" /> {t.common.step}
          </button>
        </div>
      </div>

      {currentStep ? (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex justify-between text-xs font-semibold">
              <span>
                Step {stepIdx + 1} / {steps.length}
              </span>
              <span
                className={`px-2 py-0.5 rounded uppercase ${
                  currentStep.action === 'assign'
                    ? 'bg-emerald-100 text-emerald-700'
                    : currentStep.action === 'backtrack'
                    ? 'bg-rose-100 text-rose-700'
                    : currentStep.action === 'prune'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-indigo-100 text-indigo-700'
                }`}
              >
                {currentStep.action}
              </span>
            </div>
            <p className="text-sm font-medium">{currentStep.reason}</p>

            <div className="pt-2">
              <div className="text-xs font-bold text-slate-500 mb-2">Partial Assignment Map:</div>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(currentStep.assignmentSnapshot).map(([modId, wk]) => (
                  <div
                    key={modId}
                    className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-xs flex justify-between font-mono"
                  >
                    <span>{modId}</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">Week {wk}</span>
                  </div>
                ))}
                {Object.keys(currentStep.assignmentSnapshot).length === 0 && (
                  <span className="text-xs text-slate-400">Empty assignment {}</span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 max-h-96 overflow-y-auto space-y-1.5 font-mono text-xs">
            {steps.map((st, idx) => (
              <div
                key={st.step}
                onClick={() => setStepIdx(idx)}
                className={`p-2 rounded cursor-pointer ${
                  idx === stepIdx
                    ? 'bg-indigo-600 text-white'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                [{st.step}] ({st.action.toUpperCase()}) {st.reason}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm text-slate-500">
          All skill gaps for the selected career are already closed! Select another career or reset skills in Assessment.
        </div>
      )}
    </div>
  );
};
