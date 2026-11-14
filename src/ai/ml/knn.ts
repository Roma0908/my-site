export function predictKNN(
  XTrain: number[][],
  yTrain: number[],
  xQuery: number[],
  k: number,
  numClasses: number
): number {
  const distances: { dist: number; label: number }[] = new Array(XTrain.length);
  for (let i = 0; i < XTrain.length; i++) {
    let sumSq = 0;
    const row = XTrain[i];
    for (let f = 0; f < xQuery.length; f++) {
      const d = row[f] - xQuery[f];
      sumSq += d * d;
    }
    distances[i] = { dist: sumSq, label: yTrain[i] };
  }

  distances.sort((a, b) => a.dist - b.dist);

  const votes = new Int32Array(numClasses);
  const limit = Math.min(k, distances.length);
  for (let i = 0; i < limit; i++) {
    votes[distances[i].label]++;
  }

  let bestClass = 0;
  for (let c = 1; c < numClasses; c++) {
    if (votes[c] > votes[bestClass]) bestClass = c;
  }
  return bestClass;
}

export function evaluateKNN(
  XTrain: number[][],
  yTrain: number[],
  XTest: number[][],
  yTest: number[],
  k: number,
  numClasses: number
): number {
  let correct = 0;
  for (let i = 0; i < XTest.length; i++) {
    if (predictKNN(XTrain, yTrain, XTest[i], k, numClasses) === yTest[i]) {
      correct++;
    }
  }
  return XTest.length > 0 ? correct / XTest.length : 0;
}
