import { useState } from 'react';
import Navbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';
import StatusBanner from '../common/StatusBanner';

export default function AppLayout({
  currentScreen,
  onNavigate,
  currentUser,
  onLogout,
  backendConnected,
  children
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showStatusBanner, setShowStatusBanner] = useState(true);

  return (
    <div className="app-container">
      <Sidebar
        currentScreen={currentScreen}
        onNavigate={onNavigate}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      <div className="main-wrapper">
        <Navbar
          currentScreen={currentScreen}
          onNavigate={onNavigate}
          onToggleMobile={() => setIsMobileOpen((prev) => !prev)}
          currentUser={currentUser}
          onLogout={onLogout}
        />

        {showStatusBanner && (
          <StatusBanner
            backendConnected={backendConnected}
            onDismiss={() => setShowStatusBanner(false)}
          />
        )}

        <main className="page-container" id="main-content">
          {children}
        </main>

        <footer className="app-footer">
          <div>
            <strong>AgriVision AI</strong> &bull; Precision Agriculture Pathology System
          </div>
          <div>
            Powered by MobileNetV2 ONNX &bull; Node.js &bull; MySQL
          </div>
        </footer>
      </div>
    </div>
  );
}
