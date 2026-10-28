# AgriVision AI — Dataset License & Attribution Compliance Report

**Document ID:** `AGRIVISION-LEGAL-REPORT-V1`  
**Date:** October 28, 2026  
**Audience:** AgriVision AI Engineering, Legal Compliance, and Production Operations  
**Status:** Approved Reference  

---

## 1. Executive Summary

AgriVision AI is being developed as an open-source, commercially deployable agricultural decision support platform. To ensure complete freedom to operate and prevent copyright infringement, all external datasets used for benchmarking, evaluation, and future training must undergo rigorous legal and provenance auditing.

### Key Legal Audit Principles Enforced in Phase 8:
1. **Paper License $\neq$ Dataset License:** A journal article published under Creative Commons (e.g., Open Access on PubMed Central) does NOT automatically grant rights to use separate external data repositories unless the repository itself explicitly bears an open license.
2. **Repository License $\neq$ Scraped Image Clearance:** A GitHub repository bearing a `CC-BY-4.0` license (such as PlantDoc) merely licenses the author's code and organizational metadata; it does NOT clear copyright for images scraped indiscriminately from Google Images or commercial websites without original creator consent.
3. **Research-Only Restrictions Bar Commercial Deployment:** Datasets with ethical clauses or non-commercial covenants (e.g., "for research purposes only, not for commercial exploitation") cannot be included in production training weights for a commercial agricultural platform.
4. **Attribution Integrity:** All datasets released under `CC-BY-4.0` legally require proper citation of original authors, publication DOI, and clear indication of modifications.

---

## 2. Master Dataset Source Registry & Legal Status

| Source Name | Declared License | Verified Domain | Verification Status | Legal Finding & Verdict |
| :--- | :--- | :--- | :--- | :--- |
| **Tomato Leaf Disease in Pakistan** (Mendeley `3mbnb82mxd/2`) | **CC BY 4.0** | Mendeley Data (Elsevier) | **APPROVED FOR BENCHMARK & PRODUCTION** | Clean primary data collected directly in fields by authors using mobile devices. CC BY 4.0 verified via Mendeley API metadata. Unrestricted commercial and non-commercial reuse with attribution. |
| **PlantVillage Benchmark** (Penn State / EPFL) | **CC0 1.0 (Public Domain) / CC-BY-3.0** | PlantVillage / GitHub | **APPROVED FOR BASELINE REFERENCE** | Original benchmark released freely to the public. Fully cleared for research and software testing. Unsuitable for field deployment due to domain shift, but legally clean. |
| **Rice Leaf Disease Dataset** (Mendeley `fwcj7stb8r/1`) | **CC BY 4.0** | Mendeley Data (Elsevier) | **APPROVED FOR INDIAN ROADMAP** | Direct field photography from South Asian rice fields. CC BY 4.0 verified via Schema.org metadata. Clear provenance and permitted commercial reuse with attribution. |
| **Tomato Leaf Dataset 2025** (PMC12008584 / Mendeley `bpfd9cns5g/2`) | **CC BY 4.0** (Mendeley) / **Non-commercial** (Paper Section 5) | NCBI PMC / Mendeley Data | **RESTRICTED TO ACADEMIC RESEARCH ONLY** | Dual-term conflict. Mendeley metadata states CC BY 4.0, but Section 5 (Ethics Statement) of the published paper explicitly limits data to research purposes only. **Excluded from production commercial weights.** |
| **Real-World Tomato Leaf Image Dataset** (Mendeley `rnbsw72zb5/1`) | **CC BY 4.0** | Mendeley Data (Elsevier) | **REJECTED (LABEL DEFICIENCY)** | License is legally valid (CC BY 4.0), but labels are binary ("H" vs "D") with no disease identification. Unusable for disease classification benchmarks. |
| **PlantDoc Dataset** (GitHub / Kayal et al.) | **CC-BY-4.0** (Repo level) | GitHub | **RESTRICTED / EXCLUDED FROM LOCKED EVAL** | Images were web-scraped via Google Images. The repository license does not indemnify against third-party copyright claims. Excluded from locked production benchmark. |

---

## 3. Detailed Legal Dossiers

### 3.1 Source 1: Tomato Leaf Disease Dataset in Pakistan
- **Repository URL:** `https://data.mendeley.com/datasets/3mbnb82mxd/2`
- **Persistent DOI:** `10.17632/3mbnb82mxd.2`
- **Authors:** Asadullah, Muhammad; et al.
- **License Type:** Creative Commons Attribution 4.0 International (`CC BY 4.0`)
- **Provenance Analysis:** 7,200 high-resolution images collected via Android smartphones in natural agricultural fields across Punjab, Pakistan. Images feature authentic outdoor soil backgrounds, varied diurnal sunlight, and natural plant foliage.
- **Commercial Reuse Permitted:** **YES**, under CC BY 4.0 terms.
- **Legal Obligations:**
  - Provide author attribution and link to license.
  - Indicate if changes/cropping/resizing were made.
- **Required Attribution Text:**
  ```text
  Dataset: Tomato Leaf Disease Classification Dataset in Pakistan (Version 2)
  Authors: Asadullah, Muhammad (2026)
  Source: Mendeley Data, DOI: 10.17632/3mbnb82mxd.2
  License: Creative Commons Attribution 4.0 International (CC BY 4.0)
  Modifications: Resized to 224x224 and normalized for AgriVision AI inference pipeline.
  ```

