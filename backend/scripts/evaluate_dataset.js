import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ort from 'onnxruntime-node';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_MODEL = path.resolve(__dirname, '../models/mobilenet_v2.onnx');
const DEFAULT_LABELS = path.resolve(__dirname, '../models/labels.json');
const FIELD_MANIFEST = path.resolve(__dirname, '../../dataset/manifests/field_eval_manifest.json');
const LEGACY_MANIFEST = path.resolve(__dirname, '../../dataset/eval_manifest.json');
const MANIFEST_PATH = fs.existsSync(FIELD_MANIFEST) ? FIELD_MANIFEST : LEGACY_MANIFEST;
const WORKSPACE_ROOT = path.resolve(__dirname, '../../');
const DATASET_DIR = path.resolve(__dirname, '../../dataset');

function stableSoftmax(logits) {
  let maxLogit = -Infinity;
  for (let i = 0; i < logits.length; i++) {
    if (logits[i] > maxLogit) maxLogit = logits[i];
  }
  let sumExp = 0;
  const exps = new Float32Array(logits.length);
  for (let i = 0; i < logits.length; i++) {
    exps[i] = Math.exp(logits[i] - maxLogit);
    sumExp += exps[i];
  }
  const probs = new Float32Array(logits.length);
  for (let i = 0; i < logits.length; i++) {
    probs[i] = exps[i] / sumExp;
  }
  return probs;
}

