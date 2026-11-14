import React from 'react';
import { useApp } from '../state/AppContext';
import { Sparkles, Scale, ArrowRight, ClipboardList } from 'lucide-react';

export const Dashboard: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const { careers, bayesResults, mlPredictions, lang, t, setSelectedCareerId } = useApp();

  // Локализованные тексты интерфейса для устранения смешения языков
  const ui = {
    kk: {
      heroTitle: 'Сізге ең қолайлы ТОП-3 мамандық',
      heroDesc:
        'Қызығушылықтарыңыз (Байес желісі) мен ағымдағы дағдыларыңызды (ML-модель) біріктіріп талдау нәтижесі.',
      retakeBtn: 'Сауалнаманы қайта өту',
      matchBadge: (idx: number) => `#${idx + 1} Ұсыныс`,
      overallLabel: 'Жалпы сәйкестік',
      interestLabel: 'Қызығушылық бойынша (Bayes)',
      skillLabel: 'Қазіргі дағды деңгейі (ML)',
      whyPrefix: 'Негізгі себеп:',
      liftText: 'үлес',
      divergenceTitle: 'Модельдер алшақтығы:',
      highInterestMsg:
        'Бұл сала сіздің қызығушылықтарыңызға өте жақын, бірақ техникалық дағдыларды әлі де дамыту қажет.',
      highSkillMsg:
        'Сіздің қазіргі дағдыларыңыз бұл мамандыққа сай келеді, бірақ қызығушылықтарыңыз басқа бағытқа ауытқиды.',
      skillGapsBtn: 'Дағдылар алшақтығы',
      studyPlanBtn: 'Оқу жоспары',
      tableTitle: 'Барлық 12 мамандық — Толық салыстыру',
      colCareer: 'Мамандық',
      colInterest: 'Қызығушылық (Bayes)',
      colSkills: 'Дағдылар (ML)',
      colCombined: 'Жалпы балл',
      colAction: 'Әрекет',
      planLink: 'Жоспар →',
    },
    ru: {
      heroTitle: 'ТОП-3 рекомендуемые профессии для вас',
      heroDesc:
        'Комбинированный анализ ваших интересов (Байесовская сеть) и текущего уровня навыков (ML-модель).',
      retakeBtn: 'Пройти опрос заново',
      matchBadge: (idx: number) => `#${idx + 1} Выбор`,
      overallLabel: 'Совпадение',
      interestLabel: 'Совпадение по интересам (Bayes)',
      skillLabel: 'Текущий уровень навыков (ML)',
      whyPrefix: 'Ключевой фактор:',
      liftText: 'вклад',
      divergenceTitle: 'Разница оценок:',
      highInterestMsg:
        'Эта профессия отлично подходит вам по интересам, но технические навыки пока нужно подтянуть.',
      highSkillMsg:
        'Ваши текущие навыки уже подходят для этой роли, хотя ваши интересы лежат в другой области.',
      skillGapsBtn: 'Пробелы в навыках',
      studyPlanBtn: 'План обучения',
      tableTitle: 'Все 12 профессий — Полное сравнение',
      colCareer: 'Профессия',
      colInterest: 'Интересы (Bayes)',
      colSkills: 'Навыки (ML)',
      colCombined: 'Итоговый балл',
      colAction: 'Действие',
      planLink: 'План →',
    },
    en: {
      heroTitle: 'Top-3 Recommended Careers',
      heroDesc:
        'Combined inference from our Bayesian Network (interests → latent aptitudes) and Multinomial Logistic Regression (21-feature profile).',
      retakeBtn: 'Retake Quiz',
      matchBadge: (idx: number) => `#${idx + 1} Match`,
      overallLabel: 'Overall Match',
      interestLabel: 'Interest Fit (Bayes Network)',
      skillLabel: 'Current Skill Fit (ML Model)',
      whyPrefix: 'Driven primarily by',
      liftText: 'lift',
      divergenceTitle: 'Model Divergence:',
      highInterestMsg:
        'Your interests strongly match this role, but your current technical skill ratings are still developing.',
      highSkillMsg:
        'Your current skill levels already match this role, even though your stated interests lean elsewhere.',
      skillGapsBtn: 'Skill Gaps',
      studyPlanBtn: 'Study Plan',
      tableTitle: 'All 12 Careers — Full Model Comparison',
      colCareer: 'Career',
      colInterest: 'Interests (Bayes)',
      colSkills: 'Skills (ML)',
      colCombined: 'Combined',
      colAction: 'Action',
      planLink: 'Plan →',
    },
  }[lang];

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
      {/* Приветственный баннер с кнопкой прохождения опроса */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-6 rounded-2xl shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 shrink-0" />
            {ui.heroTitle}
          </h1>
          <p className="text-indigo-100 text-sm mt-1 max-w-2xl">{ui.heroDesc}</p>
        </div>

        <button
          onClick={() => onNavigate('onboarding')}
          className="shrink-0 px-4 py-2.5 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition"
        >
          <ClipboardList className="w-4 h-4" />
          {ui.retakeBtn}
        </button>
      </div>

      {/* Карточки ТОП-3 профессий */}
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
                {/* Шапка карточки с крупным итоговым процентом */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    {ui.matchBadge(idx)}
                  </span>
                  <div className="text-right">
                    <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 leading-none">
                      {Math.round(score * 100)}%
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 mt-0.5">
                      {ui.overallLabel}
                    </div>
                  </div>
                </div>

                <h2 className="text-lg font-bold">{career.title[lang]}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {career.desc[lang]}
                </p>

                {/* Шкалы интересов и навыков на понятном языке */}
                <div className="mt-4 space-y-2.5 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span>{ui.interestLabel}</span>
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
                      <span>{ui.skillLabel}</span>
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

                {/* Объяснение на языке пользователя */}
                <div className="mt-3 text-xs space-y-2">
                  <p className="text-slate-700 dark:text-slate-300">
                    <strong>{ui.whyPrefix}</strong>{' '}
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                      {t.aptitudes[topApt.aptitude]}
                    </span>{' '}
                    (+{(topApt.contribution * 100).toFixed(1)}% {ui.liftText}).
                  </p>

                  {disagrees && (
                    <p className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 flex items-start gap-1.5">
                      <Scale className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>
                        <strong>{ui.divergenceTitle}</strong>{' '}
                        {bayes.probability > ml.probability ? ui.highInterestMsg : ui.highSkillMsg}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {/* Кнопки действий */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                <button
                  onClick={() => {
                    setSelectedCareerId(career.id);
                    onNavigate('skillGap');
                  }}
                  className="flex-1 py-2 px-3 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition"
                >
                  {ui.skillGapsBtn}
                </button>
                <button
                  onClick={() => {
                    setSelectedCareerId(career.id);
                    onNavigate('studyPlan');
                  }}
                  className="flex-1 py-2 px-3 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-1 transition"
                >
                  {ui.studyPlanBtn} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Сравнительная таблица всех 12 профессий */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 font-bold text-sm">
          {ui.tableTitle}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/70 text-xs uppercase text-slate-500">
              <tr>
                <th className="p-3">{ui.colCareer}</th>
                <th className="p-3">{ui.colInterest}</th>
                <th className="p-3">{ui.colSkills}</th>
                <th className="p-3">{ui.colCombined}</th>
                <th className="p-3">{ui.colAction}</th>
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
                      {ui.planLink}
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
