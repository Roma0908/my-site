import {
  AptitudeId,
  BayesCPTData,
  BayesCareerResult,
  Career,
  InterestId
} from '../../types';
import { APTITUDE_ORDER } from './network';

export function runBayesInference(
  interests: Record<InterestId, number>,
  cpt: BayesCPTData,
  careers: Career[]
): BayesCareerResult[] {
  const pApt1: Record<AptitudeId, number> = {
    analytical: 0,
    creative: 0,
    social: 0,
    technical: 0
  };

  for (const apt of APTITUDE_ORDER) {
    const [p1Name, p2Name] = cpt.aptitudeParents[apt];
    const v1 = Math.max(0, Math.min(3, Math.round(interests[p1Name] ?? 0)));
    const v2 = Math.max(0, Math.min(3, Math.round(interests[p2Name] ?? 0)));
    const rowIdx = v1 * 4 + v2;
    pApt1[apt] = cpt.aptitudeCPT[apt][rowIdx];
  }

  const stateProbs = new Float64Array(16);
  for (let mask = 0; mask < 16; mask++) {
    let prob = 1.0;
    for (let i = 0; i < 4; i++) {
      const apt = APTITUDE_ORDER[i];
      const bit = (mask >> (3 - i)) & 1;
      prob *= bit === 1 ? pApt1[apt] : 1 - pApt1[apt];
    }
    stateProbs[mask] = prob;
  }

  return careers.map((career) => {
    const fitTable = cpt.careerFitCPT[career.id];
    let posteriorHigh = 0;

    for (let mask = 0; mask < 16; mask++) {
      posteriorHigh += fitTable[mask] * stateProbs[mask];
    }

    posteriorHigh = Math.max(0, Math.min(1, posteriorHigh));

    const contributions = APTITUDE_ORDER.map((apt, i) => {
      const bitPos = 3 - i;
      let pHighGivenApt1 = 0;
      let pHighGivenApt0 = 0;
      for (let mask = 0; mask < 16; mask++) {
        let otherProb = 1.0;
        for (let j = 0; j < 4; j++) {
          if (i === j) continue;
          const otherApt = APTITUDE_ORDER[j];
          const b = (mask >> (3 - j)) & 1;
          otherProb *= b === 1 ? pApt1[otherApt] : 1 - pApt1[otherApt];
        }
        if ((mask >> bitPos) & 1) {
          pHighGivenApt1 += fitTable[mask] * otherProb;
        } else {
          pHighGivenApt0 += fitTable[mask] * otherProb;
        }
      }
      const lift = pApt1[apt] * (pHighGivenApt1 - pHighGivenApt0);
      return { aptitude: apt, contribution: lift };
    }).sort((a, b) => b.contribution - a.contribution);

    return {
      careerId: career.id,
      probability: posteriorHigh,
      aptitudePosteriors: { ...pApt1 },
      topAptitudes: contributions
    };
  });
}
