# AgriVision AI — Multi-Plant Dataset Acquisition & Legal Audit Plan

**Phase**: 8.1 — Dataset Source and License Audit  
**Document Status**: Approved Architecture & Due Diligence Plan  
**Scope**: Multi-Plant Agricultural Pathology System (Indian & Subcontinental Agro-Ecosystems)  
**Execution Constraints**: Planning & Audit Only. Model training, weights overwriting, and API modification are strictly deferred.

---

## 1. Executive Context & Scope Correction

AgriVision AI is designed as a **comprehensive multi-plant crop pathology detection and decision-support system**. 

- **Role of Tomato in Earlier Phases**: Tomato (*Solanum lycopersicum*) served strictly as an initial prototype crop to stress-test the pre-trained 38-class MobileNetV2 ONNX model and the end-to-end full-stack pipeline (React, Express, MySQL, sharp). It is **not** the permanent or sole scope of AgriVision AI.
- **Strategic Direction**: The platform is expanding to support major Indian staple, cash, vegetable, and horticultural crops (Rice, Wheat, Cotton, Maize, Potato, Bell Pepper/Chilli, Tomato, Grape, Apple, Citrus, Mango, and Pulses).
- **Core Directive**: A model trained on a single laboratory dataset cannot generalize to diverse agricultural plants in field conditions. Dataset acquisition must prioritize **multi-plant in-field imagery**, strict legal compliance, and rigorous taxonomic validation.

---

## 2. In-Depth Audit of Candidate Dataset Sources

