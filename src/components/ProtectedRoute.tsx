import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { checkAuthStatus, validateToken } from '../api/auth/utils';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Önce basit token varlığı kontrolü
        const { isAuthenticated: authenticated } = checkAuthStatus();
        if (!authenticated) {
          setIsAuthorized(false);
          setIsValidating(false);
          return;
        }
        // Sonra backend'de token doğrulama (isteğe bağlı)
        const isValid = await validateToken();
        setIsAuthorized(isValid);
      } catch (error) {
        setIsAuthorized(false);
      } finally {
        setIsValidating(false);
      }
    };
    checkAuth();
  }, []);

  if (isValidating) {
    return (
      <div className="auth-loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Yetki kontrolü yapılıyor...</div>
        </div>
        <style>{`
          .auth-loading {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #1f1f1f 0%, #000000 50%, #1a1a1a 100%);
          }
          .loading-container {
            text-align: center;
            padding: 2rem;
          }
          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(251,191,36,0.3);
            border-top: 4px solid #fbbf24;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
          }
          .loading-text {
            color: #fbbf24;
            font-size: 1rem;
            font-weight: 500;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;