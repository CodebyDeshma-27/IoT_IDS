# An Imbalance-Aware Feature-Selected Gradient Boosting Framework for Reliable IoT Intrusion Detection Under Unseen Attack Families

## 1. Project Overview

This project develops an IoT Intrusion Detection System (IDS) using the **CICIoT2023** dataset and an established Gradient Boosting approach.

The project combines:

- class-imbalance handling
- feature selection
- Gradient Boosting-based intrusion detection
- closed-world evaluation
- unseen attack-family evaluation
- threshold/reliability analysis
- FastAPI backend
- React-based research dashboard and live IDS interface

### Central research question

> **Does high performance on known IoT attacks automatically translate into reliable detection when an entire attack family is unseen during training?**

The project does **not** propose a new machine-learning algorithm. Instead, it uses established techniques and focuses the research contribution on reliability-oriented evaluation.

---

## 2. Problem Statement

IoT networks contain heterogeneous devices and generate highly varied network traffic. Intrusion detection is complicated by:

- severe class imbalance between benign traffic and different attack families
- redundant or less informative network-flow features
- differences between common and low-frequency attacks
- high performance on known attack distributions that may not represent unseen attacks
- false-positive and false-negative trade-offs
- computational requirements of processing large IoT traffic datasets

Many conventional IDS evaluations primarily measure performance when attack families represented during testing are also represented during training.

This creates the central question:

> **How reliable is an IDS when an entire attack family is absent from the training data?**

---

## 3. Research Gap Identified from Literature Review

The literature review examined recent IoT IDS research and focused on papers using datasets and methodological components relevant to the project.

The reviewed work commonly used:

- class balancing / sampling
- feature selection or dimensionality reduction
- ensemble learning
- Gradient Boosting models
- XGBoost, LightGBM, CatBoost and related methods
- lightweight or computationally efficient IDS approaches
- explainability and robustness techniques

A recurring limitation was that high closed-world classification performance did not necessarily establish reliable generalization to an **entirely unseen attack family**.

### Identified gap

> **High closed-world accuracy does not guarantee reliable detection of unseen attack families.**

The project turns this gap into an explicit experiment:

1. closed-world evaluation, where attack families are represented during training
2. unseen attack-family evaluation, where an entire family is held out from training

---

## 4. Proposed Solution

The project uses an imbalance-aware, feature-selected Gradient Boosting framework.

```text
CICIoT2023
     |
     v
Data Analysis
     |
     v
Preprocessing
     |
     v
Class Imbalance Handling
     |
     v
Feature Selection
39 -> 20 features
     |
     v
Gradient Boosting IDS
XGBoost
     |
     +----------------------+
     |                      |
     v                      v
Closed-World          Unseen Attack-Family
Evaluation                 Evaluation
     |                      |
     +----------+-----------+
                |
                v
        Reliability Analysis
        FPR / FNR / Threshold
                |
                v
         Final Research Findings
```

The experimental design considered XGBoost, LightGBM and CatBoost. XGBoost and CatBoost were successfully trained. LightGBM could not be evaluated in the final Windows environment because its native training repeatedly produced an access-violation error. The final reported evaluation therefore uses XGBoost as the primary model.

---

## 5. Dataset — CICIoT2023

| Characteristic | Value |
|---|---:|
| IoT devices | 105 |
| Attack types | 33 |
| Attack families | 7 + Benign |
| Original numerical features | 39 |
| Approximate records | 46.7 million |
| ML input | CSV network-flow records |

### Attack families

- DDoS
- DoS
- Mirai
- Recon
- Spoofing
- Web-based
- Brute Force
- Benign

### Observed family distribution

| Family | Records | Approx. share |
|---|---:|---:|
| DDoS | 33,984,450 | 72.65% |
| DoS | 7,845,120 | 16.77% |
| Mirai | 2,634,054 | 5.63% |
| Benign | 1,098,191 | 2.35% |
| Recon | 690,534 | 1.48% |
| Spoofing | 486,458 | 1.04% |
| Web-based | 24,829 | 0.05% |
| Brute Force | 13,064 | 0.03% |

This distribution demonstrates why accuracy alone is insufficient for evaluating the IDS.

---

## 6. Data Preprocessing

The dataset contains 309 CSV files across 34 folders.

The preprocessing pipeline includes:

