import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const { user, loading } = useAuth();

  const [currentPath, setCurrentPath] = useState(
    window.location.pathname === '/' ? '/dashboard' : window.location.pathname
  );

  const navigateSecurely = useCallback((path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  }, []);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (loading) return;
    const isPublicRoute = currentPath === '/login' || currentPath === '/register';
    if (user && isPublicRoute) {
      navigateSecurely('/dashboard');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center" style={{ background: '#07070A' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #8B5CF6, #C026D3)', boxShadow: '0 0 24px rgba(139,92,246,0.4)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </div>
          <div className="h-5 w-5 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: 'rgba(139,92,246,0.4)', borderTopColor: 'transparent' }} />
        </div>
      </div>
    );
  }

  const renderView = () => {
    switch (currentPath) {
      case '/login': return <Login onNavigate={navigateSecurely} />;
      case '/register': return <Register onNavigate={navigateSecurely} />;
      default: return <Dashboard onNavigate={navigateSecurely} />;
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[#0a0010] overflow-hidden">
      {renderView()}
    </div>
  );
}

export default App;
