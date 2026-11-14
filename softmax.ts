import { Career, MLHyperparams, MLMetrics, MLPrediction } from '../../types';
import { DatasetSplit } from './dataset';
import { evaluateKNN } from './knn';
import { SeededRNG } from './prng';

export interface SoftmaxModel {
  weights: number[][];
  biases: number[];
  numClasses: number;
  numFeatures: number;
}

export function softmax(logits: number[]): number[] {
  let maxLogit = -Infinity;
  for (let i = 0; i < logits.length; i++) {
    if (logits[i] > maxLogit) maxLogit = logits[i];
  }
  const exps = new Array<number>(logits.length);
  let sumExp = 0;
  for (let i = 0; i < logits.length; i++) {
    const e = Math.exp(logits[i] - maxLogit);
    exps[i] = e;
    sumExp += e;
  }
  return exps.map((e) => e / sumExp);
}

export function predictProbaSingle(model: SoftmaxModel, x: number[]): number[] {
  const logits = new Array<number>(model.numClasses);
  for (let c = 0; c < model.numClasses; c++) {
    let z = model.biases[c];
    const wRow = model.weights[c];
    for (let f = 0; f < model.numFeatures; f++) {
      z += wRow[f] * x[f];
    }
    logits[c] = z;
  }
  return softmax(logits);
}

export function computeLossAndGradients(
  model: SoftmaxModel,
  X: number[][],
  y: number[],
  l2Lambda: number
): { loss: number; dW: number[][]; db: number[] } {
  const N = X.length;
  const C = model.numClasses;
  const F = model.numFeatures;

  const dW: number[][] = Array.from({ length: C }, () => new Array(F).fill(0));
  const db: number[] = new Array(C).fill(0);
  let dataLoss = 0;

  for (let i = 0; i < N; i++) {
    const probs = predictProbaSingle(model, X[i]);
    const target = y[i];
    dataLoss -= Math.log(Math.max(1e-15, probs[target]));

    for (let c = 0; c < C; c++) {
      const diff = probs[c] - (c === target ? 1 : 0);
      db[c] += diff;
      const xRow = X[i];
      const dwRow = dW[c];
      for (let f = 0; f < F; f++) {
        dwRow[f] += diff * xRow[f];
      }
    }
  }

  let regLoss = 0;
  for (let c = 0; c < C; c++) {
    db[c] /= N;
    for (let f = 0; f < F; f++) {
      const w = model.weights[c][f];
      regLoss += w * w;
      dW[c][f] = dW[c][f] / N + l2Lambda * w;
    }
  }

  return {
    loss: dataLoss / N + 0.5 * l2Lambda * regLoss,
    dW,
    db
  };
}

export function trainSoftmaxModel(
  split: DatasetSplit,
  numClasses: number,
  params: MLHyperparams,
  knnK = 5,
  onProgress?: (epoch: number, loss: number) => void
): { model: SoftmaxModel; metrics: MLMetrics } {
  const numFeatures = split.XTrain[0].length;
  const rng = new SeededRNG(params.seed);

  const model: SoftmaxModel = {
    weights: Array.from({ length: numClasses }, () =>
      Array.from({ length: numFeatures }, () => rng.nextGaussian(0, 0.05))
    ),
    biases: new Array(numClasses).fill(0),
    numClasses,
    numFeatures
  };

  const lossHistory: number[] = [];

  for (let epoch = 1; epoch <= params.epochs; epoch++) {
    const { loss, dW, db } = computeLossAndGradients(
      model,
      split.XTrain,
      split.yTrain,
      params.l2Lambda
    );
    lossHistory.push(loss);

    for (let c = 0; c < numClasses; c++) {
      model.biases[c] -= params.learningRate * db[c];
      for (let f = 0; f < numFeatures; f++) {
        model.weights[c][f] -= params.learningRate * dW[c][f];
      }
    }

    if (onProgress && (epoch % 10 === 0 || epoch === params.epochs)) {
      onProgress(epoch, loss);
    }
  }

  const metrics = evaluateSoftmaxModel(model, split, lossHistory, knnK);
  return { model, metrics };
}

export function evaluateSoftmaxModel(
  model: SoftmaxModel,
  split: DatasetSplit,
  lossHistory: number[],
  knnK = 5
): MLMetrics {
  const C = model.numClasses;
  const argmax = (arr: number[]) => {
    let best = 0;
    for (let i = 1; i < arr.length; i++) if (arr[i] > arr[best]) best = i;
    return best;
  };

  let trainCorrect = 0;
  for (let i = 0; i < split.XTrain.length; i++) {
    if (argmax(predictProbaSingle(model, split.XTrain[i])) === split.yTrain[i]) trainCorrect++;
  }
  const trainAccuracy = trainCorrect / split.XTrain.length;

  const cm: number[][] = Array.from({ length: C }, () => new Array(C).fill(0));
  let testCorrect = 0;
  for (let i = 0; i < split.XTest.length; i++) {
    const pred = argmax(predictProbaSingle(model, split.XTest[i]));
    const actual = split.yTest[i];
    cm[actual][pred]++;
    if (pred === actual) testCorrect++;
  }
  const testAccuracy = testCorrect / split.XTest.length;

  let f1Sum = 0;
  for (let c = 0; c < C; c++) {
    const tp = cm[c][c];
    let fp = 0;
    let fn = 0;
    for (let k = 0; k < C; k++) {
      if (k !== c) {
        fp += cm[k][c];
        fn += cm[c][k];
      }
    }
    const denom = 2 * tp + fp + fn;
    f1Sum += denom > 0 ? (2 * tp) / denom : 0;
  }
  const macroF1 = f1Sum / C;

  const classCounts = new Int32Array(C);
  for (const y of split.yTrain) classCounts[y]++;
  let majorityClass = 0;
  for (let c = 1; c < C; c++) if (classCounts[c] > classCounts[majorityClass]) majorityClass = c;
  const majorityHits = split.yTest.filter((y) => y === majorityClass).length;
  const majorityBaselineAcc = majorityHits / split.XTest.length;

  const knnBaselineAcc = evaluateKNN(
    split.XTrain,
    split.yTrain,
    split.XTest,
    split.yTest,
    knnK,
    C
  );

  return {
    lossHistory,
    trainAccuracy,
    testAccuracy,
    macroF1,
    confusionMatrix: cm,
    majorityBaselineAcc,
    knnBaselineAcc,
    weights: model.weights,
    biases: model.biases
  };
}

export function rankCareersML(
  model: SoftmaxModel,
  userVector: number[],
  careers: Career[]
): MLPrediction[] {
  const probs = predictProbaSingle(model, userVector);
  return careers
    .map((c, idx) => ({ careerId: c.id, probability: probs[idx] }))
    .sort((a, b) => b.probability - a.probability);
}
