import { useState, useEffect, useCallback } from 'react';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import ScanPage from './pages/ScanPage';
import ResultPage from './pages/ResultPage';
import HistoryPage from './pages/HistoryPage';
import AuthPage from './pages/AuthPage';
import { api, authStorage } from './services/api';
import './styles/App.css';
import './styles/pages.css';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [backendConnected, setBackendConnected] = useState(true);
  const [currentUser, setCurrentUser] = useState({
    isLoggedIn: false,
    id: null,
    name: '',
    email: '',
    role: ''
  });

  const [scanHistory, setScanHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);

  // Fetch scans for authenticated user from MySQL
  const fetchHistory = useCallback(async () => {
    const token = authStorage.getToken();
    if (!token) {
      setScanHistory([]);
      return;
    }

    setHistoryLoading(true);
    try {
      const res = await api.getScanHistory();
      if (res.success && Array.isArray(res.scans)) {
        setScanHistory(res.scans);
      }
    } catch (err) {
      console.error('[App] Failed to load history:', err);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  // Restore authenticated session on mount
  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      try {
        const res = await api.getHealth();
        if (isMounted) setBackendConnected(res?.status === 'online');
      } catch {
        if (isMounted) setBackendConnected(false);
      }

      const token = authStorage.getToken();
      if (!token) return;

      try {
        const data = await api.getMe();
        if (isMounted && data.success && data.user) {
          setCurrentUser({
            ...data.user,
            isLoggedIn: true
          });
          fetchHistory();
        } else {
          authStorage.clearAll();
        }
      } catch {
        authStorage.clearAll();
        if (isMounted) {
          setCurrentUser({ isLoggedIn: false, id: null, name: '', email: '', role: '' });
        }
      }
    }

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, [fetchHistory]);

  function handleNavigate(screenId) {
    setCurrentScreen(screenId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSelectScan(scan) {
    try {
      // Fetch full guidance if available
      const detail = await api.getScanById(scan.id);
      if (detail.success && detail.scan) {
        setCurrentResult(detail.scan);
      } else {
        setCurrentResult(scan);
      }
    } catch {
      // Fallback to basic record if network or endpoint fails
      setCurrentResult(scan);
    }
    setCurrentScreen('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleScanSuccess(result) {
    setCurrentResult(result);
    // Prepend optimistic record to history
    const optimisticRecord = {
      id: result.scanId,
      disease_name: result.displayName,
      scientific_name: result.scientificName,
      severity: result.severity,
      confidence: result.confidence,
      is_healthy: result.isHealthy ? 1 : 0,
      image_path: result.imagePath,
      created_at: result.timestamp || new Date().toISOString()
    };
    setScanHistory((prev) => [optimisticRecord, ...prev]);
    // Synchronize history with MySQL
    fetchHistory();
  }

  async function handleDeleteScan(scanId) {
    await api.deleteScan(scanId);
    setScanHistory((prev) => prev.filter((item) => item.id !== scanId));
  }

  function handleLogin(token, user) {
    authStorage.setToken(token);
    authStorage.setUser(user);
    setCurrentUser({
      ...user,
      isLoggedIn: true
    });
    fetchHistory();
  }

  function handleLogout() {
    authStorage.clearAll();
    setCurrentUser({
      isLoggedIn: false,
      id: null,
      name: '',
      email: '',
      role: ''
    });
    setScanHistory([]);
    setCurrentResult(null);
    setCurrentScreen('dashboard');
  }

  return (
    <AppLayout
      currentScreen={currentScreen}
      onNavigate={handleNavigate}
      currentUser={currentUser}
      onLogout={handleLogout}
      backendConnected={backendConnected}
    >
      {currentScreen === 'dashboard' && (
        <DashboardPage
          currentUser={currentUser}
          onNavigate={handleNavigate}
          recentScans={scanHistory}
          onSelectScan={handleSelectScan}
        />
      )}

      {currentScreen === 'scan' && (
        <ScanPage
          currentUser={currentUser}
          onScanSuccess={handleScanSuccess}
          onNavigate={handleNavigate}
        />
      )}

      {currentScreen === 'result' && (
        <ResultPage
          currentResult={currentResult}
          onNavigate={handleNavigate}
        />
      )}

      {currentScreen === 'history' && (
        <HistoryPage
          currentUser={currentUser}
          scans={scanHistory}
          loading={historyLoading}
          onRefresh={fetchHistory}
          onDeleteScan={handleDeleteScan}
          onSelectScan={handleSelectScan}
          onNavigate={handleNavigate}
        />
      )}

      {currentScreen === 'auth' && (
        <AuthPage
          currentUser={currentUser}
          onLogin={handleLogin}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      )}
    </AppLayout>
  );
}
