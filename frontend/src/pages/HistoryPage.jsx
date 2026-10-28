import { useState } from 'react';
import {
  HistoryIcon,
  TrashIcon,
  ScanIcon,
  SearchIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  RefreshCwIcon,
  UserIcon
} from '../components/common/Icons';
import Modal from '../components/common/Modal';
import { api } from '../services/api';

export default function HistoryPage({
  currentUser,
  scans = [],
  loading = false,
  onRefresh,
  onDeleteScan,
  onSelectScan,
  onNavigate
}) {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'infected' | 'healthy'
  const [searchQuery, setSearchQuery] = useState('');
  const [scanToDelete, setScanToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Normalize scan fields
  const normalizedScans = scans.map((s) => {
    const isHealthy = Boolean(s.is_healthy ?? s.isHealthy ?? (s.statusType === 'success'));
    const diseaseName = s.disease_name || s.diseaseName || 'Tomato Pathology';
    const scientificName = s.scientific_name || s.scientificName || 'Solanum lycopersicum';
    const severity = s.severity || (isHealthy ? 'Optimal Health' : 'Moderate Concern');
    const confidence = Number(s.confidence || 0).toFixed(1);
    const dateFormatted = s.created_at
      ? new Date(s.created_at).toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      : s.date || 'Recent';

    let imageUrl = '/images/tomato_early_blight.jpg';
    if (s.image_path) {
      imageUrl = s.image_path.startsWith('http') ? s.image_path : `${api.baseUrl}${s.image_path}`;
    } else if (s.imageUrl) {
      imageUrl = s.imageUrl;
    }

    let badgeClass = 'badge-warning';
    if (isHealthy) {
      badgeClass = 'badge-success';
    } else if (severity.includes('Critical') || severity.includes('High')) {
      badgeClass = 'badge-danger';
    }

    return {
      ...s,
      isHealthy,
      diseaseName,
      scientificName,
      severity,
      confidence,
      dateFormatted,
      imageUrl,
      badgeClass
    };
  });

  // Filter scans
  const filteredScans = normalizedScans.filter((scan) => {
    if (activeFilter === 'infected' && scan.isHealthy) return false;
    if (activeFilter === 'healthy' && !scan.isHealthy) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = scan.diseaseName.toLowerCase().includes(q);
      const matchSci = scan.scientificName.toLowerCase().includes(q);
      const matchId = String(scan.id).toLowerCase().includes(q);
      return matchName || matchSci || matchId;
    }

    return true;
  });

  async function confirmDelete() {
    if (!scanToDelete) return;
    setIsDeleting(true);
    setDeleteError('');
    try {
      await onDeleteScan(scanToDelete.id);
      setScanToDelete(null);
    } catch (err) {
      setDeleteError(err.message || 'Unable to delete scan record.');
    } finally {
      setIsDeleting(false);
    }
  }

  // If user is not authenticated, show sign-in prompt
  if (!currentUser?.isLoggedIn) {
    return (
      <div className="history-page-content">
        <div className="section-header" style={{ marginBottom: '24px' }}>
          <div>
            <h1 className="section-title">Tomato Leaf Pathology Scan History</h1>
            <p className="section-desc">
              Historical diagnostic records and agronomic monitoring logs
            </p>
          </div>
        </div>

        <div className="card" style={{ padding: '48px 24px', textAlign: 'center', maxWidth: '640px', margin: '32px auto' }}>
          <div className="empty-icon-wrap" style={{ margin: '0 auto 20px' }}>
            <UserIcon size={32} />
          </div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Sign In Required for Scan History</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem', lineHeight: 1.5 }}>
            Each field inspection is securely stored in your personal account database. Please sign in or register to view, review, and manage your tomato leaf disease diagnostics.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onNavigate('auth')}
            >
              <UserIcon size={16} />
              <span>Sign In / Register</span>
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => onNavigate('scan')}
            >
              <ScanIcon size={16} />
              <span>Back to Scanner</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="history-page-content">
      {/* Header */}
      <div className="section-header" style={{ marginBottom: '16px' }}>
        <div>
          <h1 className="section-title">Tomato Leaf Scan History</h1>
          <p className="section-desc">
            Verified database records for agronomist: <strong>{currentUser.email}</strong>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {onRefresh && (
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={onRefresh}
              disabled={loading}
              title="Refresh database scans"
            >
              <RefreshCwIcon size={14} className={loading ? 'spin-animation' : ''} />
              <span>Refresh</span>
            </button>
          )}
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => onNavigate('scan')}
          >
            <ScanIcon size={16} />
            <span>New Inspection</span>
          </button>
        </div>
      </div>

      {/* Database Persistence Status Banner */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          fontSize: '0.825rem',
          color: 'var(--text-secondary)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircleIcon size={16} style={{ color: 'var(--leaf-500)', flexShrink: 0 }} />
          <span>
            <strong>MySQL Database Persistence:</strong> Scans and thumbnails are securely isolated by authenticated user ID.
          </span>
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
          {normalizedScans.length} {normalizedScans.length === 1 ? 'Record' : 'Records'}
        </span>
      </div>

      {/* Controls & Search */}
      <div className="history-controls-bar">
        <div className="filter-tabs">
          <button
            type="button"
            className={`filter-tab-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All Scans ({normalizedScans.length})
          </button>
          <button
            type="button"
            className={`filter-tab-btn ${activeFilter === 'infected' ? 'active' : ''}`}
            onClick={() => setActiveFilter('infected')}
          >
            Infected ({normalizedScans.filter((s) => !s.isHealthy).length})
          </button>
          <button
            type="button"
            className={`filter-tab-btn ${activeFilter === 'healthy' ? 'active' : ''}`}
            onClick={() => setActiveFilter('healthy')}
          >
            Healthy ({normalizedScans.filter((s) => s.isHealthy).length})
          </button>
        </div>

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <SearchIcon
            size={16}
            style={{
              position: 'absolute',
              left: '10px',
              color: 'var(--text-tertiary)',
              pointerEvents: 'none'
            }}
          />
          <input
            type="search"
            className="history-search-input"
            style={{ paddingLeft: '32px' }}
            placeholder="Search by disease or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Loading state */}
      {loading && normalizedScans.length === 0 ? (
        <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
          <RefreshCwIcon size={28} className="spin-animation" style={{ color: 'var(--forest-600)', margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Loading scan history from database...</p>
        </div>
      ) : filteredScans.length === 0 ? (
        /* Empty State */
        <div className="empty-state-box">
          <div className="empty-icon-wrap">
            <HistoryIcon size={32} />
          </div>
          <h3 className="empty-title">
            {normalizedScans.length === 0 ? 'No Field Scans Yet' : 'No Matching Records'}
          </h3>
          <p className="empty-desc">
            {normalizedScans.length === 0
              ? 'You have not uploaded any tomato leaf specimens yet. Run your first pathology scan to view diagnostic reports and treatment guidelines here.'
              : 'No records matched your search query or filter. Try clearing your search term.'}
          </p>

          <div style={{ display: 'flex', gap: '10px' }}>
            {normalizedScans.length > 0 && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setActiveFilter('all');
                  setSearchQuery('');
                }}
              >
                Clear Filter
              </button>
            )}

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onNavigate('scan')}
            >
              <ScanIcon size={16} />
              <span>Scan Tomato Leaf</span>
            </button>
          </div>
        </div>
      ) : (
        /* Scans Grid */
        <div className="history-cards-grid">
          {filteredScans.map((scan) => (
            <div key={scan.id} className="history-item-card">
              <div className="history-card-header">
                <img
                  src={scan.imageUrl}
                  alt={scan.diseaseName}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/tomato_early_blight.jpg';
                  }}
                />
                <div className="history-card-badge">
                  <span className={`badge ${scan.badgeClass}`}>
                    {scan.isHealthy ? <CheckCircleIcon size={12} /> : <AlertTriangleIcon size={12} />}
                    {scan.severity}
                  </span>
                </div>
              </div>

              <div className="history-card-body">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                  <div>
                    <h3 className="history-card-title">{scan.diseaseName}</h3>
                    <span style={{ fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--text-tertiary)' }}>
                      {scan.scientificName}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {scan.confidence}%
                  </span>
                </div>

                <div className="history-card-meta">
                  <span>{scan.dateFormatted}</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{scan.id}</span>
                </div>

                <div className="history-card-actions">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => onSelectScan(scan)}
                  >
                    <span>View Solutions</span>
                    <ChevronRightIcon size={14} />
                  </button>

                  <button
                    type="button"
                    className="btn btn-danger-outline btn-sm"
                    onClick={() => {
                      setDeleteError('');
                      setScanToDelete(scan);
                    }}
                    aria-label={`Delete scan record ${scan.id}`}
                    title="Remove from history"
                  >
                    <TrashIcon size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(scanToDelete)}
        onClose={() => {
          if (!isDeleting) setScanToDelete(null);
        }}
        title="Confirm Record Deletion"
        footer={
          <>
            <button
              type="button"
              className="btn btn-outline"
              disabled={isDeleting}
              onClick={() => setScanToDelete(null)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              disabled={isDeleting}
              onClick={confirmDelete}
            >
              {isDeleting ? (
                <>
                  <RefreshCwIcon size={14} className="spin-animation" />
                  <span>Deleting Record...</span>
                </>
              ) : (
                <>
                  <TrashIcon size={16} />
                  <span>Confirm Delete</span>
                </>
              )}
            </button>
          </>
        }
      >
        <p style={{ marginBottom: '12px' }}>
          Are you sure you want to permanently delete this scan inspection record from your account database?
        </p>
        {scanToDelete && (
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.85rem'
            }}
          >
            <div>
              <strong>Record ID:</strong> {scanToDelete.id}
            </div>
            <div>
              <strong>Pathology:</strong> {scanToDelete.diseaseName}
            </div>
            <div>
              <strong>Captured:</strong> {scanToDelete.dateFormatted}
            </div>
          </div>
        )}

        {deleteError && (
          <div
            style={{
              marginTop: '12px',
              padding: '8px 12px',
              backgroundColor: 'var(--danger-bg)',
              color: 'var(--danger-text)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem'
            }}
          >
            {deleteError}
          </div>
        )}
      </Modal>
    </div>
  );
}
