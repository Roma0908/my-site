# CareerPath AI Dataset Documentation

## Important Disclaimer on Estimates
All numerical values in `careers.json` and `bayes_cpt.json` (skill requirements `0–5`, module study hours, difficulty ratings, and conditional probability tables) are **synthetic pedagogical estimates** created specifically for the university *AI Fundamentals* final project.

- **No invented statistics:** Salary figures, employment percentages, and unverified external citations are intentionally omitted.
- **Sources field:** Each career object in `careers.json` includes an empty `"sources": []` array reserved for the student team to populate with verified local labor market references during project presentation.
- **ML Synthetic Data:** The training dataset (~3,000 samples) is generated procedurally from career prototype vectors with Gaussian noise and 5% label noise using a deterministic PRNG (`Mulberry32`).
