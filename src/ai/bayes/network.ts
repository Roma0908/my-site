import { AptitudeId, BayesCPTData } from '../../types';

export const APTITUDE_ORDER: AptitudeId[] = ['analytical', 'creative', 'social', 'technical'];

export function validateBayesCPT(cpt: BayesCPTData, careerIds: string[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const apt of APTITUDE_ORDER) {
    const table = cpt.aptitudeCPT[apt];
    if (!table || table.length !== 16) {
      errors.push(`Aptitude CPT for ${apt} must have 16 entries (4x4 parent states).`);
      continue;
    }
    table.forEach((p1, idx) => {
      const p0 = 1 - p1;
      if (p1 < 0 || p1 > 1 || Math.abs(p1 + p0 - 1) > 1e-9) {
        errors.push(`Invalid probability ${p1} in ${apt} at row ${idx}`);
      }
    });
  }

  for (const cid of careerIds) {
    const table = cpt.careerFitCPT[cid];
    if (!table || table.length !== 16) {
      errors.push(`Career Fit CPT for ${cid} must have 16 entries (2^4 aptitude states).`);
      continue;
    }
    table.forEach((pHigh, idx) => {
      const pLow = 1 - pHigh;
      if (pHigh < 0 || pHigh > 1 || Math.abs(pHigh + pLow - 1) > 1e-9) {
        errors.push(`Invalid probability ${pHigh} in career ${cid} at row ${idx}`);
      }
    });
  }

  return { valid: errors.length === 0, errors };
}
