import React, { useState, useEffect } from 'react';

const Login = () => {
  const [email, setEmail] = useState('bt.mudur@asyaport.com');
  const [password, setPassword] = useState('alper1emir');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [formShake, setFormShake] = useState(false);

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

  // Auto-fill from remembered email (React state version)
  useEffect(() => {
    // Claude.ai artifact'da localStorage simülasyonu
    // Gerçek projede localStorage kullanılabilir
    const savedEmail = 'bt.mudur@asyaport.com';
    const savedRemember = true;
    
    if (savedEmail && savedRemember) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setLoginSuccess(false);
    setFormShake(false);
    
    // Check network connectivity
    if (!isOnline) {
      setError('İnternet bağlantınızı kontrol edin.');
      setLoading(false);
      setFormShake(true);
      setTimeout(() => setFormShake(false), 500);
      return;
    }
    
    try {
      console.log('Attempting login with:', { email, password: '***' });
      
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (email === 'bt.mudur@asyaport.com' && password === 'alper1emir') {
            resolve({
              token: 'mock-token-123',
              user: {
                id: 1,
                email: email,
                firstName: 'Test',
                lastName: 'User',
                role: 'admin',
                departmentId: 1,
                employeeNumber: '001',
                isActive: true
              }
            });
          } else {
            reject(new Error('Invalid credentials'));
          }
        }, 2000);
      });
      
      console.log('Login successful');
      
      // Handle remember me (gerçek projede localStorage kullanın)
      if (rememberMe) {
        console.log('Remembering user email');
      }
      
      // Store auth info (gerçek projede localStorage kullanın)
      console.log('Storing user info');
      
      // Set success state
      setLoginSuccess(true);
      
      // Navigate to dashboard after a brief delay
      setTimeout(() => {
        console.log('Redirecting to dashboard...');
        // Gerçek projede: navigate('/dashboard');
        window.location.href = '/dashboard';
      }, 1500);
      
    } catch (err) {
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
      
      // Shake animation
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
                  {/* Enhanced SVG Logo with Yellow/Black theme */}
                  <svg width="220" height="90" viewBox="0 0 220 90" className="logo-svg">
                    <defs>
                      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ffffff"/>
                        <stop offset="30%" stopColor="#fbbf24"/>
                        <stop offset="70%" stopColor="#f59e0b"/>
                        <stop offset="100%" stopColor="#d97706"/>
                      </linearGradient>
                      <linearGradient id="logoGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3"/>
                        <stop offset="100%" stopColor="#d97706" stopOpacity="0.1"/>
                      </linearGradient>
                    </defs>
                    
                    {/* Glow effect */}
                    <circle cx="45" cy="45" r="38" fill="url(#logoGlow)" />
                    
                    {/* Main circle */}
                    <circle cx="45" cy="45" r="32" fill="url(#logoGradient)" stroke="rgba(251,191,36,0.5)" strokeWidth="2"/>
                    
                    {/* Inner decoration */}
                    <circle cx="45" cy="45" r="25" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>
                    
                    {/* Letter A */}
                    <text x="45" y="55" textAnchor="middle" fill="black" fontSize="24" fontWeight="900" fontFamily="Arial">A</text>
                    
                    {/* Company name */}
                    <text x="95" y="40" fill="#fbbf24" fontSize="20" fontWeight="700" letterSpacing="2" fontFamily="Arial">ASYAPORT</text>
                    
                    {/* Subtitle */}
                    <text x="95" y="60" fill="rgba(251,191,36,0.8)" fontSize="12" fontWeight="500" letterSpacing="1" fontFamily="Arial">ZİMMET SİSTEMİ</text>
                    
                    {/* Decorative line */}
                    <line x1="95" y1="48" x2="200" y2="48" stroke="rgba(251,191,36,0.3)" strokeWidth="1"/>
                  </svg>
                </div>
                
                <div className="company-info">
                  <h1 className="company-title">AsyaPort</h1>
                  <div className="company-tagline">Zimmet Yönetim Sistemi</div>
                  <div className="company-description">
                    Kurumsal varlık yönetimi ve zimmet takibi için gelişmiş çözümler.
                    Güvenilir, ölçeklenebilir ve profesyonel platform ile iş süreçlerinizi optimize edin.
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
                  <div className="status-header">
                    <i className="bi bi-activity me-2"></i>
                    <span>Sistem Durumu</span>
                  </div>
                  <div className="status-grid">
                    <div className="status-item">
                      <div className={`status-dot ${isOnline ? 'online' : 'offline'}`}></div>
                      <i className="bi bi-wifi me-1"></i>
                      <span className="status-text">
                        {isOnline ? 'Sistem Çevrimiçi' : 'Bağlantı Sorunu'}
                      </span>
                    </div>
                    <div className="status-item">
                      <div className="status-dot online"></div>
                      <i className="bi bi-database me-1"></i>
                      <span className="status-text">Sunucu Aktif</span>
                    </div>
                    <div className="status-item">
                      <div className="status-dot online"></div>
                      <i className="bi bi-lock me-1"></i>
                      <span className="status-text">SSL Güvenli</span>
                    </div>
                  </div>
                  <div className="version-badge">
                    v2.1.0 • Build 2024.12
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
                    <svg width="140" height="60" viewBox="0 0 140 60" className="mobile-logo-svg">
                      <defs>
                        <linearGradient id="mobileLogo" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#fbbf24"/>
                          <stop offset="100%" stopColor="#d97706"/>
                        </linearGradient>
                      </defs>
                      <circle cx="30" cy="30" r="22" fill="url(#mobileLogo)"/>
                      <text x="30" y="37" textAnchor="middle" fill="black" fontSize="16" fontWeight="900">AP</text>
                      <text x="60" y="35" fill="#1f2937" fontSize="16" fontWeight="700" letterSpacing="0.9">ASYAPORT</text>
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
                  <div className="login-icon">
                    <i className="bi bi-box-arrow-in-right"></i>
                  </div>
                  <h3 className="login-title">Sistem Girişi</h3>
                  <div className="title-divider"></div>
                  <p className="login-subtitle">
                    Lütfen kimlik bilgilerinizi girerek sisteme giriş yapın
                  </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className={`login-form ${formShake ? 'shake-animation' : ''}`}>
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      <div className="d-flex align-items-center">
                        <div className="alert-icon">
                          <i className="bi bi-exclamation-triangle-fill"></i>
                        </div>
                        <div className="alert-content">
                          <strong>Giriş Hatası</strong>
                          <div className="alert-message">{error}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {loginSuccess && (
                    <div className="alert alert-success" role="alert">
                      <div className="d-flex align-items-center">
                        <div className="alert-icon success">
                          <i className="bi bi-check-circle-fill"></i>
                        </div>
                        <div className="alert-content">
                          <strong>Giriş Başarılı!</strong>
                          <div className="alert-message">Yönlendiriliyorsunuz...</div>
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
                        <i className="bi bi-chevron-right ms-2"></i>
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
                    <i className="bi bi-headset me-2"></i>
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
          background: #000000;
        }

        .brand-section {
          background: linear-gradient(135deg, #000000 0%, #1f1f1f 50%, #000000 100%);
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
          background-image: 
            linear-gradient(45deg, rgba(251,191,36,0.05) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(251,191,36,0.05) 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, rgba(251,191,36,0.05) 75%),
            linear-gradient(-45deg, transparent 75%, rgba(251,191,36,0.05) 75%);
          background-size: 50px 50px;
          background-position: 0 0, 0 25px, 25px -25px, -25px 0px;
          animation: gridMove 20s linear infinite;
          opacity: 0.3;
        }

        .brand-section::after {
          content: '';
          position: absolute;
          top: 20px;
          left: 20px;
          right: 20px;
          bottom: 20px;
          border: 2px solid rgba(251,191,36,0.1);
          border-radius: 20px;
          pointer-events: none;
        }

        .brand-content {
          position: relative;
          z-index: 2;
          max-width: 520px;
          text-align: left;
        }

        .company-logo {
          margin-bottom: 3rem;
          display: flex;
          justify-content: flex-start;
        }

        .logo-svg {
          filter: drop-shadow(0 8px 16px rgba(251,191,36,0.3));
          transition: transform 0.3s ease;
        }

        .logo-svg:hover {
          transform: scale(1.05) rotate(2deg);
        }

        .company-title {
          font-size: 3.5rem;
          font-weight: 300;
          margin-bottom: 0.5rem;
          letter-spacing: 2px;
          text-shadow: 0 0 30px rgba(251,191,36,0.5);
          background: linear-gradient(135deg, #ffffff, #fbbf24, #f59e0b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .company-tagline {
          font-size: 1.4rem;
          color: rgba(251,191,36,0.9);
          margin-bottom: 1.5rem;
          font-weight: 600;
          position: relative;
          padding-left: 20px;
        }

        .company-tagline::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 20px;
          background: linear-gradient(to bottom, #fbbf24, #f59e0b);
          border-radius: 2px;
        }

        .company-description {
          font-size: 1.1rem;
          color: rgba(255,255,255,0.8);
          line-height: 1.7;
          margin-bottom: 3rem;
          padding: 20px;
          background: rgba(251,191,36,0.05);
          border-radius: 12px;
          border-left: 4px solid #fbbf24;
        }

        .features-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .feature-card {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.5rem;
          background: rgba(0,0,0,0.4);
          border: 1px solid rgba(251,191,36,0.2);
          border-radius: 16px;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(251,191,36,0.1), transparent);
          transition: left 0.6s ease;
        }

        .feature-card:hover::before {
          left: 100%;
        }

        .feature-card:hover {
          background: rgba(251,191,36,0.1);
          transform: translateY(-8px) scale(1.02);
          border-color: rgba(251,191,36,0.4);
          box-shadow: 0 15px 35px rgba(251,191,36,0.2);
        }

        .feature-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: black;
          flex-shrink: 0;
          box-shadow: 0 8px 16px rgba(251,191,36,0.3);
          transition: transform 0.3s ease;
          font-size: 1.25rem;
        }

        .feature-card:hover .feature-icon {
          transform: rotate(10deg) scale(1.1);
        }

        .feature-title {
          font-size: 1rem;
          font-weight: 700;
          color: #fbbf24;
          margin-bottom: 0.5rem;
        }

        .feature-desc {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.7);
          line-height: 1.5;
        }

        .status-indicators {
          background: rgba(0,0,0,0.6);
          border: 1px solid rgba(251,191,36,0.3);
          border-radius: 16px;
          padding: 1.5rem;
          margin-top: 2rem;
        }

        .status-header {
          display: flex;
          align-items: center;
          color: #fbbf24;
          font-weight: 600;
          margin-bottom: 1rem;
          font-size: 0.95rem;
        }

        .status-grid {
          display: grid;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .status-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .status-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
          position: relative;
        }

        .status-dot.online {
          background: #10b981;
          box-shadow: 0 0 12px rgba(16, 185, 129, 0.5);
        }

        .status-dot.online::after {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: #10b981;
          border-radius: 50%;
          opacity: 0.3;
          animation: pulse 2s infinite;
        }

        .status-dot.offline {
          background: #ef4444;
          box-shadow: 0 0 12px rgba(239, 68, 68, 0.5);
        }

        .status-text {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.8);
          font-weight: 500;
        }

        .version-badge {
          text-align: center;
          font-size: 0.75rem;
          color: rgba(251,191,36,0.8);
          font-weight: 500;
          padding: 0.5rem;
          background: rgba(251,191,36,0.1);
          border-radius: 8px;
          border: 1px solid rgba(251,191,36,0.2);
        }

        .login-section {
          background: linear-gradient(135deg, #1f1f1f 0%, #000000 50%, #1a1a1a 100%);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 100vh;
          padding: 2rem;
          position: relative;
        }

        .login-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            radial-gradient(circle at 20% 80%, rgba(255,255,255,0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(251,191,36,0.05) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(255,255,255,0.02) 0%, transparent 30%);
          pointer-events: none;
        }

        .login-container-inner {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          max-width: 440px;
          margin: 0 auto;
          width: 100%;
          position: relative;
          z-index: 1;
        }

        .mobile-header {
          text-align: center;
          margin-bottom: 3rem;
          padding-bottom: 2rem;
          border-bottom: 2px solid rgba(251,191,36,0.2);
          position: relative;
        }

        .mobile-header::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 4px;
          background: linear-gradient(to right, #fbbf24, #f59e0b);
          border-radius: 2px;
        }

        .mobile-logo {
          margin-bottom: 1rem;
          display: flex;
          justify-content: center;
        }

        .mobile-logo-svg {
          filter: drop-shadow(0 4px 12px rgba(251,191,36,0.3));
        }

        .mobile-title {
          font-size: 1.4rem;
          color: #fbbf24;
          font-weight: 600;
          margin: 0;
        }

        .login-header {
          margin-bottom: 2.5rem;
          text-align: center;
          position: relative;
        }

        .login-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #ffffff, #fbbf24, #f59e0b);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          color: black;
          box-shadow: 0 8px 24px rgba(251,191,36,0.3), 0 0 0 2px rgba(255,255,255,0.1);
          position: relative;
          font-size: 1.5rem;
        }

        .login-icon::after {
          content: '';
          position: absolute;
          top: -5px;
          left: -5px;
          right: -5px;
          bottom: -5px;
          background: linear-gradient(135deg, rgba(255,255,255,0.3), #fbbf24, #f59e0b);
          border-radius: 50%;
          opacity: 0.3;
          z-index: -1;
          animation: pulse 3s infinite;
        }

        .login-title {
          font-size: 2.2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          text-shadow: 0 0 20px rgba(251,191,36,0.5);
          background: linear-gradient(135deg, #ffffff, #fbbf24, #f59e0b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .title-divider {
          width: 80px;
          height: 3px;
          background: linear-gradient(to right, rgba(255,255,255,0.3), #fbbf24, #f59e0b, rgba(255,255,255,0.3));
          margin: 1rem auto;
          border-radius: 2px;
        }

        .login-subtitle {
          color: rgba(255,255,255,0.8);
          font-size: 1rem;
          margin: 0;
          line-height: 1.6;
        }

        .form-floating {
          position: relative;
          margin-bottom: 1rem;
        }

        .form-control {
          border: 2px solid rgba(251,191,36,0.3);
          border-radius: 16px;
          padding: 1.2rem 1rem;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: rgba(0,0,0,0.6);
          color: white;
          backdrop-filter: blur(10px);
        }

        .form-control::placeholder {
          color: rgba(255,255,255,0.5);
        }

        .form-control:focus {
          border-color: #fbbf24;
          box-shadow: 0 0 0 4px rgba(251,191,36,0.2), 0 0 20px rgba(251,191,36,0.3);
          background: rgba(0,0,0,0.8);
          transform: translateY(-2px);
          outline: none;
        }

        .form-control:valid {
          border-color: #10b981;
        }

        .form-floating label {
          color: rgba(251,191,36,0.9);
          font-size: 0.9rem;
          font-weight: 600;
          display: flex;
          align-items: center;
        }

        .form-floating .form-control:focus ~ label,
        .form-floating .form-control:not(:placeholder-shown) ~ label {
          color: #fbbf24;
          transform: scale(0.85) translateY(-0.5rem) translateX(0.15rem);
        }

        .password-field {
          position: relative;
        }

        .password-toggle {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(251,191,36,0.1);
          border: 1px solid rgba(251,191,36,0.3);
          color: #fbbf24;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.3s ease;
          z-index: 10;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .password-toggle:hover {
          background: rgba(251,191,36,0.2);
          border-color: #fbbf24;
          transform: translateY(-50%) scale(1.1);
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .form-check {
          display: flex;
          align-items: center;
        }

        .form-check-input {
          appearance: none;
          width: 20px;
          height: 20px;
          border: 2px solid rgba(251,191,36,0.5);
          border-radius: 4px;
          background: transparent;
          margin-right: 8px;
          position: relative;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .form-check-input:checked {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          border-color: #fbbf24;
        }

        .form-check-input:checked::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: black;
          font-weight: bold;
          font-size: 12px;
        }

        .form-check-label {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.8);
          cursor: pointer;
          font-weight: 500;
        }

        .form-check-label:hover {
          color: white;
        }

        .forgot-password {
          font-size: 0.9rem;
          color: #fbbf24;
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 8px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .forgot-password::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: #fbbf24;
          transition: width 0.3s ease;
        }

        .forgot-password:hover {
          color: #f59e0b;
          background: rgba(251,191,36,0.1);
        }

        .forgot-password:hover::before {
          width: 100%;
        }

        .btn-login {
          background: linear-gradient(135deg, #ffffff 0%, #fbbf24 30%, #f59e0b 70%, #d97706 100%);
          border: none;
          border-radius: 16px;
          padding: 1rem 2rem;
          font-size: 1.1rem;
          font-weight: 700;
          color: black;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
          box-shadow: 0 8px 25px rgba(251,191,36,0.3), 0 0 0 1px rgba(255,255,255,0.2);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .btn-success {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border: none;
          border-radius: 16px;
          padding: 1rem 2rem;
          font-size: 1.1rem;
          font-weight: 700;
          color: white;
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .btn-login::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          transition: left 0.6s ease;
        }

        .btn-login:hover:not(:disabled)::before {
          left: 100%;
        }

        .btn-login:hover:not(:disabled) {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 15px 35px rgba(251,191,36,0.4), 0 0 0 1px rgba(255,255,255,0.4);
          background: linear-gradient(135deg, #f8fafc 0%, #f59e0b 30%, #d97706 70%, #b45309 100%);
        }

        .btn-login:active:not(:disabled) {
          transform: translateY(-1px) scale(1.01);
        }

        .btn-login:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          background: #6b7280;
        }

        .alert {
          border: none;
          border-radius: 16px;
          padding: 1.2rem;
          margin-bottom: 1.5rem;
          animation: slideIn 0.4s ease;
          backdrop-filter: blur(10px);
          border-left: 4px solid;
        }

        .alert-danger {
          background: rgba(239, 68, 68, 0.15);
          border-left-color: #ef4444;
          color: #fca5a5;
        }

        .alert-success {
          background: rgba(16, 185, 129, 0.15);
          border-left-color: #10b981;
          color: #6ee7b7;
        }

        .alert-warning {
          background: rgba(251, 191, 36, 0.15);
          border-left-color: #fbbf24;
          color: #fcd34d;
        }

        .alert-icon {
          width: 40px;
          height: 40px;
          background: rgba(239, 68, 68, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1rem;
          flex-shrink: 0;
          font-size: 1.25rem;
        }

        .alert-icon.success {
          background: rgba(16, 185, 129, 0.2);
        }

        .alert-content {
          flex: 1;
        }

        .alert-content strong {
          display: block;
          margin-bottom: 0.25rem;
          font-weight: 700;
        }

        .alert-message {
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .help-section {
          text-align: center;
          margin-top: 2.5rem;
          padding-top: 2rem;
          border-top: 2px solid rgba(251,191,36,0.2);
          position: relative;
        }

        .help-section::before {
          content: '';
          position: absolute;
          top: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 4px;
          background: linear-gradient(to right, #fbbf24, #f59e0b);
          border-radius: 2px;
        }

        .help-text {
          font-size: 0.95rem;
          color: rgba(255,255,255,0.7);
          margin-bottom: 1rem;
        }

        .help-link {
          font-size: 0.95rem;
          color: #fbbf24;
          background: rgba(251,191,36,0.1);
          border: 2px solid rgba(251,191,36,0.3);
          cursor: pointer;
          font-weight: 600;
          padding: 12px 24px;
          border-radius: 12px;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .help-link:hover {
          color: black;
          background: #fbbf24;
          border-color: #fbbf24;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(251,191,36,0.3);
        }

        .login-footer {
          margin-top: auto;
          padding-top: 2rem;
          position: relative;
          z-index: 1;
        }

        .footer-info {
          text-align: center;
          padding: 1.5rem;
          background: rgba(0,0,0,0.4);
          border-radius: 16px;
          border: 1px solid rgba(251,191,36,0.2);
          backdrop-filter: blur(10px);
        }

        .company-info-small {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.6);
          margin-bottom: 0.5rem;
        }

        .version-info {
          font-size: 0.8rem;
          color: #fbbf24;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }

        /* Enhanced Animations */
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
          20%, 40%, 60%, 80% { transform: translateX(8px); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }

        @keyframes gridMove {
          from { transform: translateX(0) translateY(0); }
          to { transform: translateX(50px) translateY(50px); }
        }

        .shake-animation {
          animation: shake 0.6s ease-in-out;
        }

        /* Responsive Design */
        @media (max-width: 991.98px) {
          .login-section {
            padding: 1.5rem;
          }
          
          .company-title {
            font-size: 3rem;
          }
          
          .features-grid {
            grid-template-columns: 1fr;
          }

          .brand-section {
            padding: 3rem 2rem;
          }
        }

        @media (max-width: 575.98px) {
          .login-section {
            padding: 1rem;
          }
          
          .login-title {
            font-size: 1.8rem;
          }
          
          .brand-section {
            padding: 2rem 1.5rem;
          }
          
          .company-title {
            font-size: 2.5rem;
          }

          .form-control {
            padding: 1rem 0.8rem;
          }

          .btn-login {
            padding: 1rem 1.5rem;
            font-size: 1rem;
          }

          .features-grid {
            gap: 1.5rem;
          }

          .feature-card {
            padding: 1.2rem;
          }
        }

        /* Loading states */
        .spinner-border-sm {
          width: 1.2rem;
          height: 1.2rem;
          border-width: 2px;
        }

        /* Focus improvements for accessibility */
        .form-control:focus,
        .btn:focus,
        .form-check-input:focus,
        .password-toggle:focus,
        .help-link:focus,
        .forgot-password:focus {
          outline: 3px solid rgba(251,191,36,0.5);
          outline-offset: 2px;
        }

        /* Custom scrollbar for better UX */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(251,191,36,0.6);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(251,191,36,0.8);
        }
      `}</style>
    </div>
  );
};

export default Login;