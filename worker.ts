import { Career, MLHyperparams } from '../../types';
import { generateSyntheticDataset } from './dataset';
import { trainSoftmaxModel } from './softmax';

export interface TrainWorkerRequest {
  careers: Career[];
  params: MLHyperparams;
  knnK: number;
}

self.onmessage = (event: MessageEvent<TrainWorkerRequest>) => {
  const { careers, params, knnK } = event.data;
  const split = generateSyntheticDataset(careers, params.seed, 250);
  const { model, metrics } = trainSoftmaxModel(
    split,
    careers.length,
    params,
    knnK,
    (epoch, loss) => {
      self.postMessage({ type: 'progress', epoch, loss });
    }
  );
  self.postMessage({ type: 'done', model, metrics });
};
