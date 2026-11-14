import { UserProfile } from '../types';

export const DEMO_PRESETS: Record<string, UserProfile> = {
  ai_student: {
    name: 'Айдар (QAIRU AI Student)',
    interests: {
      mathLogic: 3,
      creativityDesign: 1,
      workingWithPeople: 1,
      buildingEngineering: 2,
      dataResearch: 3,
      communication: 2
    },
    skills: {
      programming: 3, algorithms: 2, mathStats: 3, dataAnalysis: 2, machineLearning: 1,
      uiUxDesign: 1, cybersecurity: 1, networking: 2, projectMgmt: 1, productStrategy: 1,
      digitalMarketing: 0, financeAccounting: 1, engineeringCad: 0, communication: 2, pedagogy: 0
    },
    constraints: {
      hoursPerWeek: 12,
      maxModulesPerWeek: 2,
      deadlineWeeks: 8,
      blockedWeeks: [4]
    },
    completedModules: [],
    history: []
  },
  creative_lead: {
    name: 'Мадина (Design & Product)',
    interests: {
      mathLogic: 1,
      creativityDesign: 3,
      workingWithPeople: 3,
      buildingEngineering: 0,
      dataResearch: 1,
      communication: 3
    },
    skills: {
      programming: 1, algorithms: 0, mathStats: 1, dataAnalysis: 2, machineLearning: 0,
      uiUxDesign: 3, cybersecurity: 0, networking: 0, projectMgmt: 2, productStrategy: 2,
      digitalMarketing: 2, financeAccounting: 1, engineeringCad: 0, communication: 4, pedagogy: 1
    },
    constraints: {
      hoursPerWeek: 10,
      maxModulesPerWeek: 2,
      deadlineWeeks: 6,
      blockedWeeks: [3]
    },
    completedModules: [],
    history: []
  },
  industrial_eng: {
    name: 'Ерлан (Atyrau Engineering)',
    interests: {
      mathLogic: 3,
      creativityDesign: 1,
      workingWithPeople: 1,
      buildingEngineering: 3,
      dataResearch: 2,
      communication: 1
    },
    skills: {
      programming: 1, algorithms: 1, mathStats: 3, dataAnalysis: 2, machineLearning: 0,
      uiUxDesign: 0, cybersecurity: 0, networking: 0, projectMgmt: 2, productStrategy: 0,
      digitalMarketing: 0, financeAccounting: 1, engineeringCad: 2, communication: 2, pedagogy: 0
    },
    constraints: {
      hoursPerWeek: 10,
      maxModulesPerWeek: 2,
      deadlineWeeks: 6,
      blockedWeeks: []
    },
    completedModules: [],
    history: []
  }
};
