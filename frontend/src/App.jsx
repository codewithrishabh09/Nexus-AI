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
      <div className="min-h-screen w-screen bg-[#0a0010] flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
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
