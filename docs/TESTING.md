# Verification & Benchmark Metrics

Run all automated tests via `npm test`.

| Component | Test Case | Expected Metric / Behavior | Status |
| :--- | :--- | :--- | :--- |
| **Bayes** | CPT Row Sum Validation | All 16 rows per aptitude & career valid in $[0,1]$ | Pass |
| **Bayes** | Exact Enumeration Check | Matches hand-calculated value (`0.800000`) | Pass |
| **Bayes** | Interest Monotonicity | Increasing Math/Research raises ML Engineer fit | Pass |
| **ML** | Numerical Gradient Check | $|
abla_{	ext{analytical}} - 
abla_{	ext{numerical}}| < 10^{-5}$ | Pass |
| **ML** | Seed Determinism | Identical accuracy & loss trajectory for fixed seed | Pass |
| **ML** | Benchmark vs Baselines | Softmax Test Acc (~88–93%) > Majority (~8.3%) | Pass |
| **CSP** | Constraint Satisfaction | Zero violations on blocked weeks, hours, prereqs, difficulty | Pass |
| **CSP** | Heuristic Efficiency | MRV + FC nodes explored $\le$ Plain Backtracking | Pass |
| **CSP** | Infeasibility Diagnostics | Detects capacity/deadline conflicts & suggests relaxation | Pass |
