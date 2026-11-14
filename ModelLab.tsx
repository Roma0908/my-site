import React, { useState } from 'react';
import { useApp } from '../state/AppContext';
import { FEATURE_NAMES } from '../ai/ml/dataset';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { Cpu, Play } from 'lucide-react';

export const ModelLab: React.FC = () => {
  const { mlParams, knnK, retrainML, isTrainingML, mlMetrics, careers, lang } = useApp();

  const [lr, setLr] = useState(mlParams.learningRate);
  const [epochs, setEpochs] = useState(mlParams.epochs);
  const [l2, setL2] = useState(mlParams.l2Lambda);
  const [k, setK] = useState(knnK);

  const handleTrain = () => {
    retrainML({ learningRate: lr, epochs, l2Lambda: l2, seed: mlParams.seed }, k);
  };

  const lossChartData = mlMetrics.lossHistory.map((loss, i) => ({
    epoch: i + 1,
    loss: Number(loss.toFixed(4))
  }));

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-600" /> ML Model Lab (From-Scratch Softmax Regression)
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Trained in-browser via Web Worker on <strong>3,000 synthetic samples</strong> (250/class + Gaussian noise + 5% label noise, 80/20 stratified split).
            </p>
          </div>
          <button
            onClick={handleTrain}
            disabled={isTrainingML}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-semibold flex items-center gap-1.5"
          >
            <Play className="w-4 h-4" /> {isTrainingML ? 'Training in Worker...' : 'Retrain Model'}
          </button>
        </div>

        <div className="grid sm:grid-cols-4 gap-4 pt-2">
          <div>
            <label className="block text-xs font-medium mb-1">Learning Rate: {lr}</label>
            <input
              type="range"
              min={0.05}
              max={2.0}
              step={0.05}
              value={lr}
              onChange={(e) => setLr(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Epochs: {epochs}</label>
            <input
              type="range"
              min={20}
              max={300}
              step={10}
              value={epochs}
              onChange={(e) => setEpochs(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">L2 Regularization (λ): {l2}</label>
            <input
              type="range"
              min={0}
              max={0.05}
              step={0.001}
              value={l2}
              onChange={(e) => setL2(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">k-NN Baseline (k): {k}</label>
            <input
              type="range"
              min={1}
              max={15}
              step={2}
              value={k}
              onChange={(e) => setK(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500">Train Accuracy</div>
          <div className="text-2xl font-bold text-emerald-600">
            {(mlMetrics.trainAccuracy * 100).toFixed(1)}%
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500">Test Accuracy</div>
          <div className="text-2xl font-bold text-emerald-600">
            {(mlMetrics.testAccuracy * 100).toFixed(1)}%
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500">Macro F1 Score</div>
          <div className="text-2xl font-bold text-indigo-600">
            {mlMetrics.macroF1.toFixed(3)}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500">k-NN Baseline (k={knnK})</div>
          <div className="text-2xl font-bold text-amber-600">
            {(mlMetrics.knnBaselineAcc * 100).toFixed(1)}%
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500">Majority Baseline</div>
          <div className="text-2xl font-bold text-slate-500">
            {(mlMetrics.majorityBaselineAcc * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 h-80">
          <h2 className="font-bold text-sm mb-2">Cross-Entropy + L2 Loss Curve</h2>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={lossChartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="epoch" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="loss" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
          <h2 className="font-bold text-sm mb-2">12×12 Test Confusion Matrix (Actual rows × Pred cols)</h2>
          <table className="text-[10px] w-full text-center border-collapse">
            <thead>
              <tr>
                <th className="p-1 text-left">True \ Pred</th>
                {careers.map((c, i) => (
                  <th key={c.id} className="p-1" title={c.title[lang]}>
                    C{i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mlMetrics.confusionMatrix.map((row, rIdx) => (
                <tr key={rIdx}>
                  <td className="p-1 text-left font-medium truncate max-w-[110px]" title={careers[rIdx].title[lang]}>
                    C{rIdx + 1}: {careers[rIdx].title[lang]}
                  </td>
                  {row.map((val, cIdx) => (
                    <td
                      key={cIdx}
                      className={`p-1 border border-slate-100 dark:border-slate-800 ${
                        rIdx === cIdx
                          ? 'bg-emerald-500/25 font-bold text-emerald-700 dark:text-emerald-300'
                          : val > 0
                          ? 'bg-amber-500/15'
                          : 'text-slate-400'
                      }`}
                    >
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
        <h2 className="font-bold text-sm mb-2">
          Learned Feature Weights for Class 1 ({careers[0].title[lang]})
        </h2>
        <div className="flex flex-wrap gap-2">
          {FEATURE_NAMES.map((fname, idx) => {
            const w = mlMetrics.weights[0]?.[idx] ?? 0;
            return (
              <span
                key={fname}
                className={`px-2.5 py-1 rounded text-xs font-mono ${
                  w >= 0
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                    : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                }`}
              >
                {fname}: {w >= 0 ? '+' : ''}
                {w.toFixed(2)}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
