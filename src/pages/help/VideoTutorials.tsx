// src/pages/help/VideoTutorials.tsx
import React, { useState } from 'react';

interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Başlangıç' | 'Orta' | 'İleri';
  category: string;
  thumbnail: string;
  videoUrl: string;
  views: number;
  rating: number;
  uploadDate: string;
  tags: string[];
  completed?: boolean;
  watched?: boolean;
}

interface VideoCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  videoCount: number;
}

interface UserProgress {
  totalVideos: number;
  completedVideos: number;
  watchTime: string;
  lastWatched: string;
}

const VideoTutorials: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedVideo, setSelectedVideo] = useState<VideoTutorial | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [showOnlyUnwatched, setShowOnlyUnwatched] = useState<boolean>(false);

  // Video kategorileri
  const categories: VideoCategory[] = [
    {
      id: 'getting-started',
      name: 'Başlangıç',
      description: 'Sistem tanıtımı ve temel kullanım',
      icon: 'bi-play-circle',
      color: 'success',
      videoCount: 8
    },
    {
      id: 'asset-management',
      name: 'Zimmet Yönetimi',
      description: 'Zimmet işlemleri ve takip',
      icon: 'bi-box-seam',
      color: 'primary',
      videoCount: 12
    },
    {
      id: 'user-management',
      name: 'Kullanıcı Yönetimi',
      description: 'Kullanıcı ve rol işlemleri',
      icon: 'bi-people',
      color: 'info',
      videoCount: 6
    },
    {
      id: 'reporting',
      name: 'Raporlama',
      description: 'Rapor oluşturma ve analiz',
      icon: 'bi-graph-up',
      color: 'warning',
      videoCount: 9
    },
    {
      id: 'mobile',
      name: 'Mobil Kullanım',
      description: 'Mobil uygulama kullanımı',
      icon: 'bi-phone',
      color: 'secondary',
      videoCount: 5
    },
    {
      id: 'advanced',
      name: 'İleri Seviye',
      description: 'Gelişmiş özellikler ve entegrasyonlar',
      icon: 'bi-gear',
      color: 'danger',
      videoCount: 4
    }
  ];

  // Video eğitimleri
  const videoTutorials: VideoTutorial[] = [
    {
      id: '1',
      title: 'Asyaport Zimmet Sistemine Giriş',
      description: 'Sistem tanıtımı, ilk giriş ve temel navigasyon hakkında kapsamlı rehber',
      duration: '12:45',
      difficulty: 'Başlangıç',
      category: 'getting-started',
      thumbnail: 'https://via.placeholder.com/320x180/2c5aa0/ffffff?text=Video+1',
      videoUrl: '#',
      views: 1247,
      rating: 4.8,
      uploadDate: '2024-01-15',
      tags: ['Giriş', 'Temel', 'Navigasyon'],
      completed: true,
      watched: true
    },
    {
      id: '2',
      title: 'Kullanıcı Profili ve Ayarlar',
      description: 'Profil bilgilerini güncelleme, şifre değiştirme ve kişisel ayarlar',
      duration: '8:30',
      difficulty: 'Başlangıç',
      category: 'getting-started',
      thumbnail: 'https://via.placeholder.com/320x180/28a745/ffffff?text=Video+2',
      videoUrl: '#',
      views: 892,
      rating: 4.6,
      uploadDate: '2024-01-18',
      tags: ['Profil', 'Ayarlar', 'Güvenlik'],
      completed: true,
      watched: true
    },
    {
      id: '3',
      title: 'Yeni Zimmet Ekleme',
      description: 'Sisteme yeni varlık ekleme, kategori seçimi ve detay bilgileri girme',
      duration: '15:20',
      difficulty: 'Orta',
      category: 'asset-management',
      thumbnail: 'https://via.placeholder.com/320x180/007bff/ffffff?text=Video+3',
      videoUrl: '#',
      views: 1456,
      rating: 4.9,
      uploadDate: '2024-01-22',
      tags: ['Zimmet', 'Ekleme', 'Kategori'],
      completed: false,
      watched: true
    },
    {
      id: '4',
      title: 'Zimmet Atama ve Transfer',
      description: 'Çalışanlara zimmet atama, transfer işlemleri ve onay süreçleri',
      duration: '18:15',
      difficulty: 'Orta',
      category: 'asset-management',
      thumbnail: 'https://via.placeholder.com/320x180/6f42c1/ffffff?text=Video+4',
      videoUrl: '#',
      views: 1123,
      rating: 4.7,
      uploadDate: '2024-01-25',
      tags: ['Atama', 'Transfer', 'Onay'],
      completed: false,
      watched: false
    },
    {
      id: '5',
      title: 'QR Kod ile Hızlı İşlemler',
      description: 'QR kod okuma, hızlı zimmet bulma ve mobil işlemler',
      duration: '10:40',
      difficulty: 'Başlangıç',
      category: 'mobile',
      thumbnail: 'https://via.placeholder.com/320x180/fd7e14/ffffff?text=Video+5',
      videoUrl: '#',
      views: 756,
      rating: 4.5,
      uploadDate: '2024-01-28',
      tags: ['QR', 'Mobil', 'Hızlı İşlem'],
      completed: false,
      watched: false
    },
    {
      id: '6',
      title: 'Detaylı Raporlama',
      description: 'Rapor oluşturma, filtreleme, dışa aktarma ve analiz teknikleri',
      duration: '22:30',
      difficulty: 'İleri',
      category: 'reporting',
      thumbnail: 'https://via.placeholder.com/320x180/e83e8c/ffffff?text=Video+6',
      videoUrl: '#',
      views: 2341,
      rating: 4.9,
      uploadDate: '2024-02-01',
      tags: ['Rapor', 'Analiz', 'Export'],
      completed: false,
      watched: false
    },
    {
      id: '7',
      title: 'Kullanıcı Rolü ve Yetkilendirme',
      description: 'Kullanıcı rolleri oluşturma, yetki atama ve güvenlik ayarları',
      duration: '16:25',
      difficulty: 'İleri',
      category: 'user-management',
      thumbnail: 'https://via.placeholder.com/320x180/20c997/ffffff?text=Video+7',
      videoUrl: '#',
      views: 634,
      rating: 4.8,
      uploadDate: '2024-02-05',
      tags: ['Roller', 'Yetki', 'Güvenlik'],
      completed: false,
      watched: false
    },
    {
      id: '8',
      title: 'SAP Entegrasyonu',
      description: 'SAP sistemi ile veri senkronizasyonu ve otomatik güncellemeler',
      duration: '25:10',
      difficulty: 'İleri',
      category: 'advanced',
      thumbnail: 'https://via.placeholder.com/320x180/dc3545/ffffff?text=Video+8',
      videoUrl: '#',
      views: 445,
      rating: 4.6,
      uploadDate: '2024-02-08',
      tags: ['SAP', 'Entegrasyon', 'API'],
      completed: false,
      watched: false
    }
  ];

  // Kullanıcı ilerleme durumu
  const userProgress: UserProgress = {
    totalVideos: videoTutorials.length,
    completedVideos: videoTutorials.filter(v => v.completed).length,
    watchTime: '2s 45dk',
    lastWatched: '2024-01-25'
  };

  // Filtrelenmiş videolar
  const getFilteredVideos = () => {
    let filtered = videoTutorials;

    // Kategori filtresi
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(video => video.category === selectedCategory);
    }

    // Arama filtresi
    if (searchTerm) {
      filtered = filtered.filter(video => 
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // İzlenmemiş videolar filtresi
    if (showOnlyUnwatched) {
      filtered = filtered.filter(video => !video.watched);
    }

    // Sıralama
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'duration':
        filtered.sort((a, b) => {
          const getDuration = (duration: string) => {
            const parts = duration.split(':');
            return parseInt(parts[0]) * 60 + parseInt(parts[1]);
          };
          return getDuration(a.duration) - getDuration(b.duration);
        });
        break;
    }

    return filtered;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Başlangıç': return 'success';
      case 'Orta': return 'warning';
      case 'İleri': return 'danger';
      default: return 'secondary';
    }
  };

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return (views / 1000).toFixed(1) + 'K';
    }
    return views.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const getProgressPercentage = () => {
    return Math.round((userProgress.completedVideos / userProgress.totalVideos) * 100);
  };

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-1 fw-bold text-primary">🎬 Video Eğitimleri</h4>
              <p className="text-muted mb-0">Asyaport Zimmet Takip Sistemi <span className="badge bg-gradient bg-primary bg-opacity-75 ms-2">Video Kütüphanesi</span></p>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-primary btn-sm rounded-pill shadow-sm px-3">
                <i className="bi bi-bookmark me-1"></i>
                Favorilerim
              </button>
              <button className="btn btn-primary btn-sm rounded-pill shadow-sm px-3">
                <i className="bi bi-plus-circle me-1"></i>
                Video Öner
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Card */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-lg rounded-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <div className="card-body text-white p-4 rounded-4">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h5 className="fw-bold mb-2">
                    <i className="bi bi-trophy me-2"></i>
                    Eğitim İlerlemeniz
                  </h5>
                  <p className="mb-3 opacity-90">
                    Tebrikler! Eğitim videolarında {getProgressPercentage()}% ilerleme kaydetmişsiniz.
                    {userProgress.completedVideos} video tamamladınız, {userProgress.totalVideos - userProgress.completedVideos} video kaldı.
                  </p>
                  <div className="progress bg-white bg-opacity-25 mb-2" style={{ height: '8px' }}>
                    <div 
                      className="progress-bar bg-white" 
                      style={{ width: `${getProgressPercentage()}%` }}
                    ></div>
                  </div>
                  <small className="opacity-75">
                    Toplam izleme süresi: {userProgress.watchTime} • Son izlenen: {formatDate(userProgress.lastWatched)}
                  </small>
                </div>
                <div className="col-md-4 text-end">
                  <div className="d-flex flex-column gap-2">
                    <div className="d-flex justify-content-end gap-3">
                      <div className="text-center">
                        <div className="fs-3 fw-bold">{userProgress.completedVideos}</div>
                        <small className="opacity-75">Tamamlanan</small>
                      </div>
                      <div className="text-center">
                        <div className="fs-3 fw-bold">{userProgress.totalVideos}</div>
                        <small className="opacity-75">Toplam</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-3 rounded-4">
              <h6 className="fw-bold mb-3">
                <i className="bi bi-collection me-2 text-primary"></i>
                Kategoriler
              </h6>
              <div className="row g-2">
                <div className="col-md-2">
                  <button
                    className={`btn w-100 py-3 rounded-4 fw-semibold shadow-sm ${selectedCategory === 'all' ? 'btn-dark' : 'btn-outline-dark'} category-btn`}
                    onClick={() => setSelectedCategory('all')}
                  >
                    <i className="bi bi-grid me-1"></i>
                    <br />
                    <small>Tümü ({videoTutorials.length})</small>
                  </button>
                </div>
                {categories.map((category) => (
                  <div key={category.id} className="col-md-2">
                    <button
                      className={`btn w-100 py-3 rounded-4 fw-semibold shadow-sm category-btn ${
                        selectedCategory === category.id 
                          ? `btn-${category.color}` 
                          : `btn-outline-${category.color}`
                      }`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <i className={`bi ${category.icon} me-1`}></i>
                      <br />
                      <small>{category.name} ({category.videoCount})</small>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-3 rounded-4">
              <div className="row g-3 align-items-center">
                <div className="col-md-4">
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Video ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <select
                    className="form-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">En Yeni</option>
                    <option value="oldest">En Eski</option>
                    <option value="popular">En Popüler</option>
                    <option value="rating">En Beğenilen</option>
                    <option value="duration">Süreye Göre</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="unwatchedOnly"
                      checked={showOnlyUnwatched}
                      onChange={(e) => setShowOnlyUnwatched(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="unwatchedOnly">
                      Sadece izlenmeyenler
                    </label>
                  </div>
                </div>
                <div className="col-md-3 text-end">
                  <span className="text-muted">
                    {getFilteredVideos().length} video bulundu
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="row g-4">
        {getFilteredVideos().map((video) => (
          <div key={video.id} className="col-lg-4 col-md-6">
            <div className="card border-0 shadow-lg h-100 rounded-4 video-card position-relative overflow-hidden bg-white">
              {/* Video Thumbnail */}
              <div className="position-relative video-thumb rounded-top-4 overflow-hidden">
                <img
                  src={video.thumbnail}
                  className="card-img-top rounded-top-4"
                  alt={video.title}
                  style={{ height: '180px', objectFit: 'cover', transition: 'transform 0.3s' }}
                />
                <div className="position-absolute top-0 end-0 m-2">
                  <span className="badge bg-dark bg-opacity-75 shadow-sm">
                    <i className="bi bi-clock me-1"></i>
                    {video.duration}
                  </span>
                </div>
                <div className="position-absolute bottom-0 start-0 m-2">
                  <span className={`badge bg-${getDifficultyColor(video.difficulty)} shadow-sm`}>
                    {video.difficulty}
                  </span>
                </div>
                {video.watched && (
                  <div className="position-absolute top-0 start-0 m-2">
                    <span className="badge bg-success shadow-sm">
                      <i className="bi bi-check-circle me-1"></i>
                      İzlendi
                    </span>
                  </div>
                )}
                {video.completed && (
                  <div className="position-absolute top-0 start-0 mt-5 ms-2">
                    <span className="badge bg-primary shadow-sm">
                      <i className="bi bi-trophy me-1"></i>
                      Tamamlandı
                    </span>
                  </div>
                )}
                {/* Play Overlay */}
                <div className="position-absolute top-50 start-50 translate-middle">
                  <button
                    className="btn btn-light btn-lg rounded-circle shadow play-btn"
                    onClick={() => setSelectedVideo(video)}
                  >
                    <i className="bi bi-play-fill text-primary"></i>
                  </button>
                </div>
              </div>

              {/* Video Info */}
              <div className="card-body rounded-bottom-4">
                <h6 className="fw-bold mb-2 text-dark">{video.title}</h6>
                <p className="text-muted small mb-2 lh-sm" style={{ height: '40px', overflow: 'hidden' }}>
                  {video.description}
                </p>
                <div className="d-flex align-items-center mb-2">
                  <div className="me-auto">
                    <small className="text-muted">
                      <i className="bi bi-eye me-1"></i>
                      {formatViews(video.views)} görüntüleme
                    </small>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="text-warning me-1">
                      {'★'.repeat(Math.floor(video.rating))}{'☆'.repeat(5 - Math.floor(video.rating))}
                    </div>
                    <small className="text-muted">{video.rating}</small>
                  </div>
                </div>
                <div className="d-flex flex-wrap gap-1 mb-3">
                  {video.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="badge bg-light text-dark border border-1">
                      {tag}
                    </span>
                  ))}
                </div>
                <small className="text-muted">
                  <i className="bi bi-calendar3 me-1"></i>
                  {formatDate(video.uploadDate)}
                </small>
              </div>

              {/* Video Actions */}
              <div className="card-footer bg-transparent border-0 rounded-bottom-4">
                <div className="d-flex gap-1">
                  <button
                    className="btn btn-primary btn-sm flex-fill rounded-pill shadow-sm"
                    onClick={() => setSelectedVideo(video)}
                  >
                    <i className="bi bi-play me-1"></i>
                    İzle
                  </button>
                  <button className="btn btn-outline-secondary btn-sm rounded-pill shadow-sm">
                    <i className="bi bi-bookmark"></i>
                  </button>
                  <button className="btn btn-outline-secondary btn-sm rounded-pill shadow-sm">
                    <i className="bi bi-share"></i>
                  </button>
                  <div className="dropdown">
                    <button
                      className="btn btn-outline-secondary btn-sm rounded-pill shadow-sm dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                    >
                      <i className="bi bi-three-dots"></i>
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <a className="dropdown-item" href="#">
                          <i className="bi bi-download me-2"></i>Offline İndir
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          <i className="bi bi-flag me-2"></i>Rapor Et
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          <i className="bi bi-info-circle me-2"></i>Detaylar
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {getFilteredVideos().length === 0 && (
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <div className="text-muted mb-3">
                  <i className="bi bi-search display-1"></i>
                </div>
                <h5 className="fw-bold mb-2">Video Bulunamadı</h5>
                <p className="text-muted mb-4">
                  Arama kriterlerinize uygun video bulunamadı. Filtreleri değiştirerek tekrar deneyin.
                </p>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setShowOnlyUnwatched(false);
                  }}
                >
                  <i className="bi bi-arrow-clockwise me-1"></i>
                  Filtreleri Temizle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header border-0 bg-primary bg-gradient text-white rounded-top-4">
                <h5 className="modal-title fw-bold">{selectedVideo.title}</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedVideo(null)}
                ></button>
              </div>
              <div className="modal-body p-0">
                <div className="ratio ratio-16x9 rounded-4 overflow-hidden">
                  <div className="d-flex align-items-center justify-content-center bg-dark text-white">
                    <div className="text-center">
                      <i className="bi bi-play-circle display-1 mb-3"></i>
                      <h5>Video Oynatıcı</h5>
                      <p className="text-muted">
                        Video oynatıcı entegrasyonu için iframe veya video.js kullanılabilir
                      </p>
                      <button className="btn btn-light btn-lg rounded-pill px-4 shadow">
                        <i className="bi bi-play me-1"></i>
                        Oynat
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 justify-content-between bg-light rounded-bottom-4">
                <div className="d-flex gap-2">
                  <button className="btn btn-outline-success btn-sm rounded-pill">
                    <i className="bi bi-check-circle me-1"></i>
                    Tamamlandı Olarak İşaretle
                  </button>
                  <button className="btn btn-outline-warning btn-sm rounded-pill">
                    <i className="bi bi-bookmark me-1"></i>
                    Favorilere Ekle
                  </button>
                </div>
                <div className="d-flex gap-2">
                  <span className="badge bg-light text-dark border border-1">
                    <i className="bi bi-eye me-1"></i>
                    {formatViews(selectedVideo.views)}
                  </span>
                  <span className="badge bg-light text-dark border border-1">
                    <i className="bi bi-star me-1"></i>
                    {selectedVideo.rating}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Learning Path Suggestion */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="alert alert-info border-0 shadow-lg rounded-4">
            <div className="row align-items-center">
              <div className="col-md-8">
                <h6 className="fw-bold mb-1">
                  <i className="bi bi-lightbulb me-2"></i>
                  Öğrenme Yolu Önerisi
                </h6>
                <p className="mb-0 text-muted">
                  Sistemi etkili kullanmak için önce <span className="fw-semibold text-primary">"Başlangıç"</span> kategorisindeki videoları izlemenizi, 
                  ardından ihtiyaçlarınıza göre diğer kategorilere geçmenizi öneriyoruz.
                </p>
              </div>
              <div className="col-md-4 text-end">
                <button className="btn btn-primary btn-sm rounded-pill shadow-sm px-3">
                  <i className="bi bi-map me-1"></i>
                  Öğrenme Yolunu Görüntüle
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    {/* Custom styles for hover/active effects */}
    <style>{`
      .video-card:hover {
        box-shadow: 0 0.5rem 2rem rgba(0,0,0,0.12)!important;
        transform: translateY(-2px) scale(1.01);
        transition: box-shadow 0.2s, transform 0.2s;
        border: 1.5px solid #0d6efd22;
      }
      .video-thumb img:hover {
        transform: scale(1.04);
      }
      .category-btn:focus, .category-btn.active {
        outline: 2px solid #0d6efd55;
        box-shadow: 0 0 0 0.2rem #0d6efd22;
      }
      .play-btn:active {
        background: #e9ecef;
        color: #0d6efd;
      }
    `}</style>
    </div>
  );
};

export default VideoTutorials;