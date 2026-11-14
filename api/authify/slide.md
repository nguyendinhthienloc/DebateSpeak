---
marp: true
lang: en
theme: default
paginate: true
header: "CS420 · Seminar S09"
footer: "SMOTE and Imbalanced Learning"
size: 16:9
style: |
  section { font-family: 'Segoe UI', sans-serif; font-size: 24px; padding: 42px 48px; color: #172033; }
  h1 { color: #123c69; font-size: 42px; }
  h2 { color: #123c69; font-size: 33px; }
  strong { color: #075985; }
  table { font-size: 22px; margin: 12px auto; }
  th { background: #e0f2fe; }
  .cols { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; align-items: center; }
  .small { font-size: 19px; }
  .center { text-align: center; }
---

# SMOTE and Imbalanced Data
## When High Accuracy Isn't Enough

CS420 — Introduction to Artificial Intelligence · Topic S09

Nguyen Hong Tan Tai — 24125078<br>
Nguyen Minh Phu — 24125103<br>
Tran Le Anh Tuan — 24125107

**Question:** How many defective products were detected, and with how many false alarms?

<!-- 0:00–0:45. Introduce the problem and team; do not read all information line by line. -->

---

## 1. 95% Accuracy — Still Missing All Defective Items

1000 products: **950 good**, **50 defective**. Predicting all as good:

| | Predicted Good | Predicted Defective |
|---|---:|---:|
| Actual Good | TN = 950 | FP = 0 |
| Actual Defective | FN = 50 | TP = 0 |

$$Accuracy=\frac{950}{1000}=95\%,\qquad Recall=\frac{0}{50}=0\%$$

**Accuracy describes the overall set; minority class metrics are required.**

<!-- 0:45–2:15. This is Zero-Rule, different from the Baseline Logistic Regression in the experiment. -->

---

## 2. Correctly Interpreting Misclassifications

**Positive class represents defective products (y=1).**

$$Precision=\frac{TP}{TP+FP},\quad Recall=\frac{TP}{TP+FN},\quad F_1=\frac{2TP}{2TP+FP+FN}$$

- **Precision:** Among all alarms, how many are actually defective?
- **Recall:** Among all actual defects, how many were detected?
- **FP:** Incorrectly inspecting a good product; **FN:** Missing a defective product.
- Zero denominator: undefined metric; explicitly set to 0 in code via **zero_division=0**.

<!-- 2:15–4:00. Note the asymmetric costs of FP and FN; undefined Precision differs from division by zero. -->

---

## 3. Three Resampling Approaches

| Method | Operation | Trade-off |
|---|---|---|
| RUS | Remove majority samples | Risk of information loss |
| ROS | Duplicate minority samples | Increases weight of repeated observations |
| SMOTE | Interpolate between minority neighbors | May generate synthetic points in overlapping regions |

<div class="center">

![w:760 h:270](../figures/class_distribution_before_after.png)

</div>

<!-- 4:00–5:00. Figure shows train set 760/40, not resampling all 1000 samples. Switch speakers if dividing into 3 parts. -->

---

## 4. How Does SMOTE Generate Synthetic Points?

1. Select a minority sample $x_i$.
2. Find its $k$-nearest neighbors **from the same class**, excluding itself.
3. Select $x_j$ within the neighborhood, sample $\lambda\sim U(0,1)$.

$$x_{new}=x_i+\lambda(x_j-x_i)=(1-\lambda)x_i+\lambda x_j$$

- $1\leq k\leq N_{\min}-1$, recalculated based on the number of samples in each fold.
- Synthetic points lie strictly on the line segment connecting samples; never outside the convex hull of the original set.
- **Hand calculation example: k=3. Benchmark: k=5.**

<!-- 5:00–6:15. Explain non-negative weights summing to 1. -->

---

## 5. Hand Calculation for Three 2D Points

<div class="cols">
<div class="small">

$P_1=(2,3)$; $P_2=(2.5,4)$; $P_3=(3,2.5)$; $P_4=(1.5,3.5)$; $P_5=(4,5)$.

Neighborhood of P1: **P4, P2, P3**.<br>
Distances: **0.7071; 1.1180; 1.1180**.

| Pair | λ | Synthetic Point |
|---|---:|---|
| P1 → P4 | 0.40 | (1.8, 3.2) |
| P1 → P2 | 0.75 | (2.375, 3.75) |
| P3 → P1 | 0.60 | (2.4, 2.8) |

$S_1=(2,3)+0.4(-0.5,0.5)$

</div>
<div>

![w:510 h:390](../figures/smote_step_by_step_calculation.png)

</div>
</div>

<!-- 6:15–7:45. Present S1 in detail, show results for S2/S3; full details are available in the report and JSON. -->

---

## 6. Preventing Data Leakage

<div class="center">

![w:850 h:400](../figures/evaluation_workflow_diagram.png)

</div>

**5-fold CV strictly on train set:** fit 640, validate 160 per fold; re-fit the entire Pipeline each iteration.

<!-- 7:45–9:00. Test set is transformed using fitted scaler only; never resampled. Do not call this nested CV. -->

---

## 7. Fair Comparison Setup

- **Synthetic dataset:** 1000 samples, 2 features, 2 clusters/class, 95/5 ratio.
- **Configuration:** class_sep=1.1, flip_y=0, seed=42.
- **Fixed Model:** Logistic Regression, C=1, lbfgs, threshold **0.5**.
- **Fixed Test Set:** 190 good samples and 10 defective samples, maintaining natural distribution.
- **Train:** StandardScaler → sampler (if any) → classifier.
- **CV:** Stratified 5-fold CV on 800 training samples; threshold is not tuned on test set.

<div class="small">Simulated features used for demonstration; not real-world industrial testing data.</div>

<!-- 9:00–10:00. Summarize fixed conditions; switch speakers. -->

---

## 8. Results on the Same 200-Sample Test Set

<!-- AUTO:HOLDOUT:START -->
| Method | TP | FP | FN | Precision | Recall | F1 |
|---|---:|---:|---:|---:|---:|---:|
| Baseline | 3 | 2 | 7 | 0.600 | 0.300 | 0.400 |
| RUS | 10 | 22 | 0 | 0.312 | 1.000 | 0.476 |
| ROS | 10 | 27 | 0 | 0.270 | 1.000 | 0.426 |
| SMOTE | 10 | 22 | 0 | 0.312 | 1.000 | 0.476 |
<!-- AUTO:HOLDOUT:END -->

<div class="center">

![w:930 h:195](../figures/confusion_matrices.png)

</div>

**SMOTE and RUS achieve identical Precision, Recall, and F1 at threshold 0.5.**

<!-- 10:00–11:15. Compared to Baseline: caught 7 more defects, at the cost of 20 additional false alarms. -->

---

## 9. Cross-Validation and Precision–Recall Curves

<!-- AUTO:CV:START -->
| Method | CV F1 (mean ± std) | Test PR-AUC | Test AP |
|---|---:|---:|---:|
| Baseline | 0.496 ± 0.122 | 0.635 | 0.655 |
| RUS | 0.368 ± 0.040 | 0.567 | 0.595 |
| ROS | 0.421 ± 0.062 | 0.571 | 0.598 |
| SMOTE | 0.417 ± 0.050 | 0.583 | 0.611 |
<!-- AUTO:CV:END -->

<div class="center">

![w:740 h:230](../figures/roc_pr_curves.png)

</div>

<div class="small">CV evaluated on training set only; std does not represent a confidence interval. Trapezoidal PR-AUC and AP are two distinct summarization techniques.</div>

<!-- 11:15–12:30. A high ROC-AUC does not guarantee high Recall/Precision at a threshold of 0.5. -->

---

## 10. Alignment with Literature and Limitations

<div class="cols">
<div>

**Chawla et al. (2002)**

- Evaluated using ROC curves; used C4.5, Ripper, Naive Bayes.
- Combining SMOTE + undersampling can yield improved results.
- This study uses Logistic Regression on synthetic data: **not a direct replication**.

</div>
<div>

**Key Considerations**

- Feature scaling impacts neighborhood distance.
- Sensitivity to outliers and overlapping class boundaries.
- Categorical features: require SMOTENC for mixed datasets.
- Test set contains only **10 defective samples**: a single sample shifts Recall by 0.1.

</div>
</div>

<!-- 12:30–13:45. Do not claim SMOTE is universally superior; refer to the main report for outlier illustrations. -->

---

## 11. Conclusion

1. **Target Class Evaluation:** Evaluate Accuracy alongside Precision, Recall, and FP/FN.
2. **Data Splitting First:** Fit scalers/samplers exclusively on the training split of each fold.
3. **SMOTE Involves Trade-offs:** Increased Recall in this scenario, accompanied by additional false alarms.
4. **Evidence-Based Conclusions:** Test F1 matches RUS; general superiority remains unproven on this setup.

Future Work: Evaluation on real-world datasets, fixed multi-split experiments, cost-sensitive class weights, and validation-based threshold optimization.

<!-- 13:45–15:00. Do not present future work directions as already completed results. -->

---

# Thank You — Q&A

**Key References**

- [Chawla et al. (2002), SMOTE, JAIR](https://arxiv.org/abs/1106.1813).
- [Lemaître et al. (2017), imbalanced-learn, JMLR](https://jmlr.org/papers/v18/16-365.html).
- [Saito & Rehmsmeier (2015), Precision–Recall](https://doi.org/10.1371/journal.pone.0118432).
- [Pipeline and Data Leakage Documentation](https://imbalanced-learn.org/stable/common_pitfalls.html).
- [Average Precision Definition](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.average_precision_score.html).

<div class="small">ChatGPT/Codex was utilized to assist with code generation, verification, and editorial revisions. Source code, configurations, and raw outputs are archived for independent verification.</div>

<!-- 15:00–20:00. All three team members available for Q&A. -->