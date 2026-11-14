export type Lang = 'kk' | 'ru' | 'en';

export type LocalizedString = Record<Lang, string>;

export type InterestId =
  | 'mathLogic'
  | 'creativityDesign'
  | 'workingWithPeople'
  | 'buildingEngineering'
  | 'dataResearch'
  | 'communication';

export type AptitudeId = 'analytical' | 'creative' | 'social' | 'technical';

export type SkillId =
  | 'programming'
  | 'algorithms'
  | 'mathStats'
  | 'dataAnalysis'
  | 'machineLearning'
  | 'uiUxDesign'
  | 'cybersecurity'
  | 'networking'
  | 'projectMgmt'
  | 'productStrategy'
  | 'digitalMarketing'
  | 'financeAccounting'
  | 'engineeringCad'
  | 'communication'
  | 'pedagogy';

export interface LearningModule {
  id: string;
  title: LocalizedString;
  skillId: SkillId;
  targetLevel: number;
  hours: number;
  difficulty: 1 | 2 | 3;
  prereqs: string[];
}

export interface Career {
  id: string;
  title: LocalizedString;
  desc: LocalizedString;
  skills: Record<SkillId, number>;
  aptitudes: Record<AptitudeId, number>;
  modules: LearningModule[];
  sources: string[];
}

export interface StudyConstraints {
  hoursPerWeek: number;
  maxModulesPerWeek: number;
  deadlineWeeks: number;
  blockedWeeks: number[];
}

export interface ProgressSnapshot {
  date: string;
  label: string;
  topCareerId: string;
  bayesScore: number;
  mlScore: number;
  completedCount: number;
}

export interface UserProfile {
  name: string;
  interests: Record<InterestId, number>;
  skills: Record<SkillId, number>;
  constraints: StudyConstraints;
  completedModules: string[];
  history: ProgressSnapshot[];
}

export interface BayesCPTData {
  aptitudeParents: Record<AptitudeId, [InterestId, InterestId]>;
  aptitudeCPT: Record<AptitudeId, number[]>;
  careerFitCPT: Record<string, number[]>;
}

export interface BayesCareerResult {
  careerId: string;
  probability: number;
  aptitudePosteriors: Record<AptitudeId, number>;
  topAptitudes: { aptitude: AptitudeId; contribution: number }[];
}

export interface MLHyperparams {
  learningRate: number;
  epochs: number;
  l2Lambda: number;
  seed: number;
}

export interface MLMetrics {
  lossHistory: number[];
  trainAccuracy: number;
  testAccuracy: number;
  macroF1: number;
  confusionMatrix: number[][];
  majorityBaselineAcc: number;
  knnBaselineAcc: number;
  weights: number[][];
  biases: number[];
}

export interface MLPrediction {
  careerId: string;
  probability: number;
}

export interface CspStep {
  step: number;
  action: 'assign' | 'backtrack' | 'prune' | 'done';
  variableId: string;
  week?: number;
  reason: string;
  assignmentSnapshot: Record<string, number>;
}

export interface CspRunStats {
  solved: boolean;
  assignment: Record<string, number>;
  nodesExplored: number;
  backtracks: number;
  elapsedMs: number;
  steps: CspStep[];
  conflictReason?: string;
  relaxationSuggestion?: string;
}

export interface CspResult {
  smart: CspRunStats;
  plain: CspRunStats;
}
