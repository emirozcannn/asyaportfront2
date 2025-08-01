import React, { useState, useEffect } from 'react';
import { loginUser } from './api/supabaseAuth';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('bt.mudur@asyaport.com');
  const [password, setPassword] = useState('alper1emir');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [loginSuccess, setLoginSuccess] = useState(false); // Yeni state
  const [formShake, setFormShake] = useState(false); // Shake animasyonu için
  const navigate = useNavigate();

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-fill from localStorage if remember me was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedRemember = localStorage.getItem('rememberMe') === 'true';
    
    if (savedEmail && savedRemember) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setLoginSuccess(false);
    setFormShake(false);
    
    // Check network connectivity
    if (!isOnline) {
      setError('İnternet bağlantınızı kontrol edin.');
      setLoading(false);
      return;
    }
    
    try {
      console.log('Attempting login with:', { email, password: '***' });
      
      const result = await loginUser(email, password);
      console.log('Login successful:', result);
      
      // Handle remember me
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberMe');
      }
      
      // Store auth info
      localStorage.setItem('authToken', result.token || 'temp-token');
      localStorage.setItem('userInfo', JSON.stringify(result.user || { email }));
      
      // Set success state instead of DOM manipulation
      setLoginSuccess(true);
      
      // Navigate to dashboard after a brief delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
      
    } catch (err: any) {
      console.error('Login error:', err);
      
      let errorMessage = 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.';
      
      if (err?.message) {
        if (err.message.includes('500')) {
          errorMessage = 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
        } else if (err.message.includes('401') || err.message.includes('Invalid')) {
          errorMessage = 'Email veya şifre hatalı.';
        } else if (err.message.includes('Network')) {
          errorMessage = 'Bağlantı hatası. İnternet bağlantınızı kontrol edin.';
        } else if (err.message.includes('timeout')) {
          errorMessage = 'İstek zaman aşımına uğradı. Lütfen tekrar deneyin.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      
      // Shake animation using state instead of DOM manipulation
      setFormShake(true);
      setTimeout(() => {
        setFormShake(false);
      }, 500);
      
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    alert('Şifre sıfırlama özelliği yakında aktif olacak. Şimdilik BT destek ile iletişime geçin.');
  };

  const handleContactSupport = () => {
    window.location.href = 'mailto:bt.destek@asyaport.com?subject=Sistem Giriş Sorunu';
  };

  return (
    <div className="login-container">
      <div className="container-fluid h-100">
        <div className="row h-100 g-0">
          {/* Left Side - Corporate Branding */}
          <div className="col-lg-7 d-none d-lg-flex">
            <div className="brand-section">
              <div className="brand-content">
                <div className="company-logo">
                  {/* SVG Logo as primary, always works */}
                  <svg width="200" height="80" viewBox="0 0 200 80" className="logo-svg">
                    <defs>
                      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4299e1"/>
                        <stop offset="100%" stopColor="#63b3ed"/>
                      </linearGradient>
                    </defs>
                    <circle cx="40" cy="40" r="30" fill="url(#logoGradient)" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
                    <text x="40" y="50" textAnchor="middle" fill="white" fontSize="20" fontWeight="900">A</text>
                    <text x="90" y="35" fill="white" fontSize="18" fontWeight="700" letterSpacing="1">ASYAPORT</text>
                    <text x="90" y="55" fill="rgba(255,255,255,0.8)" fontSize="10" fontWeight="500" letterSpacing="0.5">ZIMMET SİSTEMİ</text>
                  </svg>
                </div>
                
                <div className="company-info">
                  <h1 className="company-title">AsyaPort</h1>
                  <div className="company-tagline">Zimmet Yönetim Sistemi</div>
                  <div className="company-description">
                    Kurumsal varlık yönetimi ve zimmet takibi için gelişmiş çözümler.
                    Güvenilir, ölçeklenebilir ve profesyonel platform.
                  </div>
                </div>

                <div className="features-grid">
                  <div className="feature-card">
                    <div className="feature-icon">
                      <i className="bi bi-shield-check"></i>
                    </div>
                    <div className="feature-text">
                      <div className="feature-title">Güvenli Altyapı</div>
                      <div className="feature-desc">Kurumsal güvenlik standartları</div>
                    </div>
                  </div>
                  
                  <div className="feature-card">
                    <div className="feature-icon">
                      <i className="bi bi-graph-up-arrow"></i>
                    </div>
                    <div className="feature-text">
                      <div className="feature-title">Analitik Raporlama</div>
                      <div className="feature-desc">Detaylı veri analizi ve raporlar</div>
                    </div>
                  </div>
                  
                  <div className="feature-card">
                    <div className="feature-icon">
                      <i className="bi bi-people"></i>
                    </div>
                    <div className="feature-text">
                      <div className="feature-title">Çoklu Kullanıcı</div>
                      <div className="feature-desc">Departman bazlı yetki yönetimi</div>
                    </div>
                  </div>
                  
                  <div className="feature-card">
                    <div className="feature-icon">
                      <i className="bi bi-clock-history"></i>
                    </div>
                    <div className="feature-text">
                      <div className="feature-title">Gerçek Zamanlı</div>
                      <div className="feature-desc">Anlık takip ve bildirimler</div>
                    </div>
                  </div>
                </div>

                {/* Status Indicators */}
                <div className="status-indicators">
                  <div className="status-item">
                    <div className={`status-dot ${isOnline ? 'online' : 'offline'}`}></div>
                    <span className="status-text">
                      {isOnline ? 'Sistem Çevrimiçi' : 'Bağlantı Sorunu'}
                    </span>
                  </div>
                  <div className="status-item">
                    <div className="status-dot online"></div>
                    <span className="status-text">Sunucu Aktif</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="col-lg-5 d-flex">
            <div className="login-section">
              <div className="login-container-inner">
                {/* Mobile Header */}
                <div className="mobile-header d-lg-none">
                  <div className="mobile-logo">
                    <svg width="120" height="50" viewBox="0 0 120 50" className="mobile-logo-svg">
                      <defs>
                        <linearGradient id="mobileLogo" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#4299e1"/>
                          <stop offset="100%" stopColor="#63b3ed"/>
                        </linearGradient>
                      </defs>
                      <circle cx="25" cy="25" r="18" fill="url(#mobileLogo)"/>
                      <text x="25" y="31" textAnchor="middle" fill="white" fontSize="14" fontWeight="900">A</text>
                      <text x="50" y="30" fill="#2d3748" fontSize="14" fontWeight="700" letterSpacing="1">ASYAPORT</text>
                    </svg>
                  </div>
                  <h2 className="mobile-title">Zimmet Yönetim Sistemi</h2>
                </div>

                {/* Network Status Alert for Mobile */}
                {!isOnline && (
                  <div className="alert alert-warning d-lg-none" role="alert">
                    <i className="bi bi-wifi-off me-2"></i>
                    İnternet bağlantısı yok
                  </div>
                )}

                {/* Login Header */}
                <div className="login-header">
                  <h3 className="login-title">Sistem Girişi</h3>
                  <p className="login-subtitle">
                    Lütfen kimlik bilgilerinizi girerek sisteme giriş yapın
                  </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className={`login-form ${formShake ? 'shake-animation' : ''}`}>
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-exclamation-triangle-fill me-3"></i>
                        <div>
                          <strong>Giriş Hatası</strong>
                          <div className="small">{error}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="form-floating mb-3">
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                      disabled={loading}
                      placeholder="E-posta adresi"
                      autoComplete="email"
                    />
                    <label htmlFor="email">
                      <i className="bi bi-envelope me-2"></i>
                      E-posta Adresi
                    </label>
                  </div>

                  <div className="form-floating mb-4 password-field">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      placeholder="Şifre"
                      autoComplete="current-password"
                    />
                    <label htmlFor="password">
                      <i className="bi bi-lock me-2"></i>
                      Şifre
                    </label>
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                      title={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>

                  <div className="form-options mb-4">
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="rememberMe">
                        Oturumu açık tut
                      </label>
                    </div>
                    <button
                      type="button"
                      className="forgot-password"
                      onClick={handleForgotPassword}
                    >
                      Şifremi Unuttum
                    </button>
                  </div>

                  <button 
                    type="submit" 
                    className={`btn w-100 ${loginSuccess ? 'btn-success' : 'btn-login'}`}
                    disabled={loading || !isOnline}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Giriş yapılıyor...
                      </>
                    ) : loginSuccess ? (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Giriş başarılı!
                      </>
                    ) : !isOnline ? (
                      <>
                        <i className="bi bi-wifi-off me-2"></i>
                        Bağlantı Bekleniyor
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Sisteme Giriş Yap
                      </>
                    )}
                  </button>
                </form>

                {/* Help Section */}
                <div className="help-section">
                  <div className="help-text">
                    Giriş konusunda yardıma mı ihtiyacınız var?
                  </div>
                  <button
                    className="help-link"
                    onClick={handleContactSupport}
                  >
                    <i className="bi bi-headset me-1"></i>
                    BT Destek ile İletişime Geçin
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="login-footer">
                <div className="footer-info">
                  <div className="company-info-small">
                    © 2024 AsyaPort. Tüm hakları saklıdır.
                  </div>
                  <div className="version-info">
                    <i className="bi bi-gear me-1"></i>
                    Sistem Sürümü: v2.1.0
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .login-container {
          min-height: 100vh;
          background: #f8f9fa;
        }

        .brand-section {
          background: linear-gradient(135deg, #1a365d 0%, #2d3748 100%);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4rem 3rem;
          overflow: hidden;
        }

        .brand-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
          opacity: 0.3;
        }

        .brand-content {
          position: relative;
          z-index: 2;
          max-width: 500px;
          text-align: left;
        }

        .company-logo {
          margin-bottom: 3rem;
          display: flex;
          justify-content: flex-start;
        }

        .logo-svg {
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
        }

        .company-title {
          font-size: 3rem;
          font-weight: 300;
          color: white;
          margin-bottom: 0.5rem;
          letter-spacing: 1px;
        }

        .company-tagline {
          font-size: 1.25rem;
          color: #cbd5e0;
          margin-bottom: 1.5rem;
          font-weight: 500;
        }

        .company-description {
          font-size: 1rem;
          color: #a0aec0;
          line-height: 1.6;
          margin-bottom: 3rem;
        }

        .features-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .feature-card {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        .feature-icon {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #63b3ed;
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .feature-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: white;
          margin-bottom: 0.25rem;
        }

        .feature-desc {
          font-size: 0.75rem;
          color: #a0aec0;
          line-height: 1.4;
        }

        .status-indicators {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          margin-top: 2rem;
        }

        .status-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .status-dot.online {
          background: #48bb78;
          box-shadow: 0 0 8px rgba(72, 187, 120, 0.5);
        }

        .status-dot.offline {
          background: #f56565;
          box-shadow: 0 0 8px rgba(245, 101, 101, 0.5);
        }

        .status-text {
          font-size: 0.75rem;
          color: #cbd5e0;
        }

        .login-section {
          background: white;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 100vh;
          padding: 2rem;
        }

        .login-container-inner {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          max-width: 400px;
          margin: 0 auto;
          width: 100%;
        }

        .mobile-header {
          text-align: center;
          margin-bottom: 3rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .mobile-logo {
          margin-bottom: 1rem;
          display: flex;
          justify-content: center;
        }

        .mobile-logo-svg {
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        }

        .mobile-title {
          font-size: 1.25rem;
          color: #4a5568;
          font-weight: 500;
          margin: 0;
        }

        .login-header {
          margin-bottom: 2rem;
          text-align: center;
        }

        .login-title {
          font-size: 1.875rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .login-subtitle {
          color: #718096;
          font-size: 0.875rem;
          margin: 0;
          line-height: 1.5;
        }

        .form-floating {
          position: relative;
        }

        .form-control {
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 1rem 0.75rem;
          font-size: 1rem;
          transition: all 0.2s ease;
          background: #fafafa;
        }

        .form-control:focus {
          border-color: #4299e1;
          box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
          background: white;
        }

        .form-control:valid {
          border-color: #48bb78;
        }

        .form-floating label {
          color: #718096;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .password-field {
          position: relative;
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #718096;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 4px;
          transition: all 0.2s ease;
          z-index: 10;
        }

        .password-toggle:hover {
          color: #4a5568;
          background: rgba(0, 0, 0, 0.05);
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .form-check-label {
          font-size: 0.875rem;
          color: #4a5568;
          cursor: pointer;
        }

        .form-check-input:checked {
          background-color: #4299e1;
          border-color: #4299e1;
        }

        .forgot-password {
          font-size: 0.875rem;
          color: #4299e1;
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 500;
          padding: 0;
          transition: color 0.2s ease;
        }

        .forgot-password:hover {
          color: #3182ce;
          text-decoration: underline;
        }

        .btn-login {
          background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
          border: none;
          border-radius: 12px;
          padding: 0.875rem 1.5rem;
          font-size: 1rem;
          font-weight: 600;
          color: white;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .btn-success {
          background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
          border: none;
          border-radius: 12px;
          padding: 0.875rem 1.5rem;
          font-size: 1rem;
          font-weight: 600;
          color: white;
        }

        .btn-login::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .btn-login:hover:not(:disabled)::before {
          left: 100%;
        }

        .btn-login:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(66, 153, 225, 0.4);
        }

        .btn-login:active:not(:disabled) {
          transform: translateY(0);
        }

        .btn-login:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .alert {
          border: none;
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1.5rem;
          animation: slideIn 0.3s ease;
        }

        .alert-danger {
          background: #fed7d7;
          border-left: 4px solid #f56565;
          color: #742a2a;
        }

        .alert-warning {
          background: #fef5e7;
          border-left: 4px solid #ed8936;
          color: #744210;
        }

        .help-section {
          text-align: center;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e2e8f0;
        }

        .help-text {
          font-size: 0.875rem;
          color: #718096;
          margin-bottom: 0.5rem;
        }

        .help-link {
          font-size: 0.875rem;
          color: #4299e1;
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 600;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .help-link:hover {
          color: #3182ce;
          background: rgba(66, 153, 225, 0.1);
        }

        .login-footer {
          margin-top: auto;
          padding-top: 1rem;
        }

        .footer-info {
          text-align: center;
          font-size: 0.75rem;
          color: #a0aec0;
          line-height: 1.5;
        }

        .company-info-small {
          margin-bottom: 0.25rem;
        }

        .version-info {
          font-weight: 500;
        }

        /* Animations */
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .shake-animation {
          animation: shake 0.5s ease-in-out;
        }

        /* Responsive Design */
        @media (max-width: 991.98px) {
          .login-section {
            padding: 1.5rem;
          }
          
          .company-title {
            font-size: 2.5rem;
          }
          
          .features-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 575.98px) {
          .login-section {
            padding: 1rem;
          }
          
          .login-title {
            font-size: 1.5rem;
          }
          
          .brand-section {
            padding: 2rem 1.5rem;
          }
          
          .company-title {
            font-size: 2rem;
          }
        }

        /* Loading states */
        .spinner-border-sm {
          width: 1rem;
          height: 1rem;
        }

        /* Focus improvements for accessibility */
        .form-control:focus,
        .btn:focus,
        .form-check-input:focus {
          outline: 2px solid #4299e1;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
};

export default Login;