import { MenuIcon, ScanIcon, LogOutIcon } from './Icons';

export default function Navbar({ currentScreen, onNavigate, onToggleMobile, currentUser, onLogout }) {
  const screenTitles = {
    dashboard: 'Dashboard',
    scan: 'Tomato Disease Scan',
    result: 'Scan Result & Solutions',
    history: 'Scan History',
    auth: 'Sign In / Register'
  };

  return (
    <header className="top-navbar">
      <div className="top-left">
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={onToggleMobile}
          aria-label="Toggle navigation menu"
        >
          <MenuIcon size={20} />
        </button>

        <div className="top-breadcrumb">
          <span>AgriVision AI</span>
          <span>/</span>
          <span className="current">{screenTitles[currentScreen] || 'Overview'}</span>
        </div>
      </div>

      <div className="top-right">
        {currentScreen !== 'scan' && (
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => onNavigate('scan')}
          >
            <ScanIcon size={16} />
            <span>New Scan</span>
          </button>
        )}

        <button
          type="button"
          className="user-pill"
          onClick={() => onNavigate('auth')}
          style={{ cursor: 'pointer', background: 'none', border: '1px solid var(--border-medium)' }}
          title={currentUser?.isLoggedIn ? 'Account Profile' : 'Click to Sign In'}
        >
          <div className="user-avatar">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'G'}
          </div>
          <div className="user-meta">
            <span className="user-name">{currentUser?.name || 'Guest User'}</span>
            <span className="user-role">{currentUser?.isLoggedIn ? (currentUser.role || 'Agronomist') : 'Not Signed In'}</span>
          </div>
        </button>

        {currentUser?.isLoggedIn && (
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={onLogout}
            title="Sign out of AgriVision AI"
            style={{ padding: '6px 10px', color: 'var(--text-secondary)' }}
          >
            <LogOutIcon size={15} />
            <span style={{ fontSize: '0.8rem' }}>Logout</span>
          </button>
        )}
      </div>
    </header>
  );
}
