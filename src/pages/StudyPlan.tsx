import React, { useState } from 'react';
import { useApp } from '../state/AppContext';
import {
  FIRST_YEAR_CURRICULUM,
  TRIMESTER_SUMMARIES,
} from '../data/curriculum';
import {
  Calendar,
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertTriangle,
  GraduationCap,
} from 'lucide-react';

export const StudyPlan: React.FC = () => {
  const {
    careers,
    selectedCareerId,
    setSelectedCareerId,
    lang,
    courseStatuses,
    cycleCourseStatus,
  } = useApp();
  const [selectedTrimester, setSelectedTrimester] = useState<1 | 2 | 3>(1);

  const activeCareer =
    careers.find((c) => c.id === selectedCareerId) || careers[0];

  const ui = {
    kk: {
      title: '1-курс оқу жоспары және мансаптық байланыс',
      subtitle:
        'Университет пәндерінің таңдалған мамандыққа әсерін және триместрлік кредит жүктемесін бақылаңыз.',
      targetCareer: 'Мақсатты мамандық:',
      trimesterTab: (n: number) => `${n}-триместр`,
      planned: 'Жоспарда',
      inProgress: 'Оқылуда',
      completed: 'Игерілді',
      creditsUnit: 'кр.',
      relevantBadge: 'Мамандыққа тікелей әсер етеді',
      statusLabels: {
        in_progress: 'Оқылуда',
        planned: 'Жоспарланған',
        completed: 'Игерілді',
      },
      colCode: 'Код',
      colSubject: 'Пән атауы',
      colComp: 'Компонент',
      colCredits: 'Кредит',
      colStatus: 'Мәртебе (басып өзгертіңіз)',
    },
    ru: {
      title: 'Учебный план 1-го курса и связь с карьерой',
      subtitle:
        'Отслеживайте кредитную нагрузку по триместрам и предметы, которые напрямую прокачивают выбранную профессию.',
      targetCareer: 'Целевая профессия:',
      trimesterTab: (n: number) => `${n} триместр`,
      planned: 'В плане',
      inProgress: 'Изучается',
      completed: 'Освоено',
      creditsUnit: 'кр.',
      relevantBadge: 'Профильный для профессии',
      statusLabels: {
        in_progress: 'Изучается',
        planned: 'Запланирована',
        completed: 'Освоено',
      },
      colCode: 'Код',
      colSubject: 'Дисциплина',
      colComp: 'Компонент',
      colCredits: 'Кредиты',
      colStatus: 'Статус (нажмите для смены)',
    },
    en: {
      title: '1st-Year Curriculum & Career Alignment',
      subtitle:
        'Track trimester credit workload and see which university courses directly boost your target career.',
      targetCareer: 'Target Career:',
      trimesterTab: (n: number) => `Trimester ${n}`,
      planned: 'Planned',
      inProgress: 'In Progress',
      completed: 'Completed',
      creditsUnit: 'cr.',
      relevantBadge: 'Core Career Booster',
      statusLabels: {
        in_progress: 'In Progress',
        planned: 'Planned',
        completed: 'Completed',
      },
      colCode: 'Code',
      colSubject: 'Course',
      colComp: 'Comp.',
      colCredits: 'Credits',
      colStatus: 'Status (click to toggle)',
    },
  }[lang];

  const summary = TRIMESTER_SUMMARIES.find(
    (s) => s.trimester === selectedTrimester
  )!;
  const courses = FIRST_YEAR_CURRICULUM.filter(
    (c) => c.trimester === selectedTrimester
  );

  // Живой подсчёт кредитов по глобальным статусам из AppContext
  const dynamicStats = courses.reduce(
    (acc, course) => {
      const st = courseStatuses[course.code] ?? course.defaultStatus;
      acc.total += course.credits;
      if (st === 'in_progress') acc.inProgress += course.credits;
      if (st === 'completed') acc.completed += course.credits;
      return acc;
    },
    { total: 0, inProgress: 0, completed: 0 }
  );

  return (
    <div className="space-y-6">
      {/* Шапка раздела с выбором профессии */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-indigo-600 shrink-0" />
            {ui.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {ui.subtitle}
          </p>
        </div>

        <div className="shrink-0">
          <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">
            {ui.targetCareer}
          </label>
          <select
            value={activeCareer.id}
            onChange={(e) => setSelectedCareerId(e.target.value)}
            className="w-full md:w-64 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {careers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title[lang]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Переключатель триместров */}
      <div className="flex flex-wrap gap-2">
        {TRIMESTER_SUMMARIES.map((trim) => (
          <button
            key={trim.trimester}
            onClick={() => setSelectedTrimester(trim.trimester)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              selectedTrimester === trim.trimester
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>{ui.trimesterTab(trim.trimester)}</span>
            <span className="opacity-75 font-normal">({trim.period[lang]})</span>
          </button>
        ))}
      </div>

      {/* Сводка по кредитам и предупреждение о нагрузке */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500">{ui.planned}</div>
          <div className="text-2xl font-extrabold mt-1">
            {dynamicStats.total}{' '}
            <span className="text-sm font-normal">{ui.creditsUnit}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500">{ui.inProgress}</div>
          <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
            {dynamicStats.inProgress}{' '}
            <span className="text-sm font-normal">{ui.creditsUnit}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500">{ui.completed}</div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            {dynamicStats.completed}{' '}
            <span className="text-sm font-normal">{ui.creditsUnit}</span>
          </div>
        </div>

        <div
          className={`p-4 rounded-xl border flex items-start gap-2.5 text-xs ${
            selectedTrimester === 2
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
              : 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300'
          }`}
        >
          {selectedTrimester === 2 ? (
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          ) : (
            <BookOpen className="w-4 h-4 shrink-0 mt-0.5" />
          )}
          <span>{summary.workloadNote[lang]}</span>
        </div>
      </div>

      {/* Таблица дисциплин триместра */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/70 text-xs uppercase text-slate-500">
              <tr>
                <th className="p-3.5">{ui.colCode}</th>
                <th className="p-3.5">{ui.colSubject}</th>
                <th className="p-3.5">{ui.colComp}</th>
                <th className="p-3.5">{ui.colCredits}</th>
                <th className="p-3.5">{ui.colStatus}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {courses.map((course) => {
                const isRelevant = course.boostsCareers.includes(
                  activeCareer.id
                );
                const status =
                  courseStatuses[course.code] ?? course.defaultStatus;

                return (
                  <tr
                    key={course.code}
                    className={`transition ${
                      isRelevant
                        ? 'bg-indigo-50/40 dark:bg-indigo-950/20 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/30'
                        : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="p-3.5 font-mono text-xs font-bold text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {course.code}
                    </td>

                    <td className="p-3.5">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {course.title[lang]}
                      </div>
                      {isRelevant && (
                        <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                          <Sparkles className="w-3 h-3" />
                          {ui.relevantBadge}
                        </span>
                      )}
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-bold ${
                          course.component === 'ВК'
                            ? 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {course.component}
                      </span>
                    </td>

                    <td className="p-3.5 font-bold">{course.credits}</td>

                    <td className="p-3.5">
                      <button
                        onClick={() => cycleCourseStatus(course.code)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition ${
                          status === 'completed'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : status === 'in_progress'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {status === 'completed' ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                        {ui.statusLabels[status]}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
