import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import careersRaw from '../data/careers.json';
import cptRaw from '../data/bayes_cpt.json';
import { DEMO_PRESETS } from '../data/presets';
import { runBayesInference } from '../ai/bayes/inference';
import { generateSyntheticDataset, profileToVector } from '../ai/ml/dataset';
import {
  rankCareersML,
  SoftmaxModel,
  trainSoftmaxModel
} from '../ai/ml/softmax';
import { solveStudyPlanCSP } from '../ai/csp/solver';
import {
  BayesCPTData,
  BayesCareerResult,
  Career,
  CspResult,
  Lang,
  LearningModule,
  MLHyperparams,
  MLMetrics,
  MLPrediction,
  UserProfile
} from '../types';
import { Dictionary, getDict } from '../i18n';
import { loadProfile, saveProfile } from './storage';

const careers = careersRaw as Career[];
const cpt = cptRaw as BayesCPTData;

interface AppContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dictionary;
  darkMode: boolean;
  setDarkMode: (d: boolean) => void;
  careers: Career[];
  cpt: BayesCPTData;
  profile: UserProfile;
  updateProfile: (next: UserProfile) => void;
  applyPreset: (key: string) => void;
  completeModule: (mod: LearningModule) => void;
  recordSnapshot: (label: string) => void;
  bayesResults: BayesCareerResult[];
  mlPredictions: MLPrediction[];
  mlMetrics: MLMetrics;
  mlParams: MLHyperparams;
  knnK: number;
  retrainML: (params: MLHyperparams, k: number) => void;
  isTrainingML: boolean;
  selectedCareerId: string;
  setSelectedCareerId: (id: string) => void;
  targetModules: LearningModule[];
  cspResult: CspResult;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>('kk');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [profile, setProfile] = useState<UserProfile>(() => loadProfile());
  const [selectedCareerId, setSelectedCareerId] = useState<string>('ml_engineer');

  const [mlParams, setMlParams] = useState<MLHyperparams>({
    learningRate: 0.8,
    epochs: 120,
    l2Lambda: 0.001,
    seed: 42
  });
  const [knnK, setKnnK] = useState<number>(5);
  const [isTrainingML, setIsTrainingML] = useState<boolean>(false);

  const initialML = useMemo(() => {
    const split = generateSyntheticDataset(careers, 42, 250);
    return trainSoftmaxModel(split, careers.length, mlParams, 5);
  }, []);

  const [mlModel, setMlModel] = useState<SoftmaxModel>(initialML.model);
  const [mlMetrics, setMlMetrics] = useState<MLMetrics>(initialML.metrics);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const updateProfile = (next: UserProfile) => {
    setProfile(next);
    saveProfile(next);
  };

  const applyPreset = (key: string) => {
    const preset = DEMO_PRESETS[key];
    if (preset) {
      updateProfile(structuredClone(preset));
    }
  };

  const retrainML = (params: MLHyperparams, k: number) => {
    setMlParams(params);
    setKnnK(k);
    setIsTrainingML(true);
    try {
      const worker = new Worker(new URL('../ai/ml/worker.ts', import.meta.url), {
        type: 'module'
      });
      worker.postMessage({ careers, params, knnK: k });
      worker.onmessage = (e) => {
        if (e.data.type === 'done') {
          setMlModel(e.data.model);
          setMlMetrics(e.data.metrics);
          setIsTrainingML(false);
          worker.terminate();
        }
      };
      worker.onerror = () => {
        const split = generateSyntheticDataset(careers, params.seed, 250);
        const res = trainSoftmaxModel(split, careers.length, params, k);
        setMlModel(res.model);
        setMlMetrics(res.metrics);
        setIsTrainingML(false);
        worker.terminate();
      };
    } catch {
      const split = generateSyntheticDataset(careers, params.seed, 250);
      const res = trainSoftmaxModel(split, careers.length, params, k);
      setMlModel(res.model);
      setMlMetrics(res.metrics);
      setIsTrainingML(false);
    }
  };

  const bayesResults = useMemo(
    () => runBayesInference(profile.interests, cpt, careers),
    [profile.interests]
  );

  const mlPredictions = useMemo(
    () => rankCareersML(mlModel, profileToVector(profile), careers),
    [mlModel, profile.interests, profile.skills]
  );

  const targetModules = useMemo(() => {
    const career = careers.find((c) => c.id === selectedCareerId) ?? careers[0];
    return career.modules.filter(
      (m) =>
        !profile.completedModules.includes(m.id) &&
        (profile.skills[m.skillId] ?? 0) < m.targetLevel
    );
  }, [selectedCareerId, profile.completedModules, profile.skills]);

  const cspResult = useMemo(
    () => solveStudyPlanCSP(targetModules, profile.constraints),
    [targetModules, profile.constraints]
  );

  const completeModule = (mod: LearningModule) => {
    if (profile.completedModules.includes(mod.id)) return;
    const nextSkills = {
      ...profile.skills,
      [mod.skillId]: Math.max(profile.skills[mod.skillId] ?? 0, mod.targetLevel)
    };
    const nextCompleted = [...profile.completedModules, mod.id];
    const nextML = rankCareersML(mlModel, profileToVector({ interests: profile.interests, skills: nextSkills }), careers);
    const topId = nextML[0]?.careerId ?? selectedCareerId;
    const topBayes = bayesResults.find((b) => b.careerId === topId)?.probability ?? 0;

    const nextProfile: UserProfile = {
      ...profile,
      skills: nextSkills,
      completedModules: nextCompleted,
      history: [
        ...profile.history,
        {
          date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          label: mod.title[lang],
          topCareerId: topId,
          bayesScore: Math.round(topBayes * 100),
          mlScore: Math.round((nextML[0]?.probability ?? 0) * 100),
          completedCount: nextCompleted.length
        }
      ]
    };
    updateProfile(nextProfile);
  };

  const recordSnapshot = (label: string) => {
    const topId = mlPredictions[0]?.careerId ?? selectedCareerId;
    const topBayes = bayesResults.find((b) => b.careerId === topId)?.probability ?? 0;
    updateProfile({
      ...profile,
      history: [
        ...profile.history,
        {
          date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          label,
          topCareerId: topId,
          bayesScore: Math.round(topBayes * 100),
          mlScore: Math.round((mlPredictions[0]?.probability ?? 0) * 100),
          completedCount: profile.completedModules.length
        }
      ]
    });
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        t: getDict(lang),
        darkMode,
        setDarkMode,
        careers,
        cpt,
        profile,
        updateProfile,
        applyPreset,
        completeModule,
        recordSnapshot,
        bayesResults,
        mlPredictions,
        mlMetrics,
        mlParams,
        knnK,
        retrainML,
        isTrainingML,
        selectedCareerId,
        setSelectedCareerId,
        targetModules,
        cspResult
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
