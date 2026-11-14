import React, { useState } from 'react';
import { useApp } from '../state/AppContext';
import { INTEREST_KEYS, SKILL_KEYS } from '../ai/ml/dataset';
import { InterestId, SkillId } from '../types';
import { Download, Upload, UserCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

export const Onboarding: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const { profile, updateProfile, applyPreset, t, recordSnapshot } = useApp();
  const [blockedText, setBlockedText] = useState(profile.constraints.blockedWeeks.join(', '));
  const [errors, setErrors] = useState<string[]>([]);
  const [savedToast, setSavedToast] = useState(false);

  const handleInterestChange = (key: InterestId, val: number) => {
    updateProfile({
      ...profile,
      interests: { ...profile.interests, [key]: val }
    });
  };

  const handleSkillChange = (key: SkillId, val: number) => {
    updateProfile({
      ...profile,
      skills: { ...profile.skills, [key]: val }
    });
  };

  const validateAndSave = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: string[] = [];
    const { hoursPerWeek, maxModulesPerWeek, deadlineWeeks } = profile.constraints;

    if (!profile.name.trim()) errs.push('Name is required.');
    if (hoursPerWeek < 1 || hoursPerWeek > 60) errs.push('Hours/week must be between 1 and 60.');
    if (maxModulesPerWeek < 1 || maxModulesPerWeek > 6) errs.push('Max modules/week must be between 1 and 6.');
    if (deadlineWeeks < 1 || deadlineWeeks > 52) errs.push('Deadline must be between 1 and 52 weeks.');

    const parsedBlocked: number[] = [];
    if (blockedText.trim()) {
      for (const part of blockedText.split(',')) {
        const n = Number(part.trim());
        if (!Number.isInteger(n) || n < 1 || n > deadlineWeeks) {
          errs.push(`Invalid blocked week "${part.trim()}". Must be 1..${deadlineWeeks}.`);
        } else if (!parsedBlocked.includes(n)) {
          parsedBlocked.push(n);
        }
      }
    }

    setErrors(errs);
    if (errs.length === 0) {
      updateProfile({
        ...profile,
        constraints: { ...profile.constraints, blockedWeeks: parsedBlocked }
      });
      recordSnapshot('Assessment');
      setSavedToast(true);
      setTimeout(() => {
        setSavedToast(false);
        onDone();
      }, 600);
    }
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(profile, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'careerpath-profile.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        if (!data.interests || !data.skills || !data.constraints) {
          setErrors(['Invalid JSON profile schema.']);
          return;
        }
        updateProfile(data);
        setBlockedText((data.constraints.blockedWeeks || []).join(', '));
        setErrors([]);
      } catch {
        setErrors(['Failed to parse JSON file.']);
      }
    };
    reader.readAsText(file);
  };

  return (
    <form onSubmit={validateAndSave} className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
            <UserCheck className="w-4 h-4" /> {t.common.presets}:
          </span>
          {(['ai_student', 'creative_lead', 'industrial_eng'] as const).map((k) => (
            <button
              type="button"
              key={k}
              onClick={() => {
                applyPreset(k);
                setBlockedText(k === 'ai_student' ? '4' : k === 'creative_lead' ? '3' : '');
                setErrors([]);
              }}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 hover:bg-indigo-100 dark:bg-slate-800 dark:hover:bg-indigo-950 transition"
            >
              {k === 'ai_student' ? 'Айдар (AI/Tech)' : k === 'creative_lead' ? 'Мадина (UX/Product)' : 'Ерлан (Engineering)'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 flex items-center gap-1 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Download className="w-3.5 h-3.5" /> {t.common.exportJson}
          </button>
          <label className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 flex items-center gap-1 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
            <Upload className="w-3.5 h-3.5" /> {t.common.importJson}
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-sm space-y-1">
          {errors.map((err, i) => (
            <div key={i} className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> {err}
            </div>
          ))}
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
        <label className="block text-sm font-semibold mb-2">Student Name</label>
        <input
          type="text"
          value={profile.name}
          onChange={(e) => updateProfile({ ...profile, name: e.target.value })}
          className="w-full max-w-md px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
        />
      </div>

      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-bold mb-4">1. Interests (Bayesian Evidence Nodes: 0–3)</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {INTEREST_KEYS.map((key) => (
            <div key={key} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
              <div className="flex justify-between text-sm font-medium mb-2">
                <span>{t.interests[key]}</span>
                <span className="text-indigo-600 dark:text-indigo-400">
                  {t.interestLevels[profile.interests[key]]}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[0, 1, 2, 3].map((lvl) => (
                  <button
                    type="button"
                    key={lvl}
                    onClick={() => handleInterestChange(key, lvl)}
                    className={`py-1.5 text-xs rounded font-medium transition ${
                      profile.interests[key] === lvl
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-bold mb-4">2. Current Skill Self-Rating (0–5)</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SKILL_KEYS.map((key) => (
            <div key={key} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
              <div className="flex justify-between text-sm mb-1">
                <span>{t.skills[key]}</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {profile.skills[key]} / 5
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={5}
                step={1}
                value={profile.skills[key]}
                onChange={(e) => handleSkillChange(key, Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-bold mb-4">3. Study Plan Constraints (CSP Solver)</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium mb-1">{t.common.hoursPerWeek}</label>
            <input
              type="number"
              min={1}
              max={60}
              value={profile.constraints.hoursPerWeek}
              onChange={(e) =>
                updateProfile({
                  ...profile,
                  constraints: { ...profile.constraints, hoursPerWeek: Number(e.target.value) }
                })
              }
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">{t.common.maxModules}</label>
            <input
              type="number"
              min={1}
              max={6}
              value={profile.constraints.maxModulesPerWeek}
              onChange={(e) =>
                updateProfile({
                  ...profile,
                  constraints: { ...profile.constraints, maxModulesPerWeek: Number(e.target.value) }
                })
              }
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">{t.common.deadlineWeeks}</label>
            <input
              type="number"
              min={1}
              max={52}
              value={profile.constraints.deadlineWeeks}
              onChange={(e) =>
                updateProfile({
                  ...profile,
                  constraints: { ...profile.constraints, deadlineWeeks: Number(e.target.value) }
                })
              }
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">{t.common.blockedWeeks}</label>
            <input
              type="text"
              value={blockedText}
              onChange={(e) => setBlockedText(e.target.value)}
              placeholder="e.g. 3, 6"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm transition"
        >
          {t.common.save} & View Results
        </button>
        {savedToast && (
          <span className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
            <CheckCircle2 className="w-4 h-4" /> Saved!
          </span>
        )}
      </div>
    </form>
  );
};
