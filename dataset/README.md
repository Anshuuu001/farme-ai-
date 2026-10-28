# AgriVision AI — Multi-Plant Benchmark & Dataset Architecture

## 📋 Scope & Purpose
This directory specifies the layout, governance protocols, and benchmark datasets for **AgriVision AI**. 

AgriVision AI is architected for disease detection across **multiple plant species and agricultural crops**—with specific prioritization for Indian agro-climates (Rice, Wheat, Cotton, Sugarcane, Chilli, Mango, Potato, Tomato)—rather than a single crop.

> **CRITICAL SCIENTIFIC PRINCIPLE**: Never claim diagnostic accuracy based merely on unit test completion (`npm test`). Passing software unit tests only verifies pipeline execution without memory leaks or crashes; it does not measure clinical or agronomic accuracy. Diagnostic accuracy must be measured against locked, labeled field benchmarks.

---

## 🗂 Multi-Plant Directory Structure

```
dataset/
├── README.md                           # Master dataset architecture guide
├── manifests/
│   └── field_eval_manifest.json        # Locked multi-plant evaluation benchmark manifest (v1.0.0)
├── eval/                               # Locked held-out test splits (strictly isolated from training)
│   ├── tomato/                         # Verified field tomato specimens (healthy + pathologies)
│   ├── potato/                         # Verified field potato specimens
│   ├── pepper/                         # Verified chilli / bell pepper specimens
│   ├── corn/                           # Verified maize foliar specimens
│   ├── rice/                           # Verified paddy foliar specimens
│   ├── apple/                          # Verified apple foliar specimens
│   ├── grape/                          # Verified grape foliar specimens
│   └── out_of_domain/                  # Synthetic & non-botanical negative controls
├── raw/                                # Pristine incoming candidate archives (gitignored)
├── processed/                          # Standardized, deduplicated crops & masks
├── MULTI_PLANT_EVALUATION_REPORT.md    # Empirical baseline evaluation on field benchmark
├── DATASET_GAPS.md                     # Comprehensive gap analysis across crops & taxonomy
├── LICENSE_ATTRIBUTION_REPORT.md       # Legal audit, copyright risks, and CC-BY-4.0 registry
├── MULTI_PLANT_MODEL_PLAN.md           # Multi-plant taxonomic & architectural roadmap
├── DATASET_ACQUISITION_PLAN.md         # Source-by-source vetting and acquisition protocols
└── sources_manifest.json               # Structured registry of candidate open datasets
```

---

## 📑 Evaluation Benchmark Manifest (`manifests/field_eval_manifest.json`)

All held-out evaluation specimens are registered in `manifests/field_eval_manifest.json` with cryptographic SHA-256 digests, biological taxonomy, acquisition domain, pathology status, and license provenance:

```json
{
  "id": "EVAL-TOMATO-EB-01",
  "file_path": "dataset/eval/tomato/tomato_early_blight_field_01.jpg",
  "crop_species": "Tomato",
  "botanical_name": "Solanum lycopersicum",
  "pathology_status": "infected",
  "ground_truth_disease": "Tomato Early Blight",
  "mapped_model_class": "Tomato with Early Blight",
  "model_class_index": 29,
  "acquisition_domain": "field",
  "sha256": "499013371c21d8b84bd9ace9306672dc6991f791cdb9f5b2e8b51e5b116c5cdc",
  "license": "CC-BY-SA-4.0"
}
```

---

## 📊 Running Benchmark Evaluations

To run the automated multi-plant benchmark runner against the baseline model:

```bash
cd backend
npm run evaluate:dataset
```

Or target a specific manifest / model:
```bash
cd backend
node scripts/evaluate_dataset.js ../models/mobilenet_v2.onnx ../../dataset/manifests/field_eval_manifest.json
```

---

## 📚 Key Reports & Documentation Links
- [Multi-Plant Evaluation Report](file:///d:/almost%20done/krishi/dataset/MULTI_PLANT_EVALUATION_REPORT.md)
- [Dataset Gap Analysis & Indian Roadmap](file:///d:/almost%20done/krishi/dataset/DATASET_GAPS.md)
- [License & Attribution Compliance Report](file:///d:/almost%20done/krishi/dataset/LICENSE_ATTRIBUTION_REPORT.md)
- [Multi-Plant Model Architectural Plan](file:///d:/almost%20done/krishi/dataset/MULTI_PLANT_MODEL_PLAN.md)
- [Dataset Acquisition Plan](file:///d:/almost%20done/krishi/dataset/DATASET_ACQUISITION_PLAN.md)

