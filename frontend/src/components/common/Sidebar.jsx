import {
  LeafIcon,
  DashboardIcon,
  ScanIcon,
  HistoryIcon,
  UserIcon,
  FileCheckIcon,
  SparklesIcon
} from './Icons';

export default function Sidebar({ currentScreen, onNavigate, isMobileOpen, onCloseMobile }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
    { id: 'scan', label: 'Tomato Leaf Scan', icon: ScanIcon },
    { id: 'result', label: 'Result & Solutions', icon: FileCheckIcon },
    { id: 'history', label: 'Scan History', icon: HistoryIcon },
    { id: 'auth', label: 'Account / Login', icon: UserIcon },
  ];

  function handleNav(screenId) {
    onNavigate(screenId);
    if (onCloseMobile) onCloseMobile();
  }

  return (
    <>
      <div
        className={`mobile-drawer-overlay ${isMobileOpen ? 'mobile-open' : ''}`}
        onClick={onCloseMobile}
        aria-hidden="true"
      />
      <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`} aria-label="Main Navigation">
        <div className="sidebar-header">
          <div className="brand-badge" onClick={() => handleNav('dashboard')}>
            <div className="brand-icon-box">
              <LeafIcon size={22} />
            </div>
            <div className="brand-text-block">
              <span className="brand-name">
                AgriVision <span className="ai-tag">AI</span>
              </span>
              <span className="brand-subtitle">Tomato Disease Studio</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title">Navigation</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={() => handleNav(item.id)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="phase-chip">
            <div className="phase-chip-title">
              <SparklesIcon size={14} />
              <span>Live AI Engine</span>
            </div>
            <div className="phase-chip-desc">
              MobileNetV2 ONNX &bull; MySQL Database active.
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
