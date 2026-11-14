import { CspResult, CspRunStats, CspStep, LearningModule, StudyConstraints } from '../../types';
import { diagnoseCspInfeasibility } from './diagnostics';
import { selectVariableMRV } from './heuristics';

const MAX_NODES = 8000;
const MAX_LOG_STEPS = 250;

export function validateCspInput(modules: LearningModule[], constraints: StudyConstraints): string | null {
  if (constraints.hoursPerWeek <= 0 || constraints.hoursPerWeek > 80) {
    return 'Hours per week must be between 1 and 80.';
  }
  if (constraints.maxModulesPerWeek <= 0 || constraints.maxModulesPerWeek > 10) {
    return 'Max modules per week must be between 1 and 10.';
  }
  if (constraints.deadlineWeeks <= 0 || constraints.deadlineWeeks > 52) {
    return 'Deadline weeks must be between 1 and 52.';
  }
  for (const bw of constraints.blockedWeeks) {
    if (!Number.isInteger(bw) || bw < 1 || bw > constraints.deadlineWeeks) {
      return `Blocked week ${bw} must be an integer between 1 and ${constraints.deadlineWeeks}.`;
    }
  }
  const modMap = new Map(modules.map((m) => [m.id, m]));
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const hasCycle = (id: string): boolean => {
    if (visiting.has(id)) return true;
    if (visited.has(id)) return false;
    visiting.add(id);
    const m = modMap.get(id);
    if (m) {
      for (const p of m.prereqs) {
        if (modMap.has(p) && hasCycle(p)) return true;
      }
    }
    visiting.delete(id);
    visited.add(id);
    return false;
  };
  for (const m of modules) {
    if (hasCycle(m.id)) return `Cyclic prerequisite detected involving ${m.id}.`;
  }
  return null;
}

export function isConsistent(
  mod: LearningModule,
  week: number,
  assignment: Record<string, number>,
  modules: LearningModule[],
  constraints: StudyConstraints
): boolean {
  if (constraints.blockedWeeks.includes(week)) return false;
  if (week < 1 || week > constraints.deadlineWeeks) return false;

  let weekHours = mod.hours;
  let weekCount = 1;
  let hardCount = mod.difficulty === 3 ? 1 : 0;

  for (const other of modules) {
    const assignedWeek = assignment[other.id];
    if (assignedWeek === undefined) continue;

    if (assignedWeek === week) {
      weekHours += other.hours;
      weekCount += 1;
      if (other.difficulty === 3) hardCount += 1;
    }

    if (mod.prereqs.includes(other.id) && !(assignedWeek < week)) {
      return false;
    }
    if (other.prereqs.includes(mod.id) && !(week < assignedWeek)) {
      return false;
    }
  }

  return (
    weekHours <= constraints.hoursPerWeek &&
    weekCount <= constraints.maxModulesPerWeek &&
    hardCount <= 1
  );
}

export function runSingleCspSolver(
  modules: LearningModule[],
  constraints: StudyConstraints,
  useSmartHeuristics: boolean
): CspRunStats {
  const start = performance.now();
  const validationErr = validateCspInput(modules, constraints);
  if (validationErr) {
    return {
      solved: false,
      assignment: {},
      nodesExplored: 0,
      backtracks: 0,
      elapsedMs: 0,
      steps: [],
      conflictReason: validationErr,
      relaxationSuggestion: 'Fix invalid constraint inputs.'
    };
  }

  const allowedWeeks: number[] = [];
  for (let w = 1; w <= constraints.deadlineWeeks; w++) {
    if (!constraints.blockedWeeks.includes(w)) allowedWeeks.push(w);
  }

  const initialDomains: Record<string, number[]> = {};
  for (const m of modules) {
    initialDomains[m.id] = allowedWeeks.filter((w) => m.hours <= constraints.hoursPerWeek);
  }

  let nodesExplored = 0;
  let backtracks = 0;
  const steps: CspStep[] = [];
  let solution: Record<string, number> | null = null;

  const logStep = (
    action: CspStep['action'],
    variableId: string,
    reason: string,
    assignment: Record<string, number>,
    week?: number
  ) => {
    if (steps.length < MAX_LOG_STEPS) {
      steps.push({
        step: steps.length + 1,
        action,
        variableId,
        week,
        reason,
        assignmentSnapshot: { ...assignment }
      });
    }
  };

  function backtrack(
    assignment: Record<string, number>,
    domains: Record<string, number[]>
  ): boolean {
    if (Object.keys(assignment).length === modules.length) {
      solution = { ...assignment };
      logStep('done', 'ALL', 'All modules scheduled without conflicts.', assignment);
      return true;
    }

    if (nodesExplored >= MAX_NODES) return false;

    const nextVar = useSmartHeuristics
      ? selectVariableMRV(modules, assignment, domains)
      : modules.find((m) => assignment[m.id] === undefined) ?? null;

    if (!nextVar) return false;

    const candidateWeeks = domains[nextVar.id];
    for (const week of candidateWeeks) {
      nodesExplored++;
      if (isConsistent(nextVar, week, assignment, modules, constraints)) {
        assignment[nextVar.id] = week;
        logStep(
          'assign',
          nextVar.id,
          `Assigned ${nextVar.id} -> Week ${week}`,
          assignment,
          week
        );

        if (useSmartHeuristics) {
          const nextDomains: Record<string, number[]> = {};
          let domainWipeout = false;
          for (const m of modules) {
            if (assignment[m.id] !== undefined) {
              nextDomains[m.id] = domains[m.id];
            } else {
              const filtered = domains[m.id].filter((w) =>
                isConsistent(m, w, assignment, modules, constraints)
              );
              nextDomains[m.id] = filtered;
              if (filtered.length === 0) {
                domainWipeout = true;
                logStep(
                  'prune',
                  m.id,
                  `Forward check wipeout on ${m.id} after assigning ${nextVar.id}=W${week}`,
                  assignment,
                  week
                );
                break;
              }
            }
          }

          if (!domainWipeout && backtrack(assignment, nextDomains)) {
            return true;
          }
        } else {
          if (backtrack(assignment, domains)) {
            return true;
          }
        }

        delete assignment[nextVar.id];
        backtracks++;
        logStep(
          'backtrack',
          nextVar.id,
          `Backtracked ${nextVar.id} from Week ${week}`,
          assignment,
          week
        );
      }
    }

    return false;
  }

  const diag = diagnoseCspInfeasibility(modules, constraints);
  const solved = backtrack({}, initialDomains);
  const elapsedMs = Math.max(0.01, Number((performance.now() - start).toFixed(2)));

  return {
    solved,
    assignment: solution ?? {},
    nodesExplored,
    backtracks,
    elapsedMs,
    steps,
    conflictReason: solved ? undefined : diag.conflictReason,
    relaxationSuggestion: solved ? undefined : diag.relaxationSuggestion
  };
}

export function solveStudyPlanCSP(
  modules: LearningModule[],
  constraints: StudyConstraints
): CspResult {
  const smart = runSingleCspSolver(modules, constraints, true);
  const plain = runSingleCspSolver(modules, constraints, false);
  return { smart, plain };
}
