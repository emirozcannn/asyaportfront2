// src/pages/help/TechnicalSupport.tsx
import React, { useState } from 'react';

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  priority: 'Düşük' | 'Orta' | 'Yüksek' | 'Kritik';
  category: string;
  status: 'Açık' | 'İncelemede' | 'Çözüldü' | 'Kapatıldı';
  createdDate: string;
  lastUpdate: string;
  assignedTo?: string;
}

interface SupportCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  responseTime: string;
  examples: string[];
}

interface SupportChannel {
  id: string;
  name: string;
  description: string;
  icon: string;
  availability: string;
  responseTime: string;
  color: string;
  contact: string;
}

const TechnicalSupport: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('create-ticket');
  const [ticketForm, setTicketForm] = useState({
    title: '',
    description: '',
    priority: 'Orta' as 'Düşük' | 'Orta' | 'Yüksek' | 'Kritik',
    category: '',
    attachments: [] as File[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Destek kategorileri
  const supportCategories: SupportCategory[] = [
    {
      id: 'login-access',
      name: 'Giriş ve Erişim Sorunları',
      description: 'Sisteme giriş, şifre problemleri ve hesap kilitleri',
      icon: 'bi-door-closed',
      color: 'primary',
      responseTime: '15 dakika',
      examples: [
        'Şifre hatırlamıyorum',
        'Hesabım kilitlendi',
        'İki faktörlü kimlik doğrulama sorunu',
        'Yetki hatası alıyorum'
      ]
    },
    {
      id: 'system-bug',
      name: 'Sistem Hataları',
      description: 'Uygulama hataları, çökme ve beklenmeyen davranışlar',
      icon: 'bi-bug',
      color: 'danger',
      responseTime: '30 dakika',
      examples: [
        'Sayfa yüklenmiyor',
        'Hata mesajı alıyorum',
        'Sistem çöktü',
        'Veriler görüntülenmiyor'
      ]
    },
    {
      id: 'performance',
      name: 'Performans Sorunları',
      description: 'Sistem yavaşlığı ve optimizasyon talepleri',
      icon: 'bi-speedometer2',
      color: 'warning',
      responseTime: '1 saat',
      examples: [
        'Sistem çok yavaş',
        'Sayfa açılmıyor',
        'Raporlar oluşturulmuyor',
        'Timeout hatası'
      ]
    },
    {
      id: 'data-sync',
      name: 'Veri Senkronizasyon',
      description: 'SAP entegrasyonu ve veri aktarım sorunları',
      icon: 'bi-arrow-repeat',
      color: 'info',
      responseTime: '2 saat',
      examples: [
        'SAP verileri güncellenmiyor',
        'Zimmet bilgileri yanlış',
        'Departman listesi eksik',
        'Çalışan bilgileri hatalı'
      ]
    },
    {
      id: 'feature-request',
      name: 'Özellik Talebi',
      description: 'Yeni özellik önerileri ve geliştirme talepleri',
      icon: 'bi-lightbulb',
      color: 'success',
      responseTime: '1 gün',
      examples: [
        'Yeni rapor türü',
        'Mobil app özelliği',
        'Bulk işlem özelliği',
        'UI/UX iyileştirmesi'
      ]
    },
    {
      id: 'training',
      name: 'Eğitim ve Kullanım',
      description: 'Sistem kullanımı, eğitim ve dokümantasyon',
      icon: 'bi-book',
      color: 'secondary',
      responseTime: '4 saat',
      examples: [
        'Nasıl kullanırım?',
        'Video eğitimi talebi',
        'Dokümantasyon eksik',
        'Yeni kullanıcı eğitimi'
      ]
    }
  ];

  // Destek kanalları
  const supportChannels: SupportChannel[] = [
    {
      id: 'live-chat',
      name: 'Canlı Destek',
      description: 'Anında yardım için canlı sohbet',
      icon: 'bi-chat-dots',
      availability: '7/24',
      responseTime: '< 2 dakika',
      color: 'primary',
      contact: 'Sohbeti Başlat'
    },
    {
      id: 'phone',
      name: 'Telefon Desteği',
      description: 'Acil durumlar için telefon hattı',
      icon: 'bi-telephone',
      availability: '09:00-18:00',
      responseTime: 'Anında',
      color: 'success',
      contact: '+90 282 123 45 67'
    },
    {
      id: 'email',
      name: 'E-posta Desteği',
      description: 'Detaylı sorular için e-posta',
      icon: 'bi-envelope',
      availability: '7/24',
      responseTime: '< 2 saat',
      color: 'info',
      contact: 'support@asyaport.com'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      description: 'Mobil kullanıcılar için WhatsApp',
      icon: 'bi-whatsapp',
      availability: '09:00-17:00',
      responseTime: '< 15 dakika',
      color: 'success',
      contact: '+90 555 123 45 67'
    },
    {
      id: 'remote',
      name: 'Uzaktan Erişim',
      description: 'Karmaşık sorunlar için uzaktan bağlantı',
      icon: 'bi-display',
      availability: 'Randevu ile',
      responseTime: '30 dakika',
      color: 'warning',
      contact: 'Randevu Al'
    }
  ];

  // Örnek destek talepleri (kullanıcının geçmiş talepleri)
  const myTickets: SupportTicket[] = [
    {
      id: 'TK-2024-001',
      title: 'SAP entegrasyonu çalışmıyor',
      description: 'Son güncelleme sonrası SAP verileri senkronize olmuyor.',
      priority: 'Yüksek',
      category: 'data-sync',
      status: 'Çözüldü',
      createdDate: '2024-02-05',
      lastUpdate: '2024-02-06',
      assignedTo: 'Ahmet Yılmaz'
    },
    {
      id: 'TK-2024-002',
      title: 'Mobil uygulamada QR kod okutamıyorum',
      description: 'iPhone 12 Pro ile QR kod tarama özelliği çalışmıyor.',
      priority: 'Orta',
      category: 'system-bug',
      status: 'İncelemede',
      createdDate: '2024-02-08',
      lastUpdate: '2024-02-08',
      assignedTo: 'Elif Kaya'
    },
    {
      id: 'TK-2024-003',
      title: 'Toplu zimmet aktarma özelliği',
      description: 'Excel dosyası ile toplu zimmet ekleme özelliği eklenebilir mi?',
      priority: 'Düşük',
      category: 'feature-request',
      status: 'Açık',
      createdDate: '2024-02-10',
      lastUpdate: '2024-02-10'
    }
  ];

  const handleFormChange = (field: string, value: any) => {
    setTicketForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setTicketForm(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...Array.from(files)]
      }));
    }
  };

  const removeAttachment = (index: number) => {
    setTicketForm(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simüle edilmiş API çağrısı
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert('Destek talebiniz başarıyla oluşturuldu! Ticket numaranız: TK-2024-004');
    
    // Form temizleme
    setTicketForm({
      title: '',
      description: '',
      priority: 'Orta',
      category: '',
      attachments: []
    });
    
    setIsSubmitting(false);
    setActiveTab('my-tickets');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Kritik': return 'danger';
      case 'Yüksek': return 'warning';
      case 'Orta': return 'info';
      case 'Düşük': return 'success';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Açık': return 'primary';
      case 'İncelemede': return 'warning';
      case 'Çözüldü': return 'success';
      case 'Kapatıldı': return 'secondary';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const getResponseTime = (categoryId: string) => {
    const category = supportCategories.find(c => c.id === categoryId);
    return category?.responseTime || 'Belirtilmemiş';
  };

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-1 fw-bold">🛠️ Teknik Destek</h4>
              <p className="text-muted mb-0">Asyaport Zimmet Takip Sistemi - 7/24 Destek Merkezi</p>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-success btn-sm">
                <i className="bi bi-chat-dots me-1"></i>
                Canlı Destek
              </button>
              <button className="btn btn-success btn-sm">
                <i className="bi bi-telephone me-1"></i>
                Hemen Ara
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Support Status */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' }}>
            <div className="card-body text-white p-4">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <div className="d-flex align-items-center mb-2">
                    <div className="me-3">
                      <i className="bi bi-check-circle-fill fs-2"></i>
                    </div>
                    <div>
                      <h5 className="fw-bold mb-1">Tüm Sistemler Çalışıyor</h5>
                      <p className="mb-0 opacity-90">
                        Son sistem kontrolü: {new Date().toLocaleString('tr-TR')} • 
                        Uptime: %99.8 • Ortalama yanıt süresi: 247ms
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 text-end">
                  <div className="d-flex justify-content-end gap-3">
                    <div className="text-center">
                      <div className="fs-4 fw-bold">24</div>
                      <small className="opacity-75">Aktif Destek</small>
                    </div>
                    <div className="text-center">
                      <div className="fs-4 fw-bold">&lt; 2dk</div>
                      <small className="opacity-75">Ort. Yanıt</small>
                    </div>
                    <div className="text-center">
                      <div className="fs-4 fw-bold">98%</div>
                      <small className="opacity-75">Memnuniyet</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="row mb-4">
        <div className="col-12">
          <ul className="nav nav-pills nav-fill bg-light rounded p-1">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'create-ticket' ? 'active' : ''}`}
                onClick={() => setActiveTab('create-ticket')}
              >
                <i className="bi bi-plus-circle me-1"></i>
                Destek Talebi Oluştur
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'my-tickets' ? 'active' : ''}`}
                onClick={() => setActiveTab('my-tickets')}
              >
                <i className="bi bi-list-ul me-1"></i>
                Taleplerim ({myTickets.length})
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'support-channels' ? 'active' : ''}`}
                onClick={() => setActiveTab('support-channels')}
              >
                <i className="bi bi-headset me-1"></i>
                Destek Kanalları
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'knowledge-base' ? 'active' : ''}`}
                onClick={() => setActiveTab('knowledge-base')}
              >
                <i className="bi bi-book me-1"></i>
                Bilgi Bankası
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Tab Content */}
      <div className="row">
        <div className="col-12">
          {/* Create Ticket Tab */}
          {activeTab === 'create-ticket' && (
            <div className="row">
              <div className="col-lg-8">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-transparent border-0">
                    <h5 className="fw-bold mb-0">
                      <i className="bi bi-ticket-perforated me-2 text-primary"></i>
                      Yeni Destek Talebi
                    </h5>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleSubmit}>
                      <div className="row g-3">
                        <div className="col-12">
                          <label htmlFor="category" className="form-label fw-semibold">
                            Kategori <span className="text-danger">*</span>
                          </label>
                          <select
                            className="form-select"
                            id="category"
                            value={ticketForm.category}
                            onChange={(e) => handleFormChange('category', e.target.value)}
                            required
                          >
                            <option value="">Kategori seçin...</option>
                            {supportCategories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name} (Yanıt: {category.responseTime})
                              </option>
                            ))}
                          </select>
                          {ticketForm.category && (
                            <small className="text-muted">
                              Tahmini yanıt süresi: {getResponseTime(ticketForm.category)}
                            </small>
                          )}
                        </div>

                        <div className="col-md-8">
                          <label htmlFor="title" className="form-label fw-semibold">
                            Konu <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="title"
                            placeholder="Sorununuzu kısaca özetleyin"
                            value={ticketForm.title}
                            onChange={(e) => handleFormChange('title', e.target.value)}
                            required
                          />
                        </div>

                        <div className="col-md-4">
                          <label htmlFor="priority" className="form-label fw-semibold">
                            Öncelik <span className="text-danger">*</span>
                          </label>
                          <select
                            className="form-select"
                            id="priority"
                            value={ticketForm.priority}
                            onChange={(e) => handleFormChange('priority', e.target.value as any)}
                          >
                            <option value="Düşük">Düşük</option>
                            <option value="Orta">Orta</option>
                            <option value="Yüksek">Yüksek</option>
                            <option value="Kritik">Kritik</option>
                          </select>
                        </div>

                        <div className="col-12">
                          <label htmlFor="description" className="form-label fw-semibold">
                            Detaylı Açıklama <span className="text-danger">*</span>
                          </label>
                          <textarea
                            className="form-control"
                            id="description"
                            rows={6}
                            placeholder="Sorununuzu detaylı olarak açıklayın. Ne yapmaya çalışıyordunuz, ne oldu, hata mesajları varsa ekleyin."
                            value={ticketForm.description}
                            onChange={(e) => handleFormChange('description', e.target.value)}
                            required
                          />
                          <small className="text-muted">
                            Minimum 50 karakter. Mevcut: {ticketForm.description.length}
                          </small>
                        </div>

                        <div className="col-12">
                          <label htmlFor="attachments" className="form-label fw-semibold">
                            Dosya Ekleri
                          </label>
                          <input
                            type="file"
                            className="form-control"
                            id="attachments"
                            multiple
                            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.txt"
                            onChange={handleFileUpload}
                          />
                          <small className="text-muted">
                            Maksimum 5MB, desteklenen formatlar: JPG, PNG, PDF, DOC, TXT
                          </small>
                          
                          {ticketForm.attachments.length > 0 && (
                            <div className="mt-2">
                              <h6 className="fw-semibold">Yüklenen Dosyalar:</h6>
                              {ticketForm.attachments.map((file, index) => (
                                <div key={index} className="d-flex align-items-center justify-content-between border rounded p-2 mb-1">
                                  <div className="d-flex align-items-center">
                                    <i className="bi bi-file-earmark me-2 text-muted"></i>
                                    <span>{file.name}</span>
                                    <small className="text-muted ms-2">
                                      ({Math.round(file.size / 1024)}KB)
                                    </small>
                                  </div>
                                  <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => removeAttachment(index)}
                                  >
                                    <i className="bi bi-x"></i>
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="col-12">
                          <div className="alert alert-info">
                            <i className="bi bi-info-circle me-2"></i>
                            <strong>İpucu:</strong> Sorununuzu daha hızlı çözmemiz için:
                            <ul className="mb-0 mt-2">
                              <li>Hangi tarayıcı ve sürüm kullandığınızı belirtin</li>
                              <li>Hatanın tam olarak ne zaman oluştuğunu açıklayın</li>
                              <li>Ekran görüntüsü veya hata mesajı ekleyin</li>
                              <li>Sorunu yeniden oluşturma adımlarını paylaşın</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between mt-4">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => {
                            setTicketForm({
                              title: '',
                              description: '',
                              priority: 'Orta',
                              category: '',
                              attachments: []
                            });
                          }}
                        >
                          <i className="bi bi-arrow-clockwise me-1"></i>
                          Temizle
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={
                            isSubmitting || 
                            !ticketForm.title || 
                            !ticketForm.description || 
                            !ticketForm.category ||
                            ticketForm.description.length < 50
                          }
                        >
                          {isSubmitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2"></span>
                              Gönderiliyor...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-send me-1"></i>
                              Destek Talebi Gönder
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                {/* Categories Info */}
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-header bg-transparent border-0">
                    <h6 className="fw-bold mb-0">
                      <i className="bi bi-grid me-2 text-primary"></i>
                      Destek Kategorileri
                    </h6>
                  </div>
                  <div className="card-body p-0">
                    <div className="list-group list-group-flush">
                      {supportCategories.map((category) => (
                        <div key={category.id} className="list-group-item border-0">
                          <div className="d-flex align-items-start">
                            <div className={`text-${category.color} me-3 mt-1`}>
                              <i className={`bi ${category.icon}`}></i>
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="fw-semibold mb-1">{category.name}</h6>
                              <p className="text-muted small mb-1">{category.description}</p>
                              <small className={`badge bg-${category.color} bg-opacity-25 text-${category.color}`}>
                                Yanıt: {category.responseTime}
                              </small>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Contact */}
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-transparent border-0">
                    <h6 className="fw-bold mb-0">
                      <i className="bi bi-lightning me-2 text-warning"></i>
                      Acil Durum?
                    </h6>
                  </div>
                  <div className="card-body">
                    <p className="text-muted mb-3">
                      Kritik sistem sorunu mu yaşıyorsunuz? Hemen bizimle iletişime geçin.
                    </p>
                    <div className="d-grid gap-2">
                      <button className="btn btn-success btn-sm">
                        <i className="bi bi-telephone me-1"></i>
                        +90 282 123 45 67
                      </button>
                      <button className="btn btn-primary btn-sm">
                        <i className="bi bi-chat-dots me-1"></i>
                        Canlı Destek Başlat
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* My Tickets Tab */}
          {activeTab === 'my-tickets' && (
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-transparent border-0">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="fw-bold mb-0">
                    <i className="bi bi-list-ul me-2 text-primary"></i>
                    Destek Taleplerim
                  </h5>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => setActiveTab('create-ticket')}
                  >
                    <i className="bi bi-plus-circle me-1"></i>
                    Yeni Talep
                  </button>
                </div>
              </div>
              <div className="card-body p-0">
                {myTickets.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th>Ticket #</th>
                          <th>Konu</th>
                          <th>Kategori</th>
                          <th>Öncelik</th>
                          <th>Durum</th>
                          <th>Oluşturma</th>
                          <th>Son Güncelleme</th>
                          <th>Atanan</th>
                          <th>İşlemler</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myTickets.map((ticket) => (
                          <tr key={ticket.id}>
                            <td>
                              <code className="text-primary">{ticket.id}</code>
                            </td>
                            <td>
                              <div className="fw-semibold">{ticket.title}</div>
                              <small className="text-muted">
                                {ticket.description.substring(0, 50)}...
                              </small>
                            </td>
                            <td>
                              <span className="badge bg-light text-dark">
                                {supportCategories.find(c => c.id === ticket.category)?.name}
                              </span>
                            </td>
                            <td>
                              <span className={`badge bg-${getPriorityColor(ticket.priority)}`}>
                                {ticket.priority}
                              </span>
                            </td>
                            <td>
                              <span className={`badge bg-${getStatusColor(ticket.status)}`}>
                                {ticket.status}
                              </span>
                            </td>
                            <td>{formatDate(ticket.createdDate)}</td>
                            <td>{formatDate(ticket.lastUpdate)}</td>
                            <td>
                              {ticket.assignedTo ? (
                                <small className="text-muted">{ticket.assignedTo}</small>
                              ) : (
                                <small className="text-muted">Atanmadı</small>
                              )}
                            </td>
                            <td>
                              <div className="dropdown">
                                <button
                                  className="btn btn-outline-secondary btn-sm dropdown-toggle"
                                  type="button"
                                  data-bs-toggle="dropdown"
                                >
                                  <i className="bi bi-three-dots"></i>
                                </button>
                                <ul className="dropdown-menu">
                                  <li>
                                    <a className="dropdown-item" href="#">
                                      <i className="bi bi-paperclip me-2"></i>Dosya Ekle
                                    </a>
                                  </li>
                                  <li>
                                    <a className="dropdown-item" href="#">
                                      <i className="bi bi-eye me-2"></i>Detayları Gör
                                    </a>
                                  </li>
                                  <li>
                                    <a className="dropdown-item" href="#">
                                      <i className="bi bi-chat-square-text me-2"></i>Yorum Ekle
                                    </a>
                                  </li>
                                  <li>
                                    <a className="dropdown-item" href="#">
                                      <i className="bi bi-paperclip me-2"></i>Dosya Ekle
                                    </a>
                                  </li>
                                  <li><hr className="dropdown-divider" /></li>
                                  <li>
                                    <a className="dropdown-item text-danger" href="#">
                                      <i className="bi bi-x-circle me-2"></i>Talebi Kapat
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <div className="text-muted mb-3">
                      <i className="bi bi-inbox display-1"></i>
                    </div>
                    <h5 className="fw-bold mb-2">Henüz destek talebiniz yok</h5>
                    <p className="text-muted mb-4">
                      Sorularınız için yeni bir destek talebi oluşturabilirsiniz.
                    </p>
                    <button
                      className="btn btn-primary"
                      onClick={() => setActiveTab('create-ticket')}
                    >
                      <i className="bi bi-plus-circle me-1"></i>
                      İlk Talebimi Oluştur
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Support Channels Tab */}
          {activeTab === 'support-channels' && (
            <div className="row g-4">
              {supportChannels.map((channel) => (
                <div key={channel.id} className="col-lg-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body p-4">
                      <div className="d-flex align-items-start mb-3">
                        <div className={`text-${channel.color} me-3`}>
                          <i className={`bi ${channel.icon} fs-1`}></i>
                        </div>
                        <div className="flex-grow-1">
                          <h5 className="fw-bold mb-2">{channel.name}</h5>
                          <p className="text-muted mb-3">{channel.description}</p>
                          
                          <div className="row g-2 mb-3">
                            <div className="col-6">
                              <div className="d-flex align-items-center">
                                <i className="bi bi-clock me-2 text-muted"></i>
                                <div>
                                  <small className="text-muted">Çalışma Saatleri</small>
                                  <div className="fw-semibold">{channel.availability}</div>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="d-flex align-items-center">
                                <i className="bi bi-lightning me-2 text-muted"></i>
                                <div>
                                  <small className="text-muted">Yanıt Süresi</small>
                                  <div className="fw-semibold">{channel.responseTime}</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <button className={`btn btn-${channel.color} w-100`}>
                            <i className={`bi ${channel.icon} me-2`}></i>
                            {channel.contact}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Knowledge Base Tab */}
          {activeTab === 'knowledge-base' && (
            <div className="row g-4">
              <div className="col-12">
                <div className="card border-0 shadow-sm">
                  <div className="card-body p-4 text-center">
                    <div className="mb-4">
                      <i className="bi bi-book display-1 text-primary"></i>
                    </div>
                    <h4 className="fw-bold mb-3">Bilgi Bankası</h4>
                    <p className="text-muted mb-4 lead">
                      Sık karşılaşılan sorunlara hızlı çözümler ve detaylı kılavuzlar
                    </p>
                    
                    <div className="row g-3">
                      <div className="col-md-3">
                        <div className="card border-0 bg-light h-100">
                          <div className="card-body p-3 text-center">
                            <i className="bi bi-question-circle-fill text-info fs-1 mb-2"></i>
                            <h6 className="fw-bold">SSS</h6>
                            <p className="small text-muted mb-3">47 sık sorulan soru</p>
                            <button className="btn btn-info btn-sm">Görüntüle</button>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="card border-0 bg-light h-100">
                          <div className="card-body p-3 text-center">
                            <i className="bi bi-play-circle-fill text-danger fs-1 mb-2"></i>
                            <h6 className="fw-bold">Video Kılavuzlar</h6>
                            <p className="small text-muted mb-3">23 eğitim videosu</p>
                            <button className="btn btn-danger btn-sm">İzle</button>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="card border-0 bg-light h-100">
                          <div className="card-body p-3 text-center">
                            <i className="bi bi-file-text-fill text-warning fs-1 mb-2"></i>
                            <h6 className="fw-bold">Dokümantasyon</h6>
                            <p className="small text-muted mb-3">Teknik kılavuzlar</p>
                            <button className="btn btn-warning btn-sm">Oku</button>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="card border-0 bg-light h-100">
                          <div className="card-body p-3 text-center">
                            <i className="bi bi-download text-success fs-1 mb-2"></i>
                            <h6 className="fw-bold">İndirilebilir</h6>
                            <p className="small text-muted mb-3">PDF kılavuzlar</p>
                            <button className="btn btn-success btn-sm">İndir</button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-light rounded">
                      <div className="row text-center">
                        <div className="col-md-4">
                          <h3 className="text-primary fw-bold">156</h3>
                          <small className="text-muted">Toplam Makale</small>
                        </div>
                        <div className="col-md-4">
                          <h3 className="text-success fw-bold">12K</h3>
                          <small className="text-muted">Aylık Görüntülenme</small>
                        </div>
                        <div className="col-md-4">
                          <h3 className="text-warning fw-bold">4.8</h3>
                          <small className="text-muted">Ortalama Puan</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Support Info */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="row g-3">
            <div className="col-md-4">
              <div className="card border-0 bg-primary text-white shadow-sm">
                <div className="card-body p-4 text-center">
                  <i className="bi bi-headset fs-1 mb-3"></i>
                  <h6 className="fw-bold">7/24 Canlı Destek</h6>
                  <p className="small mb-3 opacity-75">
                    Uzman teknisyenlerimiz size yardımcı olmak için hazır
                  </p>
                  <button className="btn btn-light btn-sm">
                    <i className="bi bi-chat-dots me-1"></i>
                    Sohbeti Başlat
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 bg-success text-white shadow-sm">
                <div className="card-body p-4 text-center">
                  <i className="bi bi-telephone-fill fs-1 mb-3"></i>
                  <h6 className="fw-bold">Telefon Desteği</h6>
                  <p className="small mb-3 opacity-75">
                    Acil durumlar için direkt telefon desteği
                  </p>
                  <button className="btn btn-light btn-sm">
                    <i className="bi bi-telephone me-1"></i>
                    +90 282 123 45 67
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 bg-info text-white shadow-sm">
                <div className="card-body p-4 text-center">
                  <i className="bi bi-envelope-fill fs-1 mb-3"></i>
                  <h6 className="fw-bold">E-posta Desteği</h6>
                  <p className="small mb-3 opacity-75">
                    Detaylı sorularınız için e-posta gönderin
                  </p>
                  <button className="btn btn-light btn-sm">
                    <i className="bi bi-envelope me-1"></i>
                    E-posta Gönder
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Support Team */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card border-0 bg-light">
            <div className="card-body p-4">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h6 className="fw-bold mb-2">
                    <i className="bi bi-people-fill me-2 text-primary"></i>
                    Destek Ekibimiz
                  </h6>
                  <p className="text-muted mb-0">
                    <strong>12 uzman teknisyen</strong> ile 7/24 hizmetinizdeyiz. 
                    Ortalama <strong>2 dakika</strong> içinde size geri dönüş yapıyor, 
                    sorunlarınızı <strong>%98 başarı oranı</strong> ile çözüyoruz.
                  </p>
                </div>
                <div className="col-md-4 text-end">
                  <div className="d-flex justify-content-end align-items-center gap-2">
                    <div className="d-flex">
                      <img 
                        src="https://via.placeholder.com/32x32/007bff/ffffff?text=AY" 
                        className="rounded-circle me-1" 
                        width="32" 
                        height="32" 
                        alt="Ahmet" 
                      />
                      <img 
                        src="https://via.placeholder.com/32x32/28a745/ffffff?text=EK" 
                        className="rounded-circle me-1" 
                        width="32" 
                        height="32" 
                        alt="Elif" 
                      />
                      <img 
                        src="https://via.placeholder.com/32x32/ffc107/ffffff?text=MS" 
                        className="rounded-circle me-1" 
                        width="32" 
                        height="32" 
                        alt="Mehmet" 
                      />
                      <span 
                        className="badge bg-secondary rounded-circle d-flex align-items-center justify-content-center" 
                        style={{ width: '32px', height: '32px' }}
                      >
                        +9
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalSupport;