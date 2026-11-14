import { describe, expect, it } from 'vitest';
import careersData from '../../data/careers.json';
import cptData from '../../data/bayes_cpt.json';
import { BayesCPTData, Career, InterestId } from '../../types';
import { validateBayesCPT } from './network';
import { runBayesInference } from './inference';

const careers = careersData as Career[];
const cpt = cptData as BayesCPTData;

describe('Bayesian Network (Week 6)', () => {
  it('validates that all CPT rows are valid probabilities summing to 1', () => {
    const res = validateBayesCPT(cpt, careers.map((c) => c.id));
    expect(res.valid).toBe(true);
    expect(res.errors).toHaveLength(0);
  });

  it('produces posterior probabilities strictly within [0, 1]', () => {
    const evidence: Record<InterestId, number> = {
      mathLogic: 2,
      creativityDesign: 1,
      workingWithPeople: 3,
      buildingEngineering: 0,
      dataResearch: 2,
      communication: 3
    };
    const results = runBayesInference(evidence, cpt, careers);
    expect(results).toHaveLength(12);
    for (const r of results) {
      expect(r.probability).toBeGreaterThanOrEqual(0);
      expect(r.probability).toBeLessThanOrEqual(1);
    }
  });

  it('matches hand-computed exact enumeration on a tiny 1-career test network', () => {
    const tinyCPT: BayesCPTData = {
      aptitudeParents: {
        analytical: ['mathLogic', 'dataResearch'],
        creative: ['creativityDesign', 'communication'],
        social: ['workingWithPeople', 'communication'],
        technical: ['buildingEngineering', 'mathLogic']
      },
      aptitudeCPT: {
        analytical: new Array(16).fill(0.5),
        creative: new Array(16).fill(0.5),
        social: new Array(16).fill(0.5),
        technical: new Array(16).fill(0.5)
      },
      careerFitCPT: {
        software_dev: new Array(16).fill(0.8)
      }
    };
    const evidence: Record<InterestId, number> = {
      mathLogic: 1,
      creativityDesign: 1,
      workingWithPeople: 1,
      buildingEngineering: 1,
      dataResearch: 1,
      communication: 1
    };
    const [res] = runBayesInference(evidence, tinyCPT, [careers[0]]);
    expect(res.probability).toBeCloseTo(0.8, 6);
  });

  it('monotonicity: raising a relevant interest does not lower the related career posterior', () => {
    const baseEvidence: Record<InterestId, number> = {
      mathLogic: 0,
      creativityDesign: 1,
      workingWithPeople: 1,
      buildingEngineering: 0,
      dataResearch: 0,
      communication: 1
    };
    const highMathEvidence: Record<InterestId, number> = {
      ...baseEvidence,
      mathLogic: 3,
      dataResearch: 3
    };

    const baseML = runBayesInference(baseEvidence, cpt, careers).find((r) => r.careerId === 'ml_engineer')!;
    const highML = runBayesInference(highMathEvidence, cpt, careers).find((r) => r.careerId === 'ml_engineer')!;

    expect(highML.probability).toBeGreaterThan(baseML.probability);
  });
});
