import { describe, expect, it } from 'vitest';
import careersData from '../../data/careers.json';
import { Career } from '../../types';
import { generateSyntheticDataset } from './dataset';
import {
  computeLossAndGradients,
  softmax,
  SoftmaxModel,
  trainSoftmaxModel
} from './softmax';

const careers = careersData as Career[];

describe('Multinomial Logistic Regression (Week 8)', () => {
  it('softmax outputs sum to 1 and handle large logits safely', () => {
    const probs = softmax([1000, 1002, 999]);
    const sum = probs.reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1.0, 8);
    probs.forEach((p) => {
      expect(p).toBeGreaterThan(0);
      expect(p).toBeLessThan(1);
    });
  });

  it('passes finite-difference numerical gradient check', () => {
    const model: SoftmaxModel = {
      weights: [
        [0.1, -0.2, 0.3],
        [-0.1, 0.4, -0.2],
        [0.2, 0.1, -0.1]
      ],
      biases: [0.05, -0.05, 0.0],
      numClasses: 3,
      numFeatures: 3
    };
    const X = [
      [0.8, 0.2, 0.5],
      [0.1, 0.9, 0.3]
    ];
    const y = [0, 1];
    const l2 = 0.01;
    const { dW } = computeLossAndGradients(model, X, y, l2);

    const eps = 1e-6;
    for (let c = 0; c < 3; c++) {
      for (let f = 0; f < 3; f++) {
        const orig = model.weights[c][f];
        model.weights[c][f] = orig + eps;
        const lossPlus = computeLossAndGradients(model, X, y, l2).loss;
        model.weights[c][f] = orig - eps;
        const lossMinus = computeLossAndGradients(model, X, y, l2).loss;
        model.weights[c][f] = orig;

        const numGrad = (lossPlus - lossMinus) / (2 * eps);
        expect(dW[c][f]).toBeCloseTo(numGrad, 5);
      }
    }
  });

  it('loss decreases during training, training is deterministic with fixed seed, and beats majority baseline', () => {
    const split = generateSyntheticDataset(careers, 123, 80);
    const params = { learningRate: 0.8, epochs: 80, l2Lambda: 0.001, seed: 123 };

    const run1 = trainSoftmaxModel(split, careers.length, params, 3);
    const run2 = trainSoftmaxModel(split, careers.length, params, 3);

    expect(run1.metrics.testAccuracy).toBe(run2.metrics.testAccuracy);
    expect(run1.metrics.lossHistory).toEqual(run2.metrics.lossHistory);

    const losses = run1.metrics.lossHistory;
    expect(losses[losses.length - 1]).toBeLessThan(losses[0]);

    expect(run1.metrics.testAccuracy).toBeGreaterThan(run1.metrics.majorityBaselineAcc + 0.4);
  });
});
