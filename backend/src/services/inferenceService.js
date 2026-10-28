import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import ort from 'onnxruntime-node';
import sharp from 'sharp';
import { getGuidanceForLabel, DISCLAIMER_STATEMENT } from './guidanceService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let session = null;
let labels = null;

const MODEL_PATH = path.resolve(__dirname, '../../models/mobilenet_v2.onnx');
const LABELS_PATH = path.resolve(__dirname, '../../models/labels.json');

export async function initInferenceSession() {
  if (session) return session;

  if (!fs.existsSync(MODEL_PATH)) {
    throw new Error(`ONNX model file not found at ${MODEL_PATH}`);
  }

  if (!fs.existsSync(LABELS_PATH)) {
    throw new Error(`Labels JSON file not found at ${LABELS_PATH}`);
  }

  labels = JSON.parse(fs.readFileSync(LABELS_PATH, 'utf-8'));
  session = await ort.InferenceSession.create(MODEL_PATH);
  console.log('[Inference Service] ✅ MobileNetV2 ONNX session loaded successfully.');
  return session;
}

export async function runInference(imageBuffer) {
  if (!session) {
    await initInferenceSession();
  }

  // 1. Image preprocessing with sharp: 224x224 RGB raw buffer
  const { data, info } = await sharp(imageBuffer)
    .resize(224, 224, { fit: 'cover' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const channels = 3;
  const totalPixels = width * height;
  const float32Data = new Float32Array(1 * channels * totalPixels);

  // 2. Convert HWC uint8 [0, 255] to NCHW float32 normalized to [-1.0, 1.0]
  // Formula: (pixel - 127.5) / 127.5
  for (let c = 0; c < channels; c++) {
    for (let i = 0; i < totalPixels; i++) {
      const srcIdx = i * channels + c;
      const dstIdx = c * totalPixels + i;
      float32Data[dstIdx] = (data[srcIdx] - 127.5) / 127.5;
    }
  }

  // 3. Run Inference
  const tensor = new ort.Tensor('float32', float32Data, [1, channels, height, width]);
  const results = await session.run({ pixel_values: tensor });
  const logits = results.logits.data;

  // 4. Stable Softmax computation
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

  const predictions = [];
  for (let i = 0; i < logits.length; i++) {
    const prob = exps[i] / sumExp;
    predictions.push({
      index: i,
      label: labels[i] || `Class_${i}`,
      probability: prob,
      confidencePercent: parseFloat((prob * 100).toFixed(2))
    });
  }

  // Sort descending by probability
  predictions.sort((a, b) => b.probability - a.probability);
  const topPrediction = predictions[0];
  const runnerUps = predictions.slice(1, 4);

  // 5. Check if top prediction is tomato or non-tomato
  const isTomatoClass = topPrediction.label.toLowerCase().includes('tomato');
  
  // Safeguard: If the model classifies the leaf as an unsupported crop,
  // do not force a tomato diagnosis. Return an honest inconclusive / unsupported crop result.
  if (!isTomatoClass) {
    const cleanLabel = topPrediction.label.replace(/_/g, ' ');
    return {
      rawLabel: topPrediction.label,
      isTomatoClass: false,
      confidence: topPrediction.confidencePercent,
      isLowConfidence: true,
      confidenceNote: `Specimen classified as "${cleanLabel}". AgriVision AI is calibrated strictly for tomato foliage (Solanum lycopersicum). Diagnosing unsupported crops or non-botanical subjects is outside model scope.`,
      diseaseKey: 'unsupported_crop',
      displayName: `Unsupported Crop (${cleanLabel})`,
      scientificName: 'Non-target botanical specimen',
      severity: 'Inconclusive / Unsupported Crop',
      isHealthy: false,
      affectedParts: ['Non-Tomato Tissue'],
      summary: `The neural network classified this specimen as "${cleanLabel}" with ${topPrediction.confidencePercent}% confidence rather than tomato foliage. AgriVision AI V1 provides agronomic guidance exclusively for tomato leaf pathology.`,
      symptoms: [
        `Leaf morphology and visual pattern match non-tomato taxonomy: ${cleanLabel}.`,
        'Tomato pathology diagnostic markers are not applicable to this specimen.'
      ],
      solutions: {
        cultural: [
          'Ensure the uploaded specimen is a single close-up tomato leaf (Solanum lycopersicum).',
          'Isolate this specimen if secondary crop cross-contamination is suspected.'
        ],
        organic: [
          'Consult agricultural extension guidelines specific to this crop species before applying treatments.'
        ],
        chemicalCaution: 'Do not apply tomato-specific fungicides or bactericides to other crop families. Inappropriate chemical application can cause severe crop phytotoxicity.',
        sourceReference: 'AgriVision AI Specification (Target Domain: Solanum lycopersicum only)'
      },
      disclaimer: DISCLAIMER_STATEMENT,
      runnerUpClasses: runnerUps.map(r => ({
        label: r.label,
        confidence: r.confidencePercent
      }))
    };
  }

  const guidance = getGuidanceForLabel(topPrediction.label);
  const isLowConfidence = topPrediction.confidencePercent < 60.0;
  const isAmbiguous = topPrediction.confidencePercent < 45.0;

  return {
    rawLabel: topPrediction.label,
    isTomatoClass: true,
    confidence: topPrediction.confidencePercent,
    isLowConfidence,
    confidenceNote: isAmbiguous
      ? 'Confidence is below 45%. Visual indicators are highly ambiguous, blurry, or non-standard. Physical agronomist inspection is required.'
      : isLowConfidence 
      ? 'Confidence is below 60%. Visual signs are ambiguous or non-standard. Field physical inspection strongly advised.'
      : 'Calibrated Softmax probability output from MobileNetV2 neural network.',
    diseaseKey: guidance.diseaseKey,
    displayName: guidance.displayName,
    scientificName: guidance.scientificName,
    severity: isAmbiguous ? 'Inconclusive / High Uncertainty' : guidance.severity,
    isHealthy: guidance.isHealthy,
    affectedParts: guidance.affectedParts,
    summary: isAmbiguous
      ? `Model prediction (${guidance.displayName}) has high uncertainty (${topPrediction.confidencePercent}%). Photographic quality, illumination, or non-standard symptoms hinder reliable automated classification.`
      : guidance.summary,
    symptoms: guidance.symptoms,
    solutions: guidance.solutions,
    disclaimer: guidance.disclaimer,
    runnerUpClasses: runnerUps.map(r => ({
      label: r.label,
      confidence: r.confidencePercent
    }))
  };
}
