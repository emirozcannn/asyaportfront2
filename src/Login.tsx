
import React, { useState } from 'react';
import { loginUser } from './api/supabaseAuth';
import { useNavigate } from 'react-router-dom';
import logo from './assets/logo.png';

const Login: React.FC = () => {
  const [email, setEmail] = useState('bt.mudur@asyaport.com');
  const [password, setPassword] = useState('alper1emir');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log('Attempting login with:', { email, password: '***' });
      
      const result = await loginUser(email, password);
      console.log('Login successful:', result);
      
      // Giriş başarılıysa dashboard'a yönlendir
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Daha detaylı hata mesajı
      let errorMessage = 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.';
      
      // Hata mesajını doğrudan backend'den almak için err.message'i kullan
      if (err.message) {
        errorMessage = err.message;
      } else if (err.message.includes('500')) {
        errorMessage = 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
      } else if (err.message.includes('401')) {
        errorMessage = 'Email veya şifre hatalı.';
      } else if (err.message.includes('Network')) {
        errorMessage = 'Bağlantı hatası. İnternet bağlantınızı kontrol edin.';
      } 
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg d-flex align-items-center justify-content-center">
      <div className="login-card p-4 shadow-lg animate__animated animate__fadeIn">
        <div className="text-center mb-4">
          <img src={logo} alt="Asyaport Logo" style={{ width: 80, marginBottom: 8, borderRadius: 12 }} />
          <h1 className="zimmet-title mb-1">Zimmet</h1>
          <div className="text-muted mb-2" style={{ fontSize: 15 }}>Yönetim Paneli Girişi</div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control modern-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
              disabled={loading}
              placeholder="E-posta adresi"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Şifre</label>
            <input
              type="password"
              className="form-control modern-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="Şifre"
            />
          </div>
          {error && (
            <div className="alert alert-danger py-2 mb-3" role="alert">
              <small>{error}</small>
            </div>
          )}
          <button 
            type="submit" 
            className="btn btn-primary w-100 py-2 fw-semibold rounded-pill" 
            disabled={loading}
            style={{ fontSize: 17, letterSpacing: 0.5 }}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Yükleniyor...</span>
                </span>
                Giriş yapılıyor...
              </>
            ) : (
              'Giriş Yap'
            )}
          </button>
        </form>
        {/* API URL kaldırıldı */}
      </div>
    </div>
  );
};

export default Login;
