import {
  ScanIcon,
  HistoryIcon,
  SparklesIcon,
  ChevronRightIcon,
  InfoIcon,
  AlertTriangleIcon,
  CheckCircleIcon
} from '../components/common/Icons';
import { CAPTURE_GUIDELINES } from '../data/mockData';
import { api } from '../services/api';

export default function DashboardPage({
  currentUser,
  onNavigate,
  recentScans = [],
  onSelectScan
}) {
  return (
    <div className="dashboard-content">
      {/* Welcome Hero Banner */}
      <section className="dashboard-hero" aria-labelledby="hero-title">
        <div className="hero-left">
          <div className="hero-tag">
            <SparklesIcon size={14} />
            <span>Tomato Crop Pathology &bull; Solanum lycopersicum</span>
          </div>
          <h1 id="hero-title" className="hero-title">
            Welcome, {currentUser?.name || 'Field Agronomist'}
          </h1>
          <p className="hero-subtitle">
            Capture high-resolution tomato foliage imagery to inspect for fungal and bacterial pathogens. Receive real-time neural network inference and verified agronomic solution guidance.
          </p>
          <div className="hero-actions">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => onNavigate('scan')}
              style={{ backgroundColor: '#ffffff', color: 'var(--forest-950)' }}
            >
              <ScanIcon size={20} />
              <span>Scan Tomato Leaf</span>
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => onNavigate('history')}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                borderColor: 'rgba(255, 255, 255, 0.25)'
              }}
            >
              <HistoryIcon size={18} />
              <span>View Scan History</span>
            </button>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-preview-badge">
            <span className="stat-label">Model Target Focus</span>
            <span className="stat-value">Tomato Leaf Foliage</span>
            <span className="stat-note">Early Blight &bull; Late Blight &bull; Bacterial Spot &bull; Healthy</span>
            <div
              style={{
                marginTop: '6px',
                paddingTop: '8px',
                borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.72rem',
                color: 'var(--leaf-200)'
              }}
            >
              <InfoIcon size={14} />
              <span>MobileNetV2 Neural Network Inference</span>
            </div>
          </div>
        </div>
      </section>

      {/* Capture Best Practices */}
      <section style={{ marginBottom: '36px' }} aria-labelledby="guidelines-title">
        <div className="section-header">
          <div>
            <h2 id="guidelines-title" className="section-title">
              Foliage Photography Guidelines
            </h2>
            <p className="section-desc">
              Recommended capture conditions for high-confidence visual symptom identification
            </p>
          </div>
        </div>

        <div className="guidelines-grid">
          {CAPTURE_GUIDELINES.map((guide, idx) => (
            <div key={guide.id} className="guideline-card">
              <div className="guideline-num">{idx + 1}</div>
              <div className="guideline-title">{guide.title}</div>
              <div className="guideline-desc">{guide.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Scans Section */}
      <section aria-labelledby="recent-scans-title">
        <div className="section-header">
          <div>
            <h2 id="recent-scans-title" className="section-title">
              Recent Leaf Inspections
            </h2>
            <p className="section-desc">
              {currentUser?.isLoggedIn
                ? `Latest diagnostic records in your account (${recentScans.length} total)`
                : 'Recent diagnostic records'}
            </p>
          </div>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => onNavigate('history')}
          >
            <span>All Scans ({recentScans.length})</span>
            <ChevronRightIcon size={16} />
          </button>
        </div>

        {recentScans.length === 0 ? (
          <div className="card" style={{ padding: '36px', textAlign: 'center' }}>
            <p style={{ marginBottom: '14px', color: 'var(--text-secondary)' }}>
              No recent scans recorded in your account yet.
            </p>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => onNavigate('scan')}
            >
              <ScanIcon size={16} />
              <span>Perform Your First Scan</span>
            </button>
          </div>
        ) : (
          <div className="recent-scans-grid">
            {recentScans.slice(0, 4).map((scan) => {
              const isHealthy = Boolean(scan.is_healthy ?? scan.isHealthy ?? (scan.statusType === 'success'));
              const diseaseName = scan.disease_name || scan.diseaseName || 'Tomato Pathology';
              const severity = scan.severity || (isHealthy ? 'Optimal Health' : 'Moderate Concern');
              const confidence = Number(scan.confidence || 0).toFixed(1);
              const dateFormatted = scan.created_at
                ? new Date(scan.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })
                : scan.date || 'Recent';

              let imageUrl = '/images/tomato_early_blight.jpg';
              if (scan.image_path) {
                imageUrl = scan.image_path.startsWith('http') ? scan.image_path : `${api.baseUrl}${scan.image_path}`;
              } else if (scan.imageUrl) {
                imageUrl = scan.imageUrl;
              }

              let badgeClass = 'badge-warning';
              if (isHealthy) {
                badgeClass = 'badge-success';
              } else if (severity.includes('Critical') || severity.includes('High')) {
                badgeClass = 'badge-danger';
              }

              return (
                <div
                  key={scan.id}
                  className="recent-scan-card"
                  onClick={() => onSelectScan(scan)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onSelectScan(scan);
                  }}
                  title="Click to view full diagnosis and verified solutions"
                >
                  <img
                    src={imageUrl}
                    alt={diseaseName}
                    className="scan-thumb"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/tomato_early_blight.jpg';
                    }}
                  />
                  <div className="scan-info">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <span className="scan-disease-name">{diseaseName}</span>
                      <span className={`badge ${badgeClass}`}>
                        {isHealthy ? <CheckCircleIcon size={12} /> : <AlertTriangleIcon size={12} />}
                        {severity}
                      </span>
                    </div>

                    <div className="scan-meta-row">
                      <span>{dateFormatted}</span>
                      <span>&bull;</span>
                      <span style={{ fontFamily: 'var(--font-mono)' }}>
                        Confidence: {confidence}%
                      </span>
                    </div>
                  </div>
                  <ChevronRightIcon size={18} style={{ color: 'var(--text-tertiary)' }} />
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
