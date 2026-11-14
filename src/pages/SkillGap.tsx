import React from 'react';
import { useApp } from '../state/AppContext';
import { SKILL_KEYS } from '../ai/ml/dataset';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

export const SkillGap: React.FC = () => {
  const { careers, selectedCareerId, setSelectedCareerId, profile, lang, t } = useApp();
  const career = careers.find((c) => c.id === selectedCareerId) ?? careers[0];

  const rows = SKILL_KEYS.map((sk) => {
    const required = career.skills[sk] ?? 0;
    const current = profile.skills[sk] ?? 0;
    const gap = Math.max(0, required - current);
    return {
      skillId: sk,
      name: t.skills[sk],
      required,
      current,
      gap
    };
  })
    .filter((r) => r.required > 0 || r.current > 0)
    .sort((a, b) => b.gap - a.gap);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold">Skill Gap Analysis</h1>
          <p className="text-xs text-slate-500">Required vs. Current levels prioritized by gap size</p>
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

      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} margin={{ top: 10, right: 20, left: 0, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="name" angle={-25} textAnchor="end" interval={0} tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Legend verticalAlign="top" />
            <Bar dataKey="current" name="Current Level" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="required" name="Required Level" fill="#4f46e5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rows
          .filter((r) => r.gap > 0)
          .map((r) => (
            <div
              key={r.skillId}
              className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-amber-300/60 dark:border-amber-800/60"
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm">{r.name}</span>
                <span className="px-2 py-0.5 text-xs font-bold rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  Gap: -{r.gap}
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-2">
                Current: <strong>{r.current}/5</strong> → Target: <strong>{r.required}/5</strong>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