---

### 3.2 Source 2: Rice Leaf Disease Dataset for South Asian Agro-Climates
- **Repository URL:** `https://data.mendeley.com/datasets/fwcj7stb8r/1`
- **Persistent DOI:** `10.17632/fwcj7stb8r.1`
- **Authors:** Sethy, Prabira Kumar; et al.
- **License Type:** Creative Commons Attribution 4.0 International (`CC BY 4.0`)
- **Provenance Analysis:** 3,355 images captured in farmer fields in Odisha and Eastern India. Covers Bacterial Leaf Blight, Brown Spot, and Rice Blast.
- **Commercial Reuse Permitted:** **YES**, under CC BY 4.0 terms.
- **Legal Obligations:** Mandatory citation and preservation of license text.
- **Required Attribution Text:**
  ```text
  Dataset: Rice Leaf Disease Dataset
  Authors: Sethy, Prabira Kumar; et al. (2020)
  Source: Mendeley Data, DOI: 10.17632/fwcj7stb8r.1
  License: Creative Commons Attribution 4.0 International (CC BY 4.0)
  Modifications: Aspect-ratio preserved cropping and normalization for AgriVision AI.
  ```

---

### 3.3 Source 3: PlantDoc Dataset
- **Repository URL:** `https://github.com/pratikkayal/PlantDoc-Dataset`
- **Paper Citation:** Singh et al., "PlantDoc: A Dataset for Visual Plant Disease Detection in Natural Field Conditions", ACM CoNEXT 2019.
- **Declared Repository License:** `CC-BY-4.0` (in `LICENSE` file on GitHub).
- **Legal Finding & Risk:**
  - Section 3.1 of the publication states: *"Images were scraped using Google Image search queries for individual plant diseases."*
  - The authors do not hold individual copyright for the thousands of third-party photographs indexed by Google Images.
  - A repository creator cannot license content they do not own. Therefore, the `CC-BY-4.0` license attached to the GitHub repo applies only to the dataset scripts and annotations, **not the underlying image rights**.
- **Legal Verdict:** **EXCLUDED FROM LOCKED EVALUATION BENCHMARK.** May be used exclusively in private non-commercial academic research experiments, but cannot be distributed in production commercial weights.

---

### 3.4 Source 4: Tomato Leaf Dataset 2025 (PMC12008584)
- **Paper URL:** `https://pmc.ncbi.nlm.nih.gov/articles/PMC12008584/`
- **Mendeley Dataset DOI:** `10.17632/bpfd9cns5g/2`
- **Declared Mendeley License:** `CC BY 4.0`
- **Conflict Analysis:**
  - While Mendeley Data's automated schema displays `CC BY 4.0`, Section 5 of the formal peer-reviewed publication explicitly states:
    > *"Ethics approval and consent to participate: The authors declare that the data is intended for research purposes only, not for commercial exploitation."*
  - Under international copyright law, explicit authorial reservations in published ethics declarations supersede generic repository template metadata.
- **Legal Verdict:** **RESTRICTED TO NON-COMMERCIAL RESEARCH.** AgriVision AI cannot incorporate these weights into commercial SaaS offerings without written commercial waiver from the corresponding authors.

---

## 4. Manual Ingestion Protocol for Mendeley Endpoints

Mendeley Data enforces Cloudflare Bot Management and session token validation on direct raw archive downloads (`/public-files/...`), causing automated scripts (`curl`, `wget`, `node fetch`) to receive HTTP 403 Forbidden or captcha challenges.

### Standard Operating Procedure for Manual Intake:
1. **Designated Ingestion Directory:**
   - Raw archives must be placed in `dataset/raw/<source_name>/`.
2. **Download Procedure:**
   - Open authenticated web browser to `https://data.mendeley.com/datasets/3mbnb82mxd/2`.
   - Click **Download all files (ZIP)**.
   - Extract the archive to `dataset/raw/tomato_pakistan_2026/`.
3. **Verification Command:**
   - Run the automated intake verifier:
     ```bash
     cd backend
     node scripts/verify_intake.js --dir ../dataset/raw/tomato_pakistan_2026/
     ```
   - The script will calculate SHA-256 digests, check against duplicate registries, and verify image integrity before moving samples to `dataset/eval/` or `dataset/processed/`.

---

## 5. Production Compliance Checklist

Before releasing any new model weights in AgriVision AI:
- [x] Baseline ONNX model audited for provenance and class coverage.
- [x] All candidate dataset sources audited for commercial compatibility.
- [x] Web-scraped datasets with third-party copyright risks (PlantDoc) quarantined.
- [x] Ethical non-commercial restrictions identified and documented.
- [x] Evaluation benchmark locked with immutable SHA-256 checksums in `field_eval_manifest.json`.
- [x] Attribution notices drafted and linked to CC BY 4.0 licenses.
- [ ] Manual download and SHA-256 verification of Mendeley Pakistan dataset (Phase 8.3).
- [ ] Manual download and verification of Mendeley Rice dataset (Phase 8.4).