async function preprocess(imageBuffer, scheme = 'production_tf') {
  const { data, info } = await sharp(imageBuffer)
    .resize(224, 224, { fit: 'cover' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const totalPixels = info.width * info.height;
  const float32Data = new Float32Array(3 * totalPixels);
  const mean = [0.485, 0.456, 0.406];
  const std = [0.229, 0.224, 0.225];

  for (let c = 0; c < 3; c++) {
    for (let i = 0; i < totalPixels; i++) {
      const srcIdx = i * 3 + c;
      const dstIdx = c * totalPixels + i;
      const v = data[srcIdx];
      if (scheme === 'imagenet') {
        float32Data[dstIdx] = ((v / 255.0) - mean[c]) / std[c];
      } else {
        float32Data[dstIdx] = (v - 127.5) / 127.5;
      }
    }
  }
  return float32Data;
}

function getTopPredictions(labels, logits, probs, topK = 3) {
  const preds = [];
  for (let i = 0; i < labels.length; i++) {
    preds.push({
      index: i,
      label: labels[i] || `Class_${i}`,
      logit: logits[i],
      probability: probs[i],
      confidencePercent: parseFloat((probs[i] * 100).toFixed(2))
    });
  }
  preds.sort((a, b) => b.probability - a.probability);
  return preds.slice(0, topK);
}

export async function evaluateModelOnManifest(modelPath = DEFAULT_MODEL, labelsPath = DEFAULT_LABELS, manifestPath = MANIFEST_PATH) {
  console.log('='.repeat(80));
  console.log('AGRIVISION AI — MULTI-PLANT BENCHMARK EVALUATION RUNNER');
  console.log('='.repeat(80));
  console.log(`Model:       ${modelPath}`);
  console.log(`Labels:      ${labelsPath}`);
  console.log(`Manifest:    ${manifestPath}`);

  if (!fs.existsSync(modelPath)) {
    throw new Error(`Model not found at ${modelPath}`);
  }
  if (!fs.existsSync(labelsPath)) {
    throw new Error(`Labels not found at ${labelsPath}`);
  }
  if (!fs.existsSync(manifestPath)) {
    console.log(`\n⚠️  No evaluation manifest found at ${manifestPath}.`);
    return { status: 'NO_EVAL_MANIFEST', evaluatedSamples: 0, accuracy: null };
  }

  const labels = Object.values(JSON.parse(fs.readFileSync(labelsPath, 'utf-8')));
  const session = await ort.InferenceSession.create(modelPath);

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  const samples = manifest.verified_samples || manifest.samples || [];

  if (samples.length === 0) {
    console.log(`\n⚠️  Manifest exists but contains 0 samples.`);
    return { status: 'EMPTY_MANIFEST', evaluatedSamples: 0 };
  }

  console.log(`Loaded ${samples.length} sample(s) from manifest.\n`);

  const results = [];
  const latencies = [];
  const cropStats = {};
  let overallInDomainTotal = 0;
  let overallInDomainCorrect = 0;
  let oodTotal = 0;
  let oodRejectedCount = 0;

  for (let idx = 0; idx < samples.length; idx++) {
    const s = samples[idx];
    const rawPath = s.file_path;
    let fullImgPath = path.isAbsolute(rawPath) ? rawPath : path.resolve(WORKSPACE_ROOT, rawPath);
    if (!fs.existsSync(fullImgPath)) {
      fullImgPath = path.resolve(DATASET_DIR, rawPath);
    }

    if (!fs.existsSync(fullImgPath)) {
      console.warn(`[Warning] Image file not found: ${rawPath} (tried ${fullImgPath})`);
      continue;
    }

    const imgBuf = fs.readFileSync(fullImgPath);
    const tensorData = await preprocess(imgBuf, 'production_tf');

    const t0 = performance.now();
    const tensor = new ort.Tensor('float32', tensorData, [1, 3, 224, 224]);
    const inferenceOut = await session.run({ pixel_values: tensor });
    const logits = inferenceOut.logits.data;
    const probs = stableSoftmax(logits);
    const t1 = performance.now();
    latencies.push(t1 - t0);

    const top3 = getTopPredictions(labels, logits, probs, 3);
    const top1 = top3[0];

    const isOOD = s.pathology_status === 'out_of_domain' || s.crop_species?.toLowerCase().includes('non-crop') || s.domain === 'synthetic_control';
    const groundTruth = s.mapped_model_class || s.ground_truth_label || s.ground_truth_disease;
    const crop = s.crop_species || (isOOD ? 'Out of Domain' : 'Unknown Crop');

    let isCorrect = false;
    if (isOOD) {
      oodTotal++;
      if (top1.confidencePercent < 50.0) {
        oodRejectedCount++;
      }
    } else {
      overallInDomainTotal++;
      if (!cropStats[crop]) {
        cropStats[crop] = { total: 0, correct: 0 };
      }
      cropStats[crop].total++;

      if (groundTruth && top1.label.toLowerCase().trim() === groundTruth.toLowerCase().trim()) {
        isCorrect = true;
        overallInDomainCorrect++;
        cropStats[crop].correct++;
      }
    }

    results.push({
      id: s.id,
      crop,
      groundTruth,
      predictedTop1: top1.label,
      confidence: top1.confidencePercent,
      logit: top1.logit,
      top3,
      isCorrect,
      isOOD,
      latencyMs: t1 - t0
    });

    console.log(`[Sample ${idx + 1}/${samples.length}] ${s.id} (${crop})`);
    console.log(`  Target:     ${groundTruth || 'N/A (Out of Domain)'}`);
    console.log(`  Predicted:  "${top1.label}" (${top1.confidencePercent}%, logit ${top1.logit.toFixed(3)})`);
    console.log(`  Status:     ${isOOD ? (top1.confidencePercent < 50.0 ? '🛡️ Low Confidence (<50%)' : '⚠️ Overconfident False Diagnosis') : (isCorrect ? '✅ MATCH' : '❌ MISCLASSIFICATION')}`);
    console.log(`  Top-3:      1. ${top3[0].label} (${top3[0].confidencePercent}%) | 2. ${top3[1]?.label || 'N/A'} (${top3[1]?.confidencePercent || 0}%) | 3. ${top3[2]?.label || 'N/A'} (${top3[2]?.confidencePercent || 0}%)\n`);
  }

  latencies.sort((a, b) => a - b);
  const p50 = latencies[Math.floor(latencies.length * 0.50)] || 0;
  const p95 = latencies[Math.floor(latencies.length * 0.95)] || 0;
  const avgLatency = latencies.reduce((a, b) => a + b, 0) / (latencies.length || 1);

  console.log('='.repeat(80));
  console.log('EVALUATION RESULTS BREAKDOWN');
  console.log('='.repeat(80));

  console.log('\n--- Per-Crop Performance ---');
  for (const [cName, cData] of Object.entries(cropStats)) {
    const acc = ((cData.correct / cData.total) * 100).toFixed(2);
    console.log(`  * ${cName.padEnd(20)}: ${cData.correct}/${cData.total} correct (${acc}%)`);
  }

  console.log('\n--- Out-of-Domain Control Specificity ---');
  if (oodTotal > 0) {
    const oodRate = ((oodRejectedCount / oodTotal) * 100).toFixed(2);
    console.log(`  * Controls Evaluated   : ${oodTotal}`);
    console.log(`  * Low-Confidence Guard : ${oodRate}% (<50% confidence threshold)`);
  } else {
    console.log(`  * No OOD controls in this evaluation run.`);
  }

  console.log('\n--- Latency Performance (CPU INT8) ---');
  console.log(`  * Mean Latency:  ${avgLatency.toFixed(2)} ms`);
  console.log(`  * p50 Latency:   ${p50.toFixed(2)} ms`);
  console.log(`  * p95 Latency:   ${p95.toFixed(2)} ms`);

  console.log('\n--- Diagnostic Error Breakdown ---');
  results.filter(r => !r.isOOD && !r.isCorrect).forEach(r => {
    console.log(`  * ${r.id}: Target "${r.groundTruth}" -> Predicted "${r.predictedTop1}" (${r.confidence}%)`);
  });

  console.log('='.repeat(80));

  return {
    manifestPath,
    evaluatedSamples: results.length,
    inDomainTotal: overallInDomainTotal,
    inDomainCorrect: overallInDomainCorrect,
    inDomainAccuracy: overallInDomainTotal > 0 ? overallInDomainCorrect / overallInDomainTotal : null,
    cropStats,
    oodTotal,
    oodRejectedCount,
    oodSpecificity: oodTotal > 0 ? oodRejectedCount / oodTotal : null,
    p50,
    p95,
    avgLatency,
    results
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const modelArg = process.argv[2] && !process.argv[2].endsWith('.json') ? process.argv[2] : DEFAULT_MODEL;
  const manifestArg = process.argv.find(a => a.endsWith('.json')) || MANIFEST_PATH;
  evaluateModelOnManifest(modelArg, DEFAULT_LABELS, manifestArg).catch(err => {
    console.error(err);
    process.exit(1);
  });
}
