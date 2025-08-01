import React from 'react';

interface ComingSoonProps {
  title?: string;
  description?: string;
  features?: string[];
  module?: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ 
  title = "Bu Sayfa Yakında Gelecek",
  description = "Bu özellik üzerinde çalışıyoruz ve yakında kullanıma sunulacak.",
  features = [],
  module = "Genel"
}) => {
  
  const getModuleIcon = (module: string): string => {
    const moduleIcons: { [key: string]: string } = {
      'Dashboard': '📊',
      'Kullanıcı': '👥',
      'Departman': '🏢',
      'Zimmet': '📦',
      'Talep': '📋',
      'İade': '🔄',
      'Rapor': '📈',
      'Bakım': '🔧',
      'Lokasyon': '📍',
      'Sistem': '⚙️',
      'Güvenlik': '🔒',
      'Entegrasyon': '📱',
      'İK': '👤',
      'Mali': '💰',
      'Destek': '❓',
      'Genel': '🚀'
    };
    return moduleIcons[module] || '🚀';
  };

  return (
    <div className="coming-soon-container d-flex flex-column justify-content-center align-items-center p-4" style={{ minHeight: '100vh' }}>
      <div className="text-center">
        {/* Module Icon */}
        <div className="mb-4">
          <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" 
               style={{ width: '120px', height: '120px' }}>
            <span style={{ fontSize: '3rem' }}>{getModuleIcon(module)}</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="display-6 fw-bold text-dark mb-3">{title}</h1>
        
        {/* Module Badge */}
        <div className="mb-3">
          <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">
            {module} Modülü
          </span>
        </div>
        
        {/* Description */}
        <p className="lead text-muted mb-4 mx-auto" style={{ maxWidth: '600px' }}>
          {description}
        </p>

        {/* Features List */}
        {features.length > 0 && (
          <div className="mb-4">
            <h5 className="text-dark mb-3">📋 Planlanan Özellikler:</h5>
            <div className="row justify-content-center">
              <div className="col-md-8">
                <div className="bg-light rounded-3 p-4">
                  <ul className="list-unstyled mb-0">
                    {features.map((feature, index) => (
                      <li key={index} className="mb-2 text-muted d-flex align-items-center">
                        <span className="text-success me-2">✅</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="mb-4">
          <div className="d-flex align-items-center justify-content-center mb-3">
            <span className="text-muted me-3">Geliştirme Durumu:</span>
            <span className="badge bg-warning text-dark px-3 py-2">
              🚧 Geliştiriliyor
            </span>
          </div>
          <div className="progress mx-auto" style={{ maxWidth: '400px', height: '10px' }}>
            <div 
              className="progress-bar bg-primary progress-bar-striped progress-bar-animated" 
              role="progressbar" 
              style={{ width: '45%' }}
              aria-valuenow={45} 
              aria-valuemin={0} 
              aria-valuemax={100}
            ></div>
          </div>
          <small className="text-muted mt-2 d-block">%45 tamamlandı</small>
        </div>

        {/* Info Cards */}
        <div className="row justify-content-center mb-4">
          <div className="col-md-4 mb-3">
            <div className="card border-0 bg-light h-100">
              <div className="card-body text-center">
                <div className="mb-2">📅</div>
                <h6 className="card-title">Tahmini Tamamlanma</h6>
                <p className="card-text text-muted small">Q2 2024</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card border-0 bg-light h-100">
              <div className="card-body text-center">
                <div className="mb-2">👥</div>
                <h6 className="card-title">Geliştirici Ekibi</h6>
                <p className="card-text text-muted small">AsyaPort Yazılım Ekibi</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card border-0 bg-light h-100">
              <div className="card-body text-center">
                <div className="mb-2">🔔</div>
                <h6 className="card-title">Bildirimler</h6>
                <p className="card-text text-muted small">Hazır olunca haber vereceğiz</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-light rounded-3 p-4">
          <h6 className="text-dark mb-3">📞 İletişim</h6>
          <div className="row text-center">
            <div className="col-md-6 mb-2">
              <small className="text-muted">
                📧 <a href="mailto:support@asyaport.com" className="text-decoration-none">support@asyaport.com</a>
              </small>
            </div>
            <div className="col-md-6 mb-2">
              <small className="text-muted">
                🕐 Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
              </small>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-4">
          <button 
            className="btn btn-outline-primary"
            onClick={() => window.history.back()}
          >
            ← Geri Dön
          </button>
        </div>
      </div>

      <style>{`
        .coming-soon-container {
          background: linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%);
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }
        
        .coming-soon-container::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(102, 126, 234, 0.05) 0%, transparent 70%);
          animation: float 20s ease-in-out infinite;
          pointer-events: none;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .progress-bar {
          transition: width 2s ease-in-out;
        }
        
        .card {
          transition: transform 0.2s ease-in-out;
        }
        
        .card:hover {
          transform: translateY(-5px);
        }
        
        @media (max-width: 768px) {
          .display-6 {
            font-size: 2rem;
          }
          
          .coming-soon-container {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ComingSoon;
