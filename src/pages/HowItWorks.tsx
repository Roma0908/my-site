import React from 'react';
import { BookOpen } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const sections = [
    {
      title: '1. Bayesian Network — Exact Inference by Enumeration (Course Week 6)',
      purpose:
        'Models uncertainty between a student’s stated interests and latent cognitive/social aptitudes to compute posterior career fit probabilities.',
      input: '6 discrete interest scores in {0, 1, 2, 3}.',
      output: 'P(Fit = high | Evidence) for all 12 careers + aptitude contribution lift.',
      stages: [
        'Observe 6 interest evidence nodes.',
        'Look up conditional probabilities P(Aptitude_i = 1 | Parents) for 4 binary latent aptitudes: Analytical, Creative, Social, Technical.',
        'Enumerate all 2^4 = 16 joint aptitude assignments and sum P(Fit=high | a) * P(a | Evidence).',
        'Compute marginal lift per aptitude to explain why a career scored high.'
      ],
      limitations:
        'Relies on expert-estimated CPT tables rather than longitudinal employment records; assumes conditional independence among latent aptitudes given interests.'
    },
    {
      title: '2. Multinomial Logistic Regression — Softmax + L2 (Course Week 8)',
      purpose:
        'Supervised multi-class classifier mapping a 21-dimensional student profile vector (6 interests + 15 skills) onto 12 career classes.',
      input: 'Normalized feature vector x in [0, 1]^21.',
      output: '12-class probability distribution via numerically stable Softmax + Top-3 careers.',
      stages: [
        'Generate ~3,000 synthetic student profiles (250/class + Gaussian noise + 5% label noise) using seeded Mulberry32 PRNG, split 80/20 stratified.',
        'Compute logits z = Wx + b and apply max-shifted Softmax.',
        'Minimize Cross-Entropy Loss + L2 penalty (lambda/2)||W||^2 via batch Gradient Descent inside a Web Worker.',
        'Evaluate Test Accuracy, Macro-F1, and Confusion Matrix against Majority-Class and hand-written k-NN baselines.'
      ],
      limitations:
        'Trained on synthetic prototype-perturbed data; linear decision boundaries cannot capture complex XOR-style feature interactions without feature engineering.'
    },
    {
      title: '3. Constraint Satisfaction Problem — Backtracking + MRV + Forward Checking (Course Week 3)',
      purpose:
        'Schedules missing learning modules into weekly slots 1..N while respecting all academic and personal time constraints.',
      input: 'Uncompleted learning modules (variables), week slots 1..N (domains), and hard constraints.',
      output: 'Valid week assignment map or conflict explanation with relaxation advice.',
      stages: [
        'Select next unassigned module with Minimum Remaining Values (MRV), breaking ties by Degree Heuristic.',
        'Test candidate week against blocked weeks, weekly hours cap, max modules/week, difficulty balance (max 1 hard module/week), and prerequisite order.',
        'Apply Forward Checking to prune invalid weeks from remaining modules; backtrack immediately upon domain wipeout.'
      ],
      limitations:
        'Exponential worst-case search bounded by `MAX_NODES = 8000`.'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" /> How CareerPath AI Works (Oral Defence Guide)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Every algorithm is implemented from scratch in plain TypeScript inside <code>src/ai/</code> with zero external ML libraries.
        </p>
      </div>

      {sections.map((sec) => (
        <div
          key={sec.title}
          className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3"
        >
          <h2 className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{sec.title}</h2>
          <p className="text-sm">
            <strong>Purpose:</strong> {sec.purpose}
          </p>
          <div className="grid sm:grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
            <div>
              <strong>Input:</strong> {sec.input}
            </div>
            <div>
              <strong>Output:</strong> {sec.output}
            </div>
          </div>
          <div className="text-sm">
            <strong>Algorithm Stages:</strong>
            <ol className="list-decimal list-inside space-y-1 mt-1 text-slate-700 dark:text-slate-300">
              {sec.stages.map((st, i) => (
                <li key={i}>{st}</li>
              ))}
            </ol>
          </div>
          <p className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl">
            <strong>Limitations:</strong> {sec.limitations}
          </p>
        </div>
      ))}
    </div>
  );
};