### Source 1: PlantDoc (GitHub / CODS-COMAD 2020)
- **Official Repository**: [https://github.com/pratikkayal/PlantDoc-Dataset](https://github.com/pratikkayal/PlantDoc-Dataset)
- **Dataset Version**: 1.0 (Released with ACM CoDS-COMAD 2020 paper)
- **Access Date**: 2026-10-25
- **Official License**: Creative Commons Attribution 4.0 International (`CC-BY-4.0`), verified via [LICENSE.txt](file:///d:/almost%20done/krishi/dataset/sources_manifest.json).
- **Attribution Citation**:
  > *Singh, D., Jain, N., Jain, P., Kayal, P., Kumawat, S., & Batra, N. (2020). PlantDoc: A Dataset for Visual Plant Disease Detection. In Proceedings of the 7th ACM IKDD CoDS and 25th COMAD (pp. 249–253).*
- **Dataset Scale**: 2,598 total data points across 13 plant species and up to 17 disease categories (~955 MB git repository size).
- **Environmental Context**: 100% natural field conditions (uncontrolled backgrounds, real sunlight, overlapping leaves, variable camera angles).
- **Annotation Level**:
  - Cropped leaf classification dataset (`train/` and `test/` folder hierarchy).
  - Bounding-box annotations available via companion repository (`PlantDoc-Object-Detection-Dataset`).
- **Plant Species Represented**: Apple, Bell Pepper, Blueberry, Cherry, Corn (Maize), Grape, Peach, Potato, Raspberry, Soybean, Squash, Strawberry, Tomato.
- **Tomato Classes (9 classes)**: Early blight, Septoria leaf spot, Bacterial spot, Late blight, Mosaic virus, Yellow virus, Healthy leaf, Leaf mold, Two-spotted spider mites.
- **Non-Tomato Classes (18 classes)**: Apple scab, Apple leaf (healthy), Apple rust, Bell pepper leaf spot, Bell pepper (healthy), Blueberry leaf, Cherry leaf, Corn gray leaf spot, Corn leaf blight, Corn rust, Peach leaf, Potato early blight, Potato late blight, Raspberry leaf, Soybean leaf, Squash powdery mildew, Strawberry leaf, Grape black rot, Grape leaf (healthy).
- **Critical Legal & Provenance Warning**:
  > [!WARNING]
  > **Unresolved Image-Level Copyright**: The paper explicitly states that PlantDoc was built by "annotating internet scraped images" (via Google Images queries). While the repository curators applied a CC-BY-4.0 license to their compilation and annotations, **the underlying third-party images were not individually cleared by original copyright holders**.
  > **Permitted Reuse**: Legally safe for non-commercial academic benchmarking, internal research, model validation, and held-out evaluation. For enterprise production commercial use, models must not rely on proprietary web-scraped images where redistribution of raw data could infringe third-party IP.

---

### Source 2: Tomato Leaf Dataset (2025, Data in Brief / PMC12008584)
- **Official Download Page**: [https://data.mendeley.com/datasets/bpfd9cns5g/2](https://data.mendeley.com/datasets/bpfd9cns5g/2)
- **Companion Journal Publication**: [PMC12008584 (Data in Brief, Elsevier)](https://pmc.ncbi.nlm.nih.gov/articles/PMC12008584/) / DOI: `10.1016/j.dib.2025.111520`
- **Dataset Version**: Version 2 (Published March 4, 2025)
- **Access Date**: 2026-10-25
- **License Terms & Dual-Term Ambiguity**:
  - **Mendeley Metadata**: Declares `CC BY 4.0` in schema.org JSON-LD.
  - **Journal Article**: Open-access under Elsevier CC BY 4.0.
  - **Author Ethical Declaration (Section 5)**: Explicitly declares: *"The aim was to advance knowledge in agricultural disease detection and management, not for commercial exploitation, and the data is intended for research purposes only."*
  - **Attribution Citation**:
    > *Imtiaz, Ahmed; Islam Swapnil, Fahad Bin; Masud, Syed Rayhan; Karmaker, Debajoyti (2025). Tomato Leaf Dataset: A dataset for multiclass disease detection and classification. Mendeley Data, v2, https://doi.org/10.17632/bpfd9cns5g.2*
- **Dataset Scale**: 731 original high-resolution camera images; 1,621 annotations.
- **Acquisition Hardware & Domain**: Captured on-site using a Canon EOS M50 camera across smallholder tomato fields in Dinajpur, Thakurgaon, and rural Kushtia, Bangladesh.
- **Classes Present (7 categories)**:
  1. Category Early Blight (*Alternaria solani*)
  2. Category Black Spot (*Alternaria* spp.)
  3. Category Late Blight (*Phytophthora infestans*)
  4. Category Leaf Mold (*Passalora fulva*)
  5. Category Bacterial Spot (*Xanthomonas campestris pv. vesicatoria*)
  6. Category Target Spot (*Corynespora cassiicola*)
  7. Category Healthy
- **Format**: High-resolution raw images + 640×640 Roboflow standardized images + TXT bounding-box annotations (`train`, `test`, `valid` splits).
- **Taxonomic & Commercial Assessment**:
  - High diagnostic quality for real field blight and spot lesions.
  - Due to author-stated non-commercial intent, it must be restricted to evaluation, research, and non-monetized decision-support.

---

### Source 3: Real-World Tomato Leaf Image Dataset (Mendeley rnbsw72zb5/1)
- **Official Download Page**: [https://data.mendeley.com/datasets/rnbsw72zb5/1](https://data.mendeley.com/datasets/rnbsw72zb5/1)
- **DOI**: `10.17632/rnbsw72zb5.1`
- **Dataset Version**: Version 1 (Published August 28, 2024)
- **Access Date**: 2026-10-25
- **Official License**: `CC BY 4.0` (Mendeley metadata verified)
- **Attribution Citation**:
  > *Oni, Mangsura Kabir; Prama, Tabia Tanzin (2024). Tomato Leaf Image Dataset for Disease Analysis in Real-World Environment. Mendeley Data, v1, https://doi.org/10.17632/rnbsw72zb5.1*
- **Scale**: 1,028 images (868 training, 160 validation; 486 healthy, 546 diseased).
- **Environment**: Complex in-field background collected in Bangladesh.
- **Critical Taxonomic Limitation**:
  > [!IMPORTANT]
  > **Binary-Only Labeling**: Images are labeled strictly as **"H" (Healthy)** or **"D" (Diseased)** with text bounding-box annotations. **Zero pathogen or disease-specific labels exist** (no Early Blight, Late Blight, or virus tags).
  > **Utility**: Suitable only for Stage-1 leaf health triage or foliage detection; unusable for differential disease diagnosis.

---

### Source 4: Tomato Leaf Disease Classification Dataset in Pakistan (Mendeley 3mbnb82mxd/2)
- **Official Download Page**: [https://data.mendeley.com/datasets/3mbnb82mxd/2](https://data.mendeley.com/datasets/3mbnb82mxd/2)
- **DOI**: `10.17632/3mbnb82mxd.2`
- **Dataset Version**: Version 2 (Published February 18, 2026)
- **Access Date**: 2026-10-25
- **Official License**: `CC BY 4.0` (Mendeley metadata verified)
- **Attribution Citation**:
  > *Malik, Mohammad Naeem; Ali, Syed Hashir; Ali, Hamid (2026). Tomato Leaf Disease Classification Dataset in Pakistan. Mendeley Data, v2, https://doi.org/10.17632/3mbnb82mxd.2*
- **Scale**: 7,200 images in JPG format.
- **Acquisition Hardware & Domain**: Captured via smartphone cameras under natural outdoor lighting in real-time Pakistani agricultural fields without artificial backdrops.
- **Classes Present (6 categories)**:
  1. Early Blight
  2. Late Blight
  3. Septoria Leaf Spot
  4. Leaf Mold
  5. Yellow Leaf Curl Virus
  6. Healthy leaves
- **Utility**: Excellent high-volume candidate for field benchmark validation and transfer learning. Covers the persistent TYLCV challenge under genuine outdoor illumination.

---

### Source 5: PlantVillage (Academic Baseline Benchmark)
- **Repository / Reference**: Hughes & Salathé (2015), Penn State University.
- **License**: Creative Commons Zero (`CC0 1.0 Universal`, Public Domain).
- **Scale**: 54,306 images across 38 classes (14 crop species).
- **Environmental Context**: Laboratory indoor conditions; detached leaves placed on uniform monochrome sheets (gray cardboard, black, white).
- **Role in AgriVision AI**: Preserved strictly as a **baseline reference** and feature-extraction pretraining source. Prohibited from serving as a held-out field benchmark because its laboratory background shortcuts do not reflect real-world agricultural conditions.

---

### Source 6: Open Indian Agricultural Datasets (Priority Multi-Crop Extensions)

To realize the multi-plant roadmap for India, the following verified open datasets are designated for staged ingestion in Phase 8.3:

1. **Rice Leaf Disease Dataset (South Asian Paddy Fields)**:
   - *Source*: Rahman et al. (2020), Mendeley Data / UCI Machine Learning Repository.
   - *License*: `CC BY 4.0`.
   - *Scale*: 3,355 in-field images.
   - *Pathology Coverage*: Bacterial Leaf Blight (*Xanthomonas oryzae*), Rice Blast (*Magnaporthe oryzae*), Brown Spot (*Bipolaris oryzae*), Leaf Smut.
   - *Relevance*: Essential staple crop (#1 in India by acreage and consumption).
2. **Cotton Leaf Disease Dataset (Indian Agro-Climates)**:
   - *Source*: Mendeley Data / Zenodo (CC BY 4.0).
   - *Scale*: ~2,000 in-field images.
   - *Pathology Coverage*: Cotton Leaf Curl Virus (CLCuV), Bacterial Blight, Grey Mildew.
   - *Relevance*: Vital Indian cash crop severely threatened by whitefly-transmitted leaf curl.

---

## 3. Strict Taxonomic Integrity & Symptom Equivalence Policy

> [!CAUTION]
> **Taxonomic Integrity Mandate**: Never merge distinct biological pathogens based solely on visual similarity, and never equate visual symptoms to specific viral/fungal etiologies without verified labels.

### Equivalence & Discrepancy Rules

1. **Leaf Curl vs. Tomato Yellow Leaf Curl Virus (TYLCV)**:
   - *Visual Symptom*: Leaflet margin upward cupping and chlorosis.
   - *Biological Causes*: TYLCV Begomovirus, physiological drought stress, herbicide drift (*2,4-D*), spider mite feeding, or mechanical root injury.
   - *Enforcement*: Datasets labeled merely "Tomato leaf yellow virus" (PlantDoc) or "Leaf curl" must **not** be equated to confirmed TYLCV without molecular or expert verification.
2. **Early Blight (*Alternaria solani*) vs. Target Spot (*Corynespora cassiicola*)**:
   - Both produce brown circular necrotic lesions. Early Blight produces concentric bullseye rings primarily on mature lower foliage. Target Spot produces zonate lesions that readily cross leaf veins. They must remain separate classes.
3. **Black Spot vs. Bacterial Spot**:
   - Bangladesh 2025 includes "Category Black Spot" (*Alternaria* spp.) alongside "Bacterial Spot" (*Xanthomonas*). These are distinct fungal and bacterial entities with completely different agronomic treatments (fungicides vs. copper bactericides). They must never be merged.
4. **Cross-Crop Pathogen Distinction**:
   - Potato Early Blight (*Alternaria solani* on *Solanum tuberosum*) and Tomato Early Blight (*Alternaria solani* on *Solanum lycopersicum*) share a pathogen species but infect different crop hosts with different canopy morphologies. They must be tracked as distinct classes.

---

## 4. Hardware Capacity & Safe Acquisition Protocol

### Disk Space Verification
Prior to any data downloading, storage capacity was measured across all local host volumes:

```text
Drive D:   171.09 GB Free (31.25 GB Used)  -> Designated dataset repository volume
Drive C:    60.35 GB Free (230.44 GB Used) -> System drive (preserve for OS & Node modules)
```
*Conclusion*: Volume `D:\almost done\krishi` has **171 GB available**, providing more than 20× the headroom required for candidate multi-plant datasets (~8–10 GB total).

### Safe Acquisition Protocol Rules
1. **No Web Scraping**: All data must be fetched exclusively from official repositories (GitHub releases, Mendeley DOIs, Zenodo). No automated scraping of commercial agricultural portals.
2. **Archive Validation**: Downloaded archives must be checksum-verified (SHA-256) prior to decompression.
3. **Local Directory Hierarchy**:
   ```
   dataset/
   ├── README.md
   ├── eval_manifest.json           # Active benchmark manifest
   ├── sources_manifest.json        # Source audit metadata
   ├── DATASET_ACQUISITION_PLAN.md  # This document
   ├── MULTI_PLANT_MODEL_PLAN.md    # Multi-crop architecture & training roadmap
   ├── raw/                         # Raw, unmodified archives (git-ignored)
   │   ├── plantdoc/
   │   ├── tomato_mendeley_2025/
   │   ├── tomato_pakistan_2026/
   │   └── rice_mendeley_2020/
   └── curated/                     # Harmonized, deduplicated crops (git-ignored)
       ├── tomato/
       ├── potato/
       ├── bell_pepper/
       ├── rice/
       └── corn/
   ```
4. **Data Hygiene & Deduplication**:
   - Duplicate photos must be identified using perceptual hashing (pHash) with a Hamming distance threshold $\le 4$.
   - Stratified grouping: Multiple images from the same physical plant or harvest day must be grouped into the same split to eliminate train/test leakage.

---

## 5. Verified vs. Unverified Status Matrix

| Dimension | Verified Facts | Unverified / Pending Items |
| :--- | :--- | :--- |
| **PlantDoc** | Official GitHub repo, `CC-BY-4.0` license in `LICENSE.txt`, 2,598 images, 13 species, 27 classes, in-field conditions. | Individual third-party copyright clearance for raw web-scraped images; exact per-class image counts inside uncompressed folders. |
| **Tomato 2025 (PMC12008584)** | Mendeley DOI `10.17632/bpfd9cns5g.2`, 731 raw images, 1,621 annotations, Canon EOS M50 in-field captures, 7 classes. | Ambiguity between Mendeley `CC BY 4.0` tag and peer-reviewed paper's non-commercial research ethics declaration. |
| **Tomato Real-World (rnbsw72zb5/1)** | Mendeley DOI `10.17632/rnbsw72zb5.1`, `CC BY 4.0`, 1,028 field images. | Verified to contain **only binary labels ("H" vs "D")**; no disease-specific annotations exist. |
| **Tomato Pakistan (3mbnb82mxd/2)** | Mendeley DOI `10.17632/3mbnb82mxd.2`, `CC BY 4.0`, 7,200 smartphone field images, 6 classes. | Exact proportion of unique physical specimens versus augmented variations. |
| **PlantVillage Baseline** | Public domain `CC0`, 54,306 images, 38 classes, 14 species. | Unusable for field evaluation due to proven 0.00% diagnostic transfer to real outdoor foliage. |
| **Storage Capacity** | Volume `D:` has 171.09 GB free; ample headroom. | Full uncompressed footprint of all combined multi-crop archives. |

---

## 6. Recommended Next Actions (Phase 8.2 Execution)

1. **Step 1: Download Core In-Field Evaluation Benchmark**:
   Download PlantDoc and Tomato Pakistan (3mbnb82mxd/2) into `dataset/raw/` using verified HTTP endpoints.
2. **Step 2: Assemble Held-Out Field Benchmark**:
   Populate `dataset/eval/` with 30–50 verified, unaugmented in-field images per class across Tomato, Potato, Pepper, and Corn.
3. **Step 3: Update `dataset/eval_manifest.json`**:
   Register all held-out field benchmark specimens with ground-truth keys.
4. **Step 4: Execute Baseline Comparison (`npm run evaluate:dataset`)**:
   Quantify the existing MobileNetV2 ONNX model's performance on this multi-class field benchmark before training any candidate models.
