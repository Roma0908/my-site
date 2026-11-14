import React from 'react';
import { useApp } from '../state/AppContext';
import { INTEREST_KEYS } from '../ai/ml/dataset';
import { APTITUDE_ORDER } from '../ai/bayes/network';
import { Network } from 'lucide-react';

export const BayesExplorer: React.FC = () => {
  const { profile, updateProfile, bayesResults, careers, lang, t } = useApp();
  const sampleApt = bayesResults[0]?.aptitudePosteriors ?? {
    analytical: 0,
    creative: 0,
    social: 0,
    technical: 0
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Network className="w-5 h-5 text-indigo-600" /> Bayesian Network Explorer (Exact Inference by Enumeration)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Move any interest slider below to observe real-time belief propagation through the 4 latent aptitude nodes (2⁴ = 16 states) to all 12 careers.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
          {INTEREST_KEYS.map((key) => (
            <div key={key} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>{t.interests[key]}</span>
                <span className="text-indigo-600 dark:text-indigo-400">
                  {t.interestLevels[profile.interests[key]]}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={3}
                step={1}
                value={profile.interests[key]}
                onChange={(e) =>
                  updateProfile({
                    ...profile,
                    interests: { ...profile.interests, [key]: Number(e.target.value) }
                  })
                }
                className="w-full accent-indigo-600"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
        <h2 className="font-bold text-sm mb-3">Layer 2: Latent Binary Aptitude Posteriors P(Aptitude=1 | Evidence)</h2>
        <div className="grid sm:grid-cols-4 gap-4">
          {APTITUDE_ORDER.map((apt) => {
            const p = sampleApt[apt];
            return (
              <div key={apt} className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900">
                <div className="text-xs font-semibold">{t.aptitudes[apt]}</div>
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                  {(p * 100).toFixed(1)}%
                </div>
                <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-indigo-600" style={{ width: `${p * 100}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
        <h2 className="font-bold text-sm mb-3">Layer 3: Career Fit Posteriors P(Fit=high | Evidence)</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[...bayesResults]
            .sort((a, b) => b.probability - a.probability)
            .map((res) => {
              const c = careers.find((x) => x.id === res.careerId)!;
              return (
                <div key={res.careerId} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span>{c.title[lang]}</span>
                    <span className="text-indigo-600 dark:text-indigo-400">
                      {(res.probability * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 transition-all duration-200"
                      style={{ width: `${res.probability * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
