import { LearningModule, StudyConstraints } from '../../types';

export function diagnoseCspInfeasibility(
  modules: LearningModule[],
  constraints: StudyConstraints
): { conflictReason: string; relaxationSuggestion: string } {
  const blockedSet = new Set(constraints.blockedWeeks);
  const availableWeeks: number[] = [];
  for (let w = 1; w <= constraints.deadlineWeeks; w++) {
    if (!blockedSet.has(w)) availableWeeks.push(w);
  }

  const totalHoursNeeded = modules.reduce((acc, m) => acc + m.hours, 0);
  const totalCapacity = availableWeeks.length * constraints.hoursPerWeek;

  if (availableWeeks.length === 0) {
    return {
      conflictReason: 'All weeks before the deadline are marked as blocked (exams/holidays).',
      relaxationSuggestion: `Extend deadline beyond week ${constraints.deadlineWeeks} or unblock at least 1 week.`
    };
  }

  if (totalHoursNeeded > totalCapacity) {
    const minHours = Math.ceil(totalHoursNeeded / availableWeeks.length);
    const extraWeeks = Math.ceil((totalHoursNeeded - totalCapacity) / Math.max(1, constraints.hoursPerWeek));
    return {
      conflictReason: `Total module workload (${totalHoursNeeded}h) exceeds available capacity (${totalCapacity}h across ${availableWeeks.length} active weeks).`,
      relaxationSuggestion: `Increase weekly capacity to at least ${minHours}h/week OR extend deadline by +${extraWeeks} week(s).`
    };
  }

  const maxSingleModuleHours = Math.max(0, ...modules.map((m) => m.hours));
  if (maxSingleModuleHours > constraints.hoursPerWeek) {
    return {
      conflictReason: `A module requires ${maxSingleModuleHours}h, exceeding the weekly cap of ${constraints.hoursPerWeek}h.`,
      relaxationSuggestion: `Increase hours per week to at least ${maxSingleModuleHours}h.`
    };
  }

  if (modules.length > availableWeeks.length * constraints.maxModulesPerWeek) {
    const neededWeeks = Math.ceil(modules.length / Math.max(1, constraints.maxModulesPerWeek));
    return {
      conflictReason: `${modules.length} modules cannot fit into ${availableWeeks.length} active weeks with max ${constraints.maxModulesPerWeek} modules/week.`,
      relaxationSuggestion: `Increase max modules per week or extend deadline to at least ${neededWeeks + blockedSet.size} weeks.`
    };
  }

  const hardCount = modules.filter((m) => m.difficulty === 3).length;
  if (hardCount > availableWeeks.length) {
    return {
      conflictReason: `Difficulty balance constraint violated: ${hardCount} hard modules cannot be placed into ${availableWeeks.length} active weeks (max 1 hard module/week).`,
      relaxationSuggestion: `Extend deadline by at least +${hardCount - availableWeeks.length} active week(s).`
    };
  }

  return {
    conflictReason: 'Prerequisite chain length + blocked weeks prevent valid topological ordering before deadline.',
    relaxationSuggestion: `Extend deadline by +2 weeks or remove blocked weeks between dependent modules.`
  };
}
