import React, { useState } from 'react';
import { loginUser } from '../api/supabaseAuth'; // Yol güncellendi
import { useNavigate } from 'react-router-dom';

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
    <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="card shadow-sm p-4" style={{ minWidth: 350, maxWidth: 400, width: '100%' }}>
        <h3 className="mb-4 text-center">Giriş Yap</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
              disabled={loading}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Şifre</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          {error && (
            <div className="alert alert-danger py-2 mb-3" role="alert">
              <small>{error}</small>
            </div>
          )}
          <button 
            type="submit" 
            className="btn btn-primary w-100" 
            disabled={loading}
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
        
        {/* Debug bilgileri (geliştirme aşamasında) */}
        <div className="mt-3">
          <small className="text-muted">
            API URL: {import.meta.env.VITE_API_BASE_URL || 'https://localhost:7190'}
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;