1. recursive CSV discovery
2. attack-type and attack-family mapping
3. file-level experiment organization
4. infinite-value handling
5. missing-value handling
6. training-only median imputation
7. target encoding
8. training-only sampling
9. leakage checks
10. validation/test preservation

### Data-quality observations

- 39 numerical features were present.
- Missing cells were extremely rare.
- Infinite values were found only in the `Rate` feature.
- No globally constant features were found.
- Validation and test data were kept untouched during training sampling and feature-selection fitting.

---

## 7. Class-Imbalance Handling

The training pool contained approximately 27.19 million rows.

Stratified undersampling was applied at the attack-type level with a maximum of **100,000 rows per attack type**.

Result:

> **2,189,082 sampled training rows**

Validation and test data were not undersampled.

This keeps the training process computationally manageable while avoiding artificial balancing of the final evaluation distribution.

---

## 8. Feature Selection

The original dataset contains 39 numerical features.

An established XGBoost gain-based feature-importance procedure was used:

1. create a stratified training-only subset
2. train XGBoost
3. calculate gain-based importance
4. calculate the median importance threshold
5. retain features meeting the threshold

### Result

```text
39 original features
        |
        v
XGBoost gain importance
        |
        v
Median gain threshold
        |
        v
20 selected features
```

### Selected features

1. Protocol Type
2. Number
3. Tot size
4. Tot sum
5. fin_count
6. Min
7. UDP
8. Variance
9. HTTPS
10. AVG
11. SSH
12. syn_count
13. syn_flag_number
14. TCP
15. fin_flag_number
16. rst_count
17. Std
18. psh_flag_number
19. ack_count
20. Header_Length

Feature-count reduction:

> **39 → 20 (48.7%)**

---

## 9. Model Development

### Primary final model

**XGBoost**

Final tuned configuration:

- n_estimators = 150
- max_depth = 8
- learning_rate = 0.05
- subsample = 0.8
- colsample_bytree = 0.8
- tree_method = hist
- random_state = 42
- n_jobs = 2

CatBoost was also successfully trained during model development. LightGBM was not included in the final evaluation because of the Windows native access-violation issue.

---

## 10. Hyperparameter Tuning

Tuning used a 120,000-row stratified training subset:

- 96,000 rows for fitting
- 24,000 rows for internal validation

Best XGBoost configuration:

| Parameter | Value |
|---|---:|
| n_estimators | 150 |
| max_depth | 8 |
| learning_rate | 0.05 |
| subsample | 0.8 |
| colsample_bytree | 0.8 |
| Accuracy | 84.00% |
| Macro-F1 | 64.63% |
| Balanced Accuracy | 61.80% |

---

## 11. Closed-World Evaluation

Final multiclass test:

- Training: 2,189,082 sampled rows
- Test: 9,984,245 untouched rows
- Features: 20
- Model: tuned XGBoost

| Metric | Result |
|---|---:|
| Accuracy | 83.25% |
| Macro Precision | 64.32% |
| Macro Recall | 54.31% |
| Macro F1 | 53.06% |
| Balanced Accuracy | 62.07% |
| Macro FPR | 5.61% |
| Macro FNR | 33.19% |

The difference between accuracy and Macro-F1 demonstrates why imbalance-aware metrics are important.

---

## 12. Binary Closed-World Evaluation

The matched binary experiment classifies:

```text
Benign = 0
Attack = 1
```

| Metric | Result |
|---|---:|
| Accuracy | 98.29% |
| Precision | 98.44% |
| Recall | 99.82% |
| F1 | 99.13% |
| Balanced Accuracy | 73.98% |
| FPR | 51.87% |
| FNR | 0.18% |

The high recall and F1 should not be interpreted independently of the high false-positive rate.

---

## 13. Unseen Attack-Family Evaluation

This is the central experiment.

An entire attack family is excluded from training and then evaluated with benign traffic.

Completed experiments:

- DDoS
- DoS
- Mirai

### Unseen DDoS

| Metric | Result |
|---|---:|
| Accuracy | 98.00% |
| Precision | 97.96% |
| Recall | 100.00% |
| F1 | 98.97% |
| Balanced Accuracy | 74.79% |
| FPR | 50.42% |

### Unseen DoS

| Metric | Result |
|---|---:|
| Accuracy | 92.27% |
| Precision | 91.66% |
| Recall | 100.00% |
| F1 | 95.65% |
| Balanced Accuracy | 74.30% |
| FPR | 51.40% |

