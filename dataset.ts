import { Career, InterestId, SkillId, UserProfile } from '../../types';
import { SeededRNG } from './prng';

export const INTEREST_KEYS: InterestId[] = [
  'mathLogic',
  'creativityDesign',
  'workingWithPeople',
  'buildingEngineering',
  'dataResearch',
  'communication'
];

export const SKILL_KEYS: SkillId[] = [
  'programming',
  'algorithms',
  'mathStats',
  'dataAnalysis',
  'machineLearning',
  'uiUxDesign',
  'cybersecurity',
  'networking',
  'projectMgmt',
  'productStrategy',
  'digitalMarketing',
  'financeAccounting',
  'engineeringCad',
  'communication',
  'pedagogy'
];

export const FEATURE_NAMES = [...INTEREST_KEYS, ...SKILL_KEYS];

export interface DatasetSplit {
  XTrain: number[][];
  yTrain: number[];
  XTest: number[][];
  yTest: number[];
}

export function profileToVector(profile: Pick<UserProfile, 'interests' | 'skills'>): number[] {
  const vec: number[] = [];
  for (const k of INTEREST_KEYS) {
    vec.push((profile.interests[k] ?? 0) / 3);
  }
  for (const k of SKILL_KEYS) {
    vec.push((profile.skills[k] ?? 0) / 5);
  }
  return vec;
}

function careerPrototype(career: Career): number[] {
  const a = career.aptitudes;
  const interestProto = [
    Math.min(1, a.analytical * 1.3 + a.technical * 0.4),
    Math.min(1, a.creative * 1.5),
    Math.min(1, a.social * 1.5),
    Math.min(1, a.technical * 1.5),
    Math.min(1, a.analytical * 1.4),
    Math.min(1, a.social * 1.1 + a.creative * 0.4)
  ];
  const skillProto = SKILL_KEYS.map((sk) => (career.skills[sk] ?? 0) / 5);
  return [...interestProto, ...skillProto];
}

export function generateSyntheticDataset(
  careers: Career[],
  seed = 42,
  samplesPerClass = 250
): DatasetSplit {
  const rng = new SeededRNG(seed);
  const numClasses = careers.length;
  const prototypes = careers.map(careerPrototype);

  const XTrain: number[][] = [];
  const yTrain: number[] = [];
  const XTest: number[][] = [];
  const yTest: number[] = [];

  for (let c = 0; c < numClasses; c++) {
    const classSamples: { x: number[]; y: number }[] = [];
    for (let i = 0; i < samplesPerClass; i++) {
      const x = prototypes[c].map((val) =>
        Math.max(0, Math.min(1, val + rng.nextGaussian(0, 0.16)))
      );
      let y = c;
      if (rng.next() < 0.05) {
        y = Math.floor(rng.next() * numClasses);
      }
      classSamples.push({ x, y });
    }

    for (let i = classSamples.length - 1; i > 0; i--) {
      const j = Math.floor(rng.next() * (i + 1));
      const tmp = classSamples[i];
      classSamples[i] = classSamples[j];
      classSamples[j] = tmp;
    }

    const splitIdx = Math.floor(samplesPerClass * 0.8);
    for (let i = 0; i < samplesPerClass; i++) {
      if (i < splitIdx) {
        XTrain.push(classSamples[i].x);
        yTrain.push(classSamples[i].y);
      } else {
        XTest.push(classSamples[i].x);
        yTest.push(classSamples[i].y);
      }
    }
  }

  return { XTrain, yTrain, XTest, yTest };
}
