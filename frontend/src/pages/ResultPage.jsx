import {
  ScanIcon,
  HistoryIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  InfoIcon,
  LeafIcon,
  ArrowLeftIcon,
  SparklesIcon
} from '../components/common/Icons';
import { api } from '../services/api';

export default function ResultPage({ currentResult, onNavigate }) {
  if (!currentResult) {
    return (
      <div className="result-page-content">
        <div className="card" style={{ padding: '40px', textAlign: 'center', margin: '40px auto', maxWidth: '600px' }}>
          <AlertTriangleIcon size={36} style={{ color: 'var(--warning-accent)', marginBottom: '16px' }} />
          <h2 style={{ marginBottom: '8px' }}>No Inspection Result Loaded</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Please upload a tomato leaf image to generate a pathology diagnosis.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onNavigate('scan')}
          >
            <ScanIcon size={16} />
            <span>Go to Scanner</span>
          </button>
        </div>
      </div>
    );
  }

  // Normalize fields from either detection result or history record
  const scanId = currentResult.scanId || currentResult.id || 'SCN-LOCAL';
  const diseaseName = currentResult.displayName || currentResult.disease_name || currentResult.diseaseName || 'Tomato Pathology Analysis';
  const scientificName = currentResult.scientificName || currentResult.scientific_name || 'Solanum lycopersicum';
  const severity = currentResult.severity || 'Moderate Concern';
  const confidence = Number(currentResult.confidence || 0).toFixed(1);
  const isHealthy = Boolean(currentResult.isHealthy || currentResult.is_healthy);
  const isLowConfidence = currentResult.isLowConfidence ?? (Number(confidence) < 60);

  // Fallback safe guidance structures
  const summary = currentResult.summary || 'Pathology evaluation generated via MobileNetV2 neural network.';
  const affectedParts = currentResult.affectedParts || ['Foliage'];
  const symptoms = currentResult.symptoms && currentResult.symptoms.length > 0
    ? currentResult.symptoms
    : ['Observed lesion patterns and foliar discoloration consistent with classified pathogen.'];

  const solutions = currentResult.solutions || {};
  const culturalSolutions = solutions.cultural || [
    'Prune lower foliage touching soil to prevent spore transfer.',
    'Maintain dry leaf canopy using drip irrigation.',
    'Sanitize pruning tools between plants.'
  ];
  const organicSolutions = solutions.organic || [
    'Apply copper-based bio-fungicide at early manifestation.',
    'Introduce beneficial rhizosphere microorganisms (Bacillus subtilis).'
  ];
  const chemicalNotice = solutions.chemicalCaution || solutions.chemicalNotice || 
    'Synthetic pesticides must only be applied under certified agronomist recommendation with strict compliance to pre-harvest intervals.';
  const sourceReference = solutions.sourceReference || solutions.source || 
    'ICAR Indian Institute of Vegetable Research & USDA Tomato IPM Guidelines';
  const disclaimerText = currentResult.disclaimer || 
    'AI-assisted predictions are informational decision-support aids only and do not replace certified botanical or agricultural extension diagnosis. Field confirmation is advised before chemical application.';

  // Determine display image URL
  let displayImage = '/images/tomato_early_blight.jpg';
  if (currentResult.userImage) {
    displayImage = currentResult.userImage;
  } else if (currentResult.imagePath || currentResult.image_path) {
    const rawPath = currentResult.imagePath || currentResult.image_path;
    displayImage = rawPath.startsWith('http') ? rawPath : `${api.baseUrl}${rawPath}`;
  }

  // Severity badge style mapping
  let badgeClass = 'badge-warning';
  if (isHealthy) {
    badgeClass = 'badge-success';
  } else if (severity.includes('Critical') || severity.includes('High')) {
    badgeClass = 'badge-danger';
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="result-page-content">
      {/* Top Controls */}
      <div className="result-header-bar">
        <div>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => onNavigate('scan')}
            style={{ marginBottom: '8px' }}
          >
            <ArrowLeftIcon size={16} />
            <span>Back to Scanner</span>
          </button>
          <h1 className="section-title">Diagnostic Result & Agronomic Guidance</h1>
          <p className="section-desc">
            Neural network pathology evaluation and verified extension management protocols
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={handlePrint}
          >
            <span>Print / Export Summary</span>
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => onNavigate('history')}
          >
            <HistoryIcon size={16} />
            <span>Scan History</span>
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onNavigate('scan')}
          >
            <ScanIcon size={16} />
            <span>Scan Another Leaf</span>
          </button>
        </div>
      </div>

      {/* Low-Confidence Warning Card */}
      {isLowConfidence && (
        <div
          role="alert"
          style={{
            backgroundColor: 'var(--warning-bg)',
            border: '1px solid var(--warning-border)',
            color: 'var(--warning-text)',
            padding: '16px 20px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            display: 'flex',
            gap: '14px',
            alignItems: 'flex-start'
          }}
        >
          <AlertTriangleIcon size={24} style={{ flexShrink: 0, marginTop: 2, color: 'var(--warning-accent)' }} />
          <div>
            <strong style={{ fontSize: '0.95rem', display: 'block', marginBottom: '4px' }}>
              Low Diagnostic Confidence Warning ({confidence}%)
            </strong>
            <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.5 }}>
              The neural network returned a confidence score below 60%. Visual signs may be ambiguous, multi-pathogenic, or caused by non-infectious physiological stresses (e.g. blossom-end rot, nutrient chlorosis, drought). Do not initiate aggressive chemical treatments without in-person confirmation by a plant pathology specialist.
            </p>
          </div>
        </div>
      )}

      {/* Official AI Decision Support Disclaimer */}
      <div className="result-disclaimer-banner" role="alert" style={{ marginBottom: '24px' }}>
        <InfoIcon size={20} style={{ flexShrink: 0, marginTop: 2, color: 'var(--forest-600)' }} />
        <div>
          <strong>AI DECISION SUPPORT NOTICE:</strong> {disclaimerText}
        </div>
      </div>

      <div className="result-grid">
        {/* Left Column: Image, Classification & Confidence */}
        <div className="diagnosis-hero-card">
          <div className="diagnosis-image-box">
            <img
              src={displayImage}
              alt={`Inspected leaf specimen: ${diseaseName}`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/tomato_early_blight.jpg';
              }}
            />
          </div>

          <div className="diagnosis-body">
            <div className="disease-taxa-header">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <span className={`badge ${badgeClass}`}>
                  {isHealthy ? <CheckCircleIcon size={14} /> : <AlertTriangleIcon size={14} />}
                  {severity}
                </span>

                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                  ID: {scanId}
                </span>
              </div>

              <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginTop: '8px' }}>
                {diseaseName}
              </h2>
              <span className="scientific-name">{scientificName}</span>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {summary}
            </p>

            {/* Confidence / Uncertainty Indicator */}
            <div className="confidence-metric-block">
              <div className="confidence-header">
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <SparklesIcon size={14} style={{ color: 'var(--leaf-500)' }} />
                  <span>Model Confidence</span>
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', fontWeight: 700 }}>
                  {confidence}%
                </span>
              </div>
              <div className="confidence-bar-bg">
                <div
                  className={`confidence-bar-fill ${
                    isHealthy ? '' : isLowConfidence ? 'warning' : 'danger'
                  }`}
                  style={{
                    width: `${Math.min(Math.max(Number(confidence), 5), 100)}%`,
                    backgroundColor: isHealthy
                      ? 'var(--leaf-500)'
                      : isLowConfidence
                      ? 'var(--warning-accent)'
                      : 'var(--danger-accent)'
                  }}
                />
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', lineHeight: 1.35 }}>
                Calibrated Softmax probability output from local MobileNetV2 neural network.
              </span>
            </div>

            {/* Susceptible Plant Tissue */}
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Susceptible Organs:
              </span>
              <div className="affected-parts-tags">
                {affectedParts.map((part) => (
                  <span key={part} className="badge badge-neutral">
                    {part}
                  </span>
                ))}
              </div>
            </div>

            {/* Runner-up Candidates if available */}
            {currentResult.runnerUpClasses && currentResult.runnerUpClasses.length > 0 && (
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                  Secondary Model Candidates:
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {currentResult.runnerUpClasses.slice(0, 2).map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.78rem',
                        color: 'var(--text-secondary)',
                        fontFamily: 'var(--font-mono)'
                      }}
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '75%' }}>
                        {item.label.replace('Tomato___', '').replace(/_/g, ' ')}
                      </span>
                      <span>{item.confidence}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Symptoms & Agronomic Solutions */}
        <div className="solutions-column">
          {/* Symptoms breakdown */}
          <div className="solution-box">
            <div className="solution-box-header">
              <LeafIcon size={20} style={{ color: 'var(--leaf-500)' }} />
              <div>
                <h3 style={{ fontSize: '1.1rem' }}>Pathological Symptoms Observed</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                  Visual markers characteristic of this condition
                </p>
              </div>
            </div>

            <ul className="solution-list">
              {symptoms.map((symptom, idx) => (
                <li key={idx} className="solution-item">
                  <CheckCircleIcon size={18} />
                  <span>{symptom}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions & Management */}
          <div className="solution-box">
            <div className="solution-box-header">
              <CheckCircleIcon size={20} style={{ color: 'var(--forest-700)' }} />
              <div>
                <h3 style={{ fontSize: '1.1rem' }}>Verified Agronomic Management</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                  Cultural and bio-rational mitigation strategies
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--forest-800)', marginBottom: '8px' }}>
                Cultural & Preventative Measures:
              </h4>
              <ul className="solution-list">
                {culturalSolutions.map((item, idx) => (
                  <li key={idx} className="solution-item">
                    <CheckCircleIcon size={16} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--forest-800)', marginBottom: '8px' }}>
                Organic & Biological Options:
              </h4>
              <ul className="solution-list">
                {organicSolutions.map((item, idx) => (
                  <li key={idx} className="solution-item">
                    <CheckCircleIcon size={16} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Chemical Treatment Safety Notice */}
            <div className="chemical-alert-note">
              <AlertTriangleIcon size={18} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong>Chemical Intervention Protocol:</strong> {chemicalNotice}
              </div>
            </div>
          </div>

          {/* Source Verification Badge */}
          <div className="verified-source-footer">
            <InfoIcon size={18} style={{ flexShrink: 0 }} />
            <div>
              <strong>Agronomic Reference Standard:</strong> {sourceReference}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
