import React, { useState } from 'react';
import { useApp } from '../state/AppContext';
import { SKILL_KEYS } from '../ai/ml/dataset';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b'];

export const Compare: React.FC = () => {
  const { careers, profile, bayesResults, mlPredictions, lang, t } = useApp();
  const [selectedIds, setSelectedIds] = useState<string[]>([
    'software_dev',
    'data_analyst',
    'ml_engineer'
  ]);

  const toggleCareer = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 2) setSelectedIds(selectedIds.filter((x) => x !== id));
    } else if (selectedIds.length < 3) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectedCareers = selectedIds
    .map((id) => careers.find((c) => c.id === id)!)
    .filter(Boolean);

  const radarSkills = SKILL_KEYS.slice(0, 8);
  const radarData = radarSkills.map((sk) => {
    const row: Record<string, string | number> = {
      skill: t.skills[sk],
      You: profile.skills[sk] ?? 0
    };
    selectedCareers.forEach((c) => {
      row[c.title[lang]] = c.skills[sk] ?? 0;
    });
    return row;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
        <h1 className="text-xl font-bold mb-2">Career Comparison (Select 2–3)</h1>
        <div className="flex flex-wrap gap-2 mt-3">
          {careers.map((c) => {
            const active = selectedIds.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => toggleCareer(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                  active
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                }`}
              >
                {c.title[lang]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {selectedCareers.map((c, idx) => {
          const bayes = bayesResults.find((b) => b.careerId === c.id)?.probability ?? 0;
          const ml = mlPredictions.find((m) => m.careerId === c.id)?.probability ?? 0;
          const totalGap = SKILL_KEYS.reduce(
            (acc, sk) => acc + Math.max(0, (c.skills[sk] ?? 0) - (profile.skills[sk] ?? 0)),
            0
          );
          const remainingHours = c.modules
            .filter((m) => !profile.completedModules.includes(m.id))
            .reduce((acc, m) => acc + m.hours, 0);
          const estWeeks = Math.ceil(remainingHours / Math.max(1, profile.constraints.hoursPerWeek));

          return (
            <div
              key={c.id}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border-2"
              style={{ borderColor: COLORS[idx] }}
            >
              <h2 className="font-bold text-lg">{c.title[lang]}</h2>
              <div className="mt-3 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Bayes Fit:</span>
                  <span className="font-bold">{(bayes * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ML Probability:</span>
                  <span className="font-bold">{(ml * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Skill Gap Points:</span>
                  <span className="font-bold text-amber-600">{totalGap} pts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Est. Weeks to Readiness:</span>
                  <span className="font-bold text-indigo-600">{estWeeks} weeks</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 h-96">
        <h3 className="font-bold text-sm mb-2">Skill Profile Radar</h3>
        <ResponsiveContainer width="100%" height="90%">
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11 }} />
            <PolarRadiusAxis angle={30} domain={[0, 5]} />
            <Radar name="You" dataKey="You" stroke="#64748b" fill="#64748b" fillOpacity={0.25} />
            {selectedCareers.map((c, idx) => (
              <Radar
                key={c.id}
                name={c.title[lang]}
                dataKey={c.title[lang]}
                stroke={COLORS[idx]}
                fill={COLORS[idx]}
                fillOpacity={0.15}
              />
            ))}
            <Tooltip />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