### Unseen Mirai

| Metric | Result |
|---|---:|
| Accuracy | 82.02% |
| Precision | 78.49% |
| Recall | 100.00% |
| F1 | 87.95% |
| Balanced Accuracy | 73.83% |
| FPR | 52.33% |

---

## 14. Key Research Finding

Matched binary closed-world:

- Accuracy = **98.29%**
- F1 = **99.13%**

Unseen Mirai:

- Accuracy = **82.02%**
- F1 = **87.95%**

Observed change:

```text
Accuracy: -16.28 percentage points
F1:       -11.18 percentage points
```

Therefore:

> **High closed-world performance does not automatically guarantee reliable detection of unseen attack families.**

This directly addresses the research gap identified from the literature review.

This is an experimental finding for the evaluated CICIoT2023 setup, not proof of universal real-world zero-day detection.

---

## 15. Reliability and Threshold Analysis

Threshold sensitivity:

| Threshold | Accuracy | F1 | Balanced Accuracy | FPR | FNR |
|---:|---:|---:|---:|---:|---:|
| 0.50 | 98.29% | 99.13% | 73.98% | 51.87% | 0.18% |
| 0.70 | 98.91% | 99.44% | 90.50% | 18.43% | 0.56% |
| 0.95 | 98.58% | 99.26% | 99.09% | 0.37% | 1.46% |

The results show a clear false-positive/false-negative operating trade-off.

These are sensitivity-analysis points, not an independently selected deployment threshold.

---

## 16. System Architecture

```text
                    CICIoT2023
                        |
                        v
               Data Preprocessing
                        |
                        v
             Imbalance Handling
                        |
                        v
               Feature Selection
                  39 -> 20
                        |
                        v
                 XGBoost IDS
                        |
            +-----------+-----------+
            |                       |
            v                       v
     Closed-World              Unseen Family
       Evaluation                Evaluation
            |                       |
            +-----------+-----------+
                        |
                        v
               Reliability Analysis
                        |
                        v
                    FastAPI
                        |
                        v
                React Frontend
                  /                         /                 Research Mode     Live IDS Mode
```

---

## 17. Backend

FastAPI endpoints:

| Endpoint | Purpose |
|---|---|
| `GET /` | API root |
| `GET /health` | Backend/model health |
| `GET /features` | Selected feature information |
| `GET /performance` | Performance results |
| `GET /unseen-evaluation` | Unseen-family results |
| `GET /reliability` | Threshold results |
| `GET /summary` | Final research summary |
| `POST /predict` | Live prediction |

The verified `/predict` flow accepts the 20 selected features and returns a prediction, confidence/probability information and attack status.

---

## 18. Frontend

The frontend is an interactive **IoT IDS Research Platform**.

Recommended stack:

- React
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- Lucide React

### Research Mode

- Overview
- Dataset & Methodology
- Feature Analysis
- Model Performance
- Unseen Attack Evaluation
- Reliability Analysis

### Live IDS Mode

```text
Network-flow features
        |
        v
20 selected features
        |
        v
FastAPI
        |
        v
XGBoost
        |
        v
Benign / Attack
        |
        v
Attack family + confidence
```

The frontend should consume real backend results and should not invent model metrics.

---

## 19. Project Structure

```text
IoT_IDS/
├── data/
│   ├── raw/
│   └── processed/
├── notebooks/
│   ├── 01_dataset_analysis.ipynb
│   ├── 02_preprocessing.ipynb
│   ├── 03_feature_selection.ipynb
│   ├── 04_model_training.ipynb
│   ├── 05_model_tuning.ipynb
│   ├── 06_closed_world_evaluation.ipynb
│   ├── 07_unseen_attack_evaluation.ipynb
│   └── 08_reliability_analysis.ipynb
├── models/
├── results/
│   ├── final_test/
│   ├── unseen_family/
│   ├── binary_comparison/
│   ├── hyperparameter_tuning/
│   └── final_analysis/
├── backend/
│   ├── app.py
│   └── requirements.txt
└── frontend/
    └── React application
```

---

## 20. Notebook Workflow

| Notebook | Main work |
|---|---|
| 01 | Dataset discovery, labels, family distribution, quality checks |
| 02 | Preprocessing, splits, imbalance sampling |
| 03 | XGBoost gain feature selection |
| 04 | Model training |
| 05 | Hyperparameter tuning |
| 06 | Closed-world evaluation |
| 07 | Unseen attack-family evaluation |
| 08 | Reliability, threshold analysis and final research summary |

