import { LearningModule } from '../../types';

export function selectVariableMRV(
  modules: LearningModule[],
  assignment: Record<string, number>,
  domains: Record<string, number[]>
): LearningModule | null {
  let bestMod: LearningModule | null = null;
  let minDomainSize = Infinity;
  let maxDegree = -1;

  for (const mod of modules) {
    if (assignment[mod.id] !== undefined) continue;
    const domSize = domains[mod.id].length;
    const dependents = modules.filter((other) => other.prereqs.includes(mod.id)).length;
    const degree = mod.prereqs.length + dependents;

    if (domSize < minDomainSize || (domSize === minDomainSize && degree > maxDegree)) {
      minDomainSize = domSize;
      maxDegree = degree;
      bestMod = mod;
    }
  }
  return bestMod;
}
