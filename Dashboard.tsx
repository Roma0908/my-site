import React from 'react';
import { useApp } from '../state/AppContext';
import { Sparkles, Scale, ArrowRight } from 'lucide-react';

export const Dashboard: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const { careers, bayesResults, mlPredictions, lang, t, setSelectedCareerId } = useApp();

  const combined = careers
    .map((c) => {
      const bayes = bayesResults.find((b) => b.careerId === c.id)!;
      const ml = mlPredictions.find((m) => m.careerId === c.id)!;
      const score = 0.5 * bayes.probability + 0.5 * ml.probability;
      return { career: c, bayes, ml, score };
    })
    .sort((a, b) => b.score - a.score);

  const top3 = combined.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="w-6 h-6" /> Top-3 Recommended Careers
        </h1>
        <p className="text-indigo-100 text-sm mt-1">
          Combined inference from our hand-written Bayesian Network (interests → latent aptitudes) and Multinomial Logistic Regression (21-feature profile vector).
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {top3.map(({ career, bayes, ml, score }, idx) => {
          const diff = Math.abs(bayes.probability - ml.probability);
          const disagrees = diff > 0.25;
          const topApt = bayes.topAptitudes[0];

          return (
            <div
              key={career.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    #{idx + 1} Match ({Math.round(score * 100)}%)
                  </span>
                </div>
                <h2 className="text-lg font-bold">{career.title[lang]}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {career.desc[lang]}
                </p>

                <div className="mt-4 space-y-2.5 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span>Bayesian Network P(Fit=high)</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        {(bayes.probability * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600"
                        style={{ width: `${Math.min(100, bayes.probability * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span>ML Softmax Probability</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {(ml.probability * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500"
                        style={{ width: `${Math.min(100, ml.probability * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-xs space-y-1.5">
                  <p className="text-slate-700 dark:text-slate-300">
                    <strong>Why:</strong> Driven primarily by{' '}
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                      {t.aptitudes[topApt.aptitude]}
                    </span>{' '}
                    (+{(topApt.contribution * 100).toFixed(1)}% lift).
                  </p>
                  {disagrees && (
                    <p className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 flex items-start gap-1.5">
                      <Scale className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>
                        <strong>Model Divergence:</strong>{' '}
                        {bayes.probability > ml.probability
                          ? 'Your interests strongly match this role (high Bayes), but your current technical skill ratings are still developing (lower ML).'
                          : 'Your current skill levels already match this role (high ML), even though your stated interests lean elsewhere (lower Bayes).'}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                <button
                  onClick={() => {
                    setSelectedCareerId(career.id);
                    onNavigate('skillGap');
                  }}
                  className="flex-1 py-2 px-3 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition"
                >
                  Skill Gaps
                </button>
                <button
                  onClick={() => {
                    setSelectedCareerId(career.id);
                    onNavigate('studyPlan');
                  }}
                  className="flex-1 py-2 px-3 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-1 transition"
                >
                  Study Plan <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 font-bold text-sm">
          All 12 Careers — Full Model Comparison
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/70 text-xs uppercase text-slate-500">
              <tr>
                <th className="p-3">Career</th>
                <th className="p-3">Bayes P(Fit)</th>
                <th className="p-3">ML Softmax</th>
                <th className="p-3">Combined</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {combined.map(({ career, bayes, ml, score }) => (
                <tr key={career.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-medium">{career.title[lang]}</td>
                  <td className="p-3 text-indigo-600 dark:text-indigo-400 font-semibold">
                    {(bayes.probability * 100).toFixed(1)}%
                  </td>
                  <td className="p-3 text-emerald-600 dark:text-emerald-400 font-semibold">
                    {(ml.probability * 100).toFixed(1)}%
                  </td>
                  <td className="p-3 font-bold">{(score * 100).toFixed(1)}%</td>
                  <td className="p-3">
                    <button
                      onClick={() => {
                        setSelectedCareerId(career.id);
                        onNavigate('studyPlan');
                      }}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                    >
                      Plan →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