---

## 21. What Is Unique About the Project?

The project does not claim novelty from inventing XGBoost, feature selection or sampling.

The contribution is evaluation-oriented:

1. established imbalance handling
2. 39 → 20 feature reduction
3. tuned Gradient Boosting IDS
4. conventional closed-world evaluation
5. entire attack-family holdout
6. unseen-family evaluation
7. quantified degradation
8. false-positive/false-negative threshold analysis
9. interactive live prediction through FastAPI + React

### Contribution statement

> **A reliability-oriented evaluation framework for determining whether an imbalance-aware, feature-selected Gradient Boosting IDS generalizes from known IoT attack distributions to unseen attack families.**

---

## 22. Limitations

1. Evaluation uses CICIoT2023 only.
2. Completed primary unseen-family experiments cover DDoS, DoS and Mirai.
3. The unseen-family setup is zero-day-like, not proof of universal real-world zero-day detection.
4. The default binary threshold produces a high false-positive rate.
5. Threshold sensitivity is not an independently selected deployment threshold.
6. LightGBM could not be evaluated because of a Windows native access-violation issue.
7. Streaming, concept drift and adversarial robustness were not fully evaluated.
8. The project uses flow-level tabular features rather than raw packet sequences.
9. CICIoT2023 is a benchmark dataset and may not capture every operational IoT environment.

---

## 23. Future Work

- cross-dataset validation
- streaming traffic evaluation
- concept-drift detection
- independent threshold calibration
- additional unseen-family experiments
- cost-sensitive learning
- probability calibration
- temporal/sequence modeling
- adversarial robustness testing
- edge/IoT deployment
- live network-flow collection
- explainability using established methods

---

## 24. Conclusion

This project developed and evaluated an imbalance-aware, feature-selected Gradient Boosting framework for IoT intrusion detection using CICIoT2023.

The project addresses a literature gap by moving beyond conventional closed-world evaluation and explicitly testing the model when complete attack families are excluded from training.

The closed-world binary model achieved **98.29% accuracy and 99.13% F1**. However, unseen-family evaluation showed measurable degradation, with Mirai producing the largest observed decrease: **16.28 percentage points in accuracy and 11.18 percentage points in F1** relative to the matched binary closed-world experiment.

Threshold analysis additionally showed that the false-positive/false-negative operating point changes substantially with the decision threshold.

### Final conclusion

> **High closed-world performance alone is insufficient to establish reliable IoT intrusion detection. Unseen attack-family evaluation and reliability analysis provide additional evidence about how an IDS behaves beyond the attack distributions represented during training.**

---

## 25. Demonstration Flow

```text
Overview
   ↓
Dataset & Methodology
   ↓
Feature Selection
   ↓
Closed-World Performance
   ↓
Unseen Attack-Family Evaluation
   ↓
Reliability Analysis
   ↓
Live IDS Prediction
   ↓
Final Research Finding
```

The strongest demonstration is:

```text
Closed World
98.29% Accuracy
      ↓
Hold out Mirai
      ↓
Unseen Mirai
82.02% Accuracy
      ↓
-16.28 percentage points
```

---

## 26. Project Status

### Completed

- Literature review
- Research gap identification
- CICIoT2023 analysis
- preprocessing
- class-imbalance handling
- feature selection
- model training
- hyperparameter tuning
- closed-world evaluation
- unseen-family evaluation
- reliability analysis
- final analysis
- FastAPI backend
- prediction API

### Finalization

- React frontend integration
- frontend/backend testing
- screenshots
- final report
- presentation
- viva preparation

---

## 27. References

**Dataset**

E. C. P. Neto et al., “CICIoT2023: A real-time dataset and benchmark for large-scale attacks in IoT environment,” *Sensors*, 2023, 23(13), 5941.

**Primary methodological/base paper**

Salah A. Almahaqeri et al., “An Optimized Gradient Boosting Framework for IoT Intrusion Detection: A Comprehensive Evaluation on the CICIoT2023 Dataset,” *Scientific Reports*, 2026.

**Project title**

*An Imbalance-Aware Feature-Selected Gradient Boosting Framework for Reliable IoT Intrusion Detection Under Unseen Attack Families*
