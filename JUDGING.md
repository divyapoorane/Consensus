# Consensus Judging Engine & Normalization Methodology

## 1. Assignment Strategy
- **Conflict of Interest Detection**: Automatic verification that jurors are not members of the presenting squad or contributors to the project repository.
- **Track Expertise Matching**: Juror domain tags match challenge categories (Security, AI, Accessibility, Developer Tools).

## 2. Quantitative Scoring Rubric
- Technical Architecture (30%)
- Innovation & Novelty (25%)
- Execution & Demo Proof (25%)
- UI / UX Polish (10%)
- Presentation & Documentation (10%)

## 3. Cross-Judge Normalization Math
To prevent biased outcomes from overly harsh or generous reviewers:
$$\mu_j = \frac{1}{|P_j|} \sum_{p \in P_j} S_{j,p}, \quad \sigma_j = \sqrt{\frac{1}{|P_j|} \sum_{p \in P_j} (S_{j,p} - \mu_j)^2}$$
$$Z_{j,p} = \frac{S_{j,p} - \mu_j}{\sigma_j + \epsilon}$$
Normalized composite scores are rescaled into standard $[0, 100]$ space with quadratic outlier rejection before winner culmination.
