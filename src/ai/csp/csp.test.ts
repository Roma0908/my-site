import { describe, expect, it } from 'vitest';
import careersData from '../../data/careers.json';
import { Career, LearningModule, StudyConstraints } from '../../types';
import { isConsistent, solveStudyPlanCSP, validateCspInput } from './solver';

const careers = careersData as Career[];

describe('Study Plan CSP Solver (Week 3)', () => {
  const sampleModules: LearningModule[] = careers[0].modules;

  it('returns a valid schedule satisfying all constraints', () => {
    const constraints: StudyConstraints = {
      hoursPerWeek: 18,
      maxModulesPerWeek: 2,
      deadlineWeeks: 5,
      blockedWeeks: [2]
    };

    const res = solveStudyPlanCSP(sampleModules, constraints);
    expect(res.smart.solved).toBe(true);
    expect(res.plain.solved).toBe(true);

    const assign = res.smart.assignment;
    expect(Object.keys(assign)).toHaveLength(sampleModules.length);
    expect(Object.values(assign)).not.toContain(2);
    expect(assign['sd_m1']).toBeLessThan(assign['sd_m2']);

    for (const m of sampleModules) {
      expect(isConsistent(m, assign[m.id], assign, sampleModules, constraints)).toBe(true);
    }
  });

  it('detects infeasible cases and proposes a relaxation', () => {
    const tightConstraints: StudyConstraints = {
      hoursPerWeek: 10,
      maxModulesPerWeek: 2,
      deadlineWeeks: 4,
      blockedWeeks: []
    };

    const res = solveStudyPlanCSP(sampleModules, tightConstraints);
    expect(res.smart.solved).toBe(false);
    expect(res.smart.conflictReason).toBeTruthy();
    expect(res.smart.relaxationSuggestion).toContain('14h');
  });

  it('MRV + forward checking explores no more nodes than plain backtracking on benchmark', () => {
    const combinedModules: LearningModule[] = [
      ...careers[0].modules,
      ...careers[1].modules
    ];
    const constraints: StudyConstraints = {
      hoursPerWeek: 16,
      maxModulesPerWeek: 2,
      deadlineWeeks: 8,
      blockedWeeks: [3, 6]
    };

    const res = solveStudyPlanCSP(combinedModules, constraints);
    expect(res.smart.solved).toBe(true);
    expect(res.smart.nodesExplored).toBeLessThanOrEqual(res.plain.nodesExplored);
  });

  it('rejects invalid input constraints', () => {
    const invalid: StudyConstraints = {
      hoursPerWeight: -5,
      maxModulesPerWeek: 2,
      deadlineWeeks: 6,
      blockedWeeks: []
    } as any;
    expect(validateCspInput(sampleModules, invalid)).not.toBeNull();
  });
});
