import React from 'react';
import { useApp } from '../state/AppContext';
import { Calendar, AlertTriangle, CheckCircle, Cpu } from 'lucide-react';

export const StudyPlan: React.FC = () => {
  const {
    careers,
    selectedCareerId,
    setSelectedCareerId,
    profile,
    updateProfile,
    targetModules,
    cspResult,
    completeModule,
    lang,
    t
  } = useApp();

  const career = careers.find((c) => c.id === selectedCareerId) ?? careers[0];
  const { smart, plain } = cspResult;

  const weeksArray = Array.from({ length: profile.constraints.deadlineWeeks }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" /> Personal Weekly Study Plan (CSP)
            </h1>
            <p className="text-xs text-slate-500">
              Scheduled automatically using Backtracking + MRV + Degree Heuristic + Forward Checking
            </p>
          </div>
          <select
            value={career.id}
            onChange={(e) => setSelectedCareerId(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm font-medium"
          >
            {careers.map((c) => (
              <option key={c.id} value={c.id} className="dark:bg-slate-900">
                {c.title[lang]}
              </option>
            ))}
          </select>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="block text-xs text-slate-500 mb-1">{t.common.hoursPerWeek}</label>
            <input
              type="number"
              min={1}
              max={60}
              value={profile.constraints.hoursPerWeek}
              onChange={(e) =>
                updateProfile({
                  ...profile,
                  constraints: { ...profile.constraints, hoursPerWeek: Math.max(1, Number(e.target.value)) }
                })
              }
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">{t.common.maxModules}</label>
            <input
              type="number"
              min={1}
              max={6}
              value={profile.constraints.maxModulesPerWeek}
              onChange={(e) =>
                updateProfile({
                  ...profile,
                  constraints: { ...profile.constraints, maxModulesPerWeek: Math.max(1, Number(e.target.value)) }
                })
              }
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">{t.common.deadlineWeeks}</label>
            <input
              type="number"
              min={1}
              max={52}
              value={profile.constraints.deadlineWeeks}
              onChange={(e) =>
                updateProfile({
                  ...profile,
                  constraints: { ...profile.constraints, deadlineWeeks: Math.max(1, Number(e.target.value)) }
                })
              }
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent text-sm"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5" /> MRV + Forward Checking:
            </span>
            <span>
              Nodes: <strong>{smart.nodesExplored}</strong> | Backtracks: <strong>{smart.backtracks}</strong> | {smart.elapsedMs}ms
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-600 dark:text-slate-400">Plain Backtracking:</span>
            <span>
              Nodes: <strong>{plain.nodesExplored}</strong> | Backtracks: <strong>{plain.backtracks}</strong> | {plain.elapsedMs}ms
            </span>
          </div>
        </div>
      </div>

      {!smart.solved && (
        <div className="p-5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 space-y-2">
          <div className="flex items-center gap-2 font-bold text-red-700 dark:text-red-300">
            <AlertTriangle className="w-5 h-5" /> Infeasible Schedule Detected
          </div>
          <p className="text-sm text-red-700 dark:text-red-300">
            <strong>Conflict:</strong> {smart.conflictReason}
          </p>
          <p className="text-sm text-emerald-700 dark:text-emerald-300">
            <strong>Suggested Relaxation:</strong> {smart.relaxationSuggestion}
          </p>
        </div>
      )}

      {smart.solved && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {weeksArray.map((week) => {
            const isBlocked = profile.constraints.blockedWeeks.includes(week);
            const modsInWeek = targetModules.filter((m) => smart.assignment[m.id] === week);
            const totalHours = modsInWeek.reduce((s, m) => s + m.hours, 0);

            return (
              <div
                key={week}
                className={`p-4 rounded-2xl border ${
                  isBlocked
                    ? 'bg-slate-100/70 dark:bg-slate-900/40 border-dashed border-slate-300 dark:border-slate-700 opacity-75'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-sm">
                    {t.common.week} {week}
                  </span>
                  {isBlocked ? (
                    <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      Blocked (Exam/Holiday)
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500">
                      {totalHours} / {profile.constraints.hoursPerWeek} {t.common.hours}
                    </span>
                  )}
                </div>

                {modsInWeek.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No modules scheduled</p>
                ) : (
                  <div className="space-y-2.5">
                    {modsInWeek.map((m) => (
                      <div
                        key={m.id}
                        className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900"
                      >
                        <div className="font-semibold text-sm">{m.title[lang]}</div>
                        <div className="text-xs text-slate-500 mt-1 flex justify-between">
                          <span>
                            {m.hours}
                            {t.common.hours} • {t.common.diffLabels[m.difficulty]}
                          </span>
                          <span>
                            {t.skills[m.skillId]} → {m.targetLevel}/5
                          </span>
                        </div>
                        <button
                          onClick={() => completeModule(m)}
                          className="mt-2 w-full py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1 transition"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> {t.common.markDone}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
