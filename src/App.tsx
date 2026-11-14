import React, { useState, useRef, useEffect } from 'react';
import { AppProvider, useApp } from './state/AppContext';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { Compare } from './pages/Compare';
import { SkillGap } from './pages/SkillGap';
import { StudyPlan } from './pages/StudyPlan';
import { Progress } from './pages/Progress';
import { BayesExplorer } from './pages/BayesExplorer';
import { ModelLab } from './pages/ModelLab';
import { CspVisualizer } from './pages/CspVisualizer';
import { HowItWorks } from './pages/HowItWorks';
import { Compass, Moon, Sun, ShieldAlert, ChevronDown, Cpu } from 'lucide-react';
import { Lang } from './types';

const Shell: React.FC = () => {
  const { lang, setLang, t, darkMode, setDarkMode } = useApp();
  const [tab, setTab] = useState<string>('dashboard');
  const [labOpen, setLabOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Основные вкладки для пользователей
  const mainNavItems = [
    { id: 'onboarding', label: t.nav.onboarding },
    { id: 'dashboard', label: t.nav.dashboard },
    { id: 'compare', label: t.nav.compare },
    { id: 'skillGap', label: t.nav.skillGap },
    { id: 'studyPlan', label: t.nav.studyPlan },
    { id: 'progress', label: t.nav.progress },
  ];

  // Инженерные и справочные вкладки в выпадающем меню
  const labNavItems = [
    { id: 'bayes', label: t.nav.bayes },
    { id: 'ml', label: t.nav.ml },
    { id: 'csp', label: t.nav.csp },
    { id: 'howItWorks', label: t.nav.howItWorks },
  ];

  const isLabActive = labNavItems.some((item) => item.id === tab);

  const labButtonText = {
    kk: 'AI Зертхана',
    ru: 'AI Лаборатория',
    en: 'AI Lab',
  }[lang];

  // Закрытие выпадающего меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLabOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => setTab('dashboard')}
            className="flex items-center gap-2.5 text-left hover:opacity-90 transition"
          >
            <div className="p-2 rounded-xl bg-indigo-600 text-white">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-base leading-tight">{t.appName}</div>
              <div className="text-[11px] text-slate-500 hidden sm:block">{t.tagline}</div>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden text-xs font-semibold">
              {(['kk', 'ru', 'en'] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2.5 py-1 uppercase transition ${
                    lang === l
                      ? 'bg-indigo-600 text-white'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle theme"
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <nav className="max-w-7xl mx-auto px-4 pb-2 flex flex-wrap items-center gap-1.5">
          {mainNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setTab(item.id);
                setLabOpen(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                tab === item.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}

          {/* Выпадающее меню для ML-моделей и справки */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setLabOpen((prev) => !prev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                isLabActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 bg-slate-100/70 dark:bg-slate-800/70 hover:bg-slate-200/70 dark:hover:bg-slate-800'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>{labButtonText}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${labOpen ? 'rotate-180' : ''}`} />
            </button>

            {labOpen && (
              <div className="absolute left-0 sm:left-auto sm:right-0 mt-1.5 w-48 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg py-1.5 z-30">
                {labNavItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setTab(item.id);
                      setLabOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-medium transition ${
                      tab === item.id
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {tab === 'onboarding' && <Onboarding onDone={() => setTab('dashboard')} />}
        {tab === 'dashboard' && <Dashboard onNavigate={setTab} />}
        {tab === 'compare' && <Compare />}
        {tab === 'skillGap' && <SkillGap />}
        {tab === 'studyPlan' && <StudyPlan />}
        {tab === 'progress' && <Progress />}
        {tab === 'bayes' && <BayesExplorer />}
        {tab === 'ml' && <ModelLab />}
        {tab === 'csp' && <CspVisualizer />}
        {tab === 'howItWorks' && <HowItWorks />}
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-4 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0 text-amber-500" />
          <span>{t.disclaimer}</span>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
