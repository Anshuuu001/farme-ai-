import { AlertTriangleIcon, CheckCircleIcon } from './Icons';

export default function StatusBanner({ backendConnected = true, onDismiss }) {
  const isOnline = Boolean(backendConnected);

  return (
    <aside
      className="status-banner"
      role="region"
      aria-label="System Notice"
      style={
        isOnline
          ? { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534' }
          : { backgroundColor: '#fffbeb', borderColor: '#fde68a', color: '#92400e' }
      }
    >
      <div className="status-banner-content">
        <span
          className="status-pill"
          style={isOnline ? { backgroundColor: '#16a34a' } : { backgroundColor: '#f59e0b' }}
        >
          {isOnline ? (
            <CheckCircleIcon size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: '-1px' }} />
          ) : (
            <AlertTriangleIcon size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: '-1px' }} />
          )}
          {isOnline ? 'System Online' : 'Backend Disconnected'}
        </span>
        <span>
          {isOnline ? (
            <>
              <strong>Phase 2 Live Engine:</strong> MobileNetV2 ONNX local model active &bull; MySQL database connected &bull; Real authentication & scan history enabled.
            </>
          ) : (
            <>
              <strong>Backend Disconnected:</strong> Cannot reach Express API at <code>http://localhost:5000</code>. Ensure backend server is started with <code>npm start</code>.
            </>
          )}
        </span>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="btn btn-sm btn-outline"
          style={{
            padding: '2px 8px',
            fontSize: '0.75rem',
            borderColor: isOnline ? '#bbf7d0' : '#fde68a',
            color: isOnline ? '#166534' : '#92400e'
          }}
        >
          Dismiss
        </button>
      )}
    </aside>
  );
}
