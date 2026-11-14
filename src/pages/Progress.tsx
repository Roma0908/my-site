import React from 'react';
import { useApp } from '../state/AppContext';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { CheckCircle2, TrendingUp } from 'lucide-react';

export const Progress: React.FC = () => {
  const { careers, profile, completeModule, lang, t } = useApp();

  const allModules = careers.flatMap((c) => c.modules);
  const completedMods = allModules.filter((m) => profile.completedModules.includes(m.id));

  const chartData =
    profile.history.length > 0
      ? profile.history
      : [{ date: 'Start', label: 'Initial', bayesScore: 50, mlScore: 50 }];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-600" /> Progress & Fit Trajectory
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          As you complete modules, your skill levels increase and both AI models recalculate your career fit in real time.
        </p>

        <div className="h-72 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="mlScore"
                name="ML Softmax Fit (%)"
                stroke="#10b981"
                strokeWidth={2.5}
              />
              <Line
                type="monotone"
                dataKey="bayesScore"
                name="Bayesian Fit (%)"
                stroke="#4f46e5"
                strokeWidth={2.5}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
        <h2 className="font-bold text-sm mb-3">
          Completed Learning Modules ({completedMods.length})
        </h2>
        {completedMods.length === 0 ? (
          <p className="text-xs text-slate-500">
            No modules completed yet. Go to Study Plan or click below to mark a module done.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {completedMods.map((m) => (
              <span
                key={m.id}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> {m.title[lang]} ({t.skills[m.skillId]} → {m.targetLevel}/5)
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
        <h2 className="font-bold text-sm mb-3">Available Modules Catalog</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {allModules.slice(0, 9).map((m) => {
            const done = profile.completedModules.includes(m.id);
            return (
              <div
                key={m.id}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2"
              >
                <div>
                  <div className="text-xs font-bold">{m.title[lang]}</div>
                  <div className="text-[11px] text-slate-500">
                    {t.skills[m.skillId]} → {m.targetLevel}/5
                  </div>
                </div>
                <button
                  disabled={done}
                  onClick={() => completeModule(m)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    done
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {done ? t.common.completed : t.common.markDone}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
