# AI Algorithms Specification

## 1. Bayesian Network (Week 6)
- **Purpose:** Compute posterior probability $P(	ext{Fit}=	ext{high} \mid 	ext{Interests})$ via latent binary aptitudes (`Analytical`, `Creative`, `Social`, `Technical`).
- **Input:** 6 discrete interest levels $\in \{0, 1, 2, 3\}$.
- **Output:** Posterior probabilities in $[0, 1]$ for 12 careers and per-aptitude contribution lift.
- **Stages:** Evidence lookup $ightarrow$ Joint probability calculation over $2^4 = 16$ latent masks $ightarrow$ Marginalization $ightarrow$ Sensitivity lift ranking.
- **Test:** `src/ai/bayes/bayes.test.ts` (CPT row sum check, exact analytical match on uniform 0.5 network, monotonicity check).
- **Limitations:** Expert-estimated CPTs; assumes conditional independence among latent aptitudes given observed interests.

## 2. Multinomial Logistic Regression (Week 8)
- **Purpose:** Multi-class classification of a 21-dimensional student profile vector into 12 career classes.
- **Input:** Normalized feature vector $x \in [0, 1]^{21}$ (6 interests + 15 skills).
- **Output:** Softmax probability distribution over 12 careers.
- **Stages:** Synthetic data generation (3,000 samples, Gaussian noise $\sigma=0.16$, 5% label noise, stratified 80/20 split) $ightarrow$ Forward pass $ightarrow$ Cross-Entropy + L2 gradient descent $ightarrow$ Evaluation vs Majority and k-NN baselines.
- **Test:** `src/ai/ml/ml.test.ts` (Finite-difference numerical gradient check, loss monotonicity, deterministic seed check).
- **Limitations:** Synthetic training distribution; linear class boundaries.

## 3. Constraint Satisfaction Problem (Week 3)
- **Purpose:** Schedule uncompleted learning modules into weeks $1 \dots N$.
- **Input:** Module list (hours, difficulty, prerequisites) and user constraints (weekly hours, max modules/week, deadline, blocked weeks).
- **Output:** Valid week assignment or conflict diagnosis + relaxation proposal.
- **Stages:** Input validation $ightarrow$ MRV + Degree variable selection $ightarrow$ Consistency check $ightarrow$ Forward Checking domain pruning $ightarrow$ Backtracking upon wipeout.
- **Test:** `src/ai/csp/csp.test.ts` (Constraint satisfaction check, infeasible detection, MRV+FC node count $\le$ plain backtracking).
- **Limitations:** Exponential worst-case search bounded by `MAX_NODES = 8000`.
