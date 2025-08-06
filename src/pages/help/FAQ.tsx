// src/pages/help/FAQ.tsx
import React, { useState } from 'react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  popularity: number;
  lastUpdated: string;
  helpful: number;
  notHelpful: number;
  isExpanded?: boolean;
}

interface FAQCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  questionCount: number;
}

const FAQ: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<string>('popularity');
  const [showOnlyRecent, setShowOnlyRecent] = useState<boolean>(false);

  // SSS kategorileri
  const categories: FAQCategory[] = [
    {
      id: 'login-access',
      name: 'Giriş ve Erişim',
      description: 'Sisteme giriş, şifre sorunları ve erişim hakları',
      icon: 'bi-door-open',
      color: 'primary',
      questionCount: 8
    },
    {
      id: 'asset-management',
      name: 'Zimmet Yönetimi',
      description: 'Zimmet ekleme, düzenleme, atama ve iade işlemleri',
      icon: 'bi-box-seam',
      color: 'success',
      questionCount: 12
    },
    {
      id: 'user-roles',
      name: 'Kullanıcı Rolleri',
      description: 'Rol yetkileri, kullanıcı yönetimi ve departman işlemleri',
      icon: 'bi-people',
      color: 'info',
      questionCount: 6
    },
    {
      id: 'reports',
      name: 'Raporlama',
      description: 'Rapor oluşturma, dışa aktarma ve analiz',
      icon: 'bi-graph-up',
      color: 'warning',
      questionCount: 7
    },
    {
      id: 'mobile',
      name: 'Mobil Kullanım',
      description: 'Mobil uygulama ve QR kod kullanımı',
      icon: 'bi-phone',
      color: 'secondary',
      questionCount: 5
    },
    {
      id: 'technical',
      name: 'Teknik Sorunlar',
      description: 'Sistem hataları, performans ve entegrasyon sorunları',
      icon: 'bi-gear',
      color: 'danger',
      questionCount: 9
    }
  ];

  // SSS öğeleri
  const faqItems: FAQItem[] = [
    {
      id: '1',
      question: 'Sisteme giriş yapamıyorum, ne yapmalıyım?',
      answer: 'Giriş yapamama durumunda şu adımları takip edin:\n\n1. **Kullanıcı adı ve şifrenizi kontrol edin** - Büyük/küçük harf duyarlılığına dikkat edin\n2. **Caps Lock tuşunun kapalı** olduğundan emin olun\n3. **Tarayıcınızın çerezlerini temizleyin** ve sayfayı yenileyin\n4. **Farklı bir tarayıcı** ile deneyin (Chrome veya Firefox önerilir)\n5. Sorun devam ederse **İT departmanından şifre sıfırlama** talebinde bulunun\n\n**Not:** 3 kez yanlış giriş yaparsanız hesabınız 15 dakika süreyle kilitlenir.',
      category: 'login-access',
      tags: ['giriş', 'şifre', 'kimlik doğrulama', 'hesap kilidi'],
      popularity: 95,
      lastUpdated: '2024-02-01',
      helpful: 234,
      notHelpful: 12,
      isExpanded: false
    },
    {
      id: '2',
      question: 'Yeni zimmet nasıl eklerim?',
      answer: 'Yeni zimmet eklemek için aşağıdaki adımları izleyin:\n\n1. **Sol menüden** "Zimmet Yönetimi" → "Yeni Zimmet Ekle" seçin\n2. **Zimmet kategorisini** belirleyin (Bilgisayar, Telefon, Araç vb.)\n3. **Teknik bilgileri** doldurun:\n   - Marka ve model\n   - Seri numarası\n   - Satın alma tarihi\n   - Satın alma bedeli\n4. **Zimmet fotoğrafını** yükleyin (isteğe bağlı)\n5. **QR kod etiketini** yazdırın ve cihaza yapıştırın\n6. **"Kaydet"** butonuna tıklayın\n\n**İpucu:** Seri numarasını mutlaka doğru girin, bu bilgi SAP sistemi ile senkronizasyon için kritiktir.',
      category: 'asset-management',
      tags: ['yeni zimmet', 'ekleme', 'kategori', 'seri numarası'],
      popularity: 89,
      lastUpdated: '2024-01-28',
      helpful: 187,
      notHelpful: 8,
      isExpanded: false
    },
    {
      id: '3',
      question: 'Çalışana zimmet nasıl atarım?',
      answer: 'Zimmet atama işlemi için şu adımları takip edin:\n\n1. **"Zimmet Yönetimi"** → **"Tüm Zimmetler"** sayfasına gidin\n2. **Atanacak zimmeti** listeden bulun ve tıklayın\n3. **"Zimmet Ata"** butonuna tıklayın\n4. **Çalışan bilgilerini** seçin:\n   - Departman seçimi\n   - Çalışan adı soyadı\n   - E-posta adresi\n5. **Atama gerekçesini** yazın\n6. **Teslim tarihi** ve **iade tarihi** (eğer geçici ise) belirleyin\n7. **Departman yöneticisinin onayına** gönderin\n\n**Önemli:** Atama işlemi departman yöneticisi tarafından onaylandıktan sonra aktif hale gelir.',
      category: 'asset-management',
      tags: ['zimmet atama', 'çalışan', 'onay süreci', 'departman'],
      popularity: 76,
      lastUpdated: '2024-01-25',
      helpful: 156,
      notHelpful: 15,
      isExpanded: false
    },
    {
      id: '4',
      question: 'Hangi raporları görebilirim?',
      answer: 'Kullanıcı rolünüze göre erişebileceğiniz raporlar:\n\n**Süper Yönetici:**\n- Tüm raporlara erişim\n- Şirket geneli analiz raporları\n- Maliyet ve amortisman raporları\n\n**Sistem Yöneticisi:**\n- Zimmet durum raporları\n- Departman bazlı raporlar\n- Kullanıcı aktivite raporları\n\n**Departman Yöneticisi:**\n- Sadece kendi departmanının raporları\n- Departman zimmet listesi\n- Atama/iade raporları\n\n**Kullanıcı:**\n- Sadece kendi zimmetleri\n- Kişisel zimmet geçmişi\n\n**Rapor formatları:** PDF, Excel, CSV olarak dışa aktarabilirsiniz.',
      category: 'reports',
      tags: ['raporlar', 'yetki', 'rol', 'dışa aktarma'],
      popularity: 71,
      lastUpdated: '2024-02-03',
      helpful: 143,
      notHelpful: 7,
      isExpanded: false
    },
    {
      id: '5',
      question: 'QR kod nasıl kullanılır?',
      answer: 'QR kod kullanımı için şu adımları izleyin:\n\n**QR Kod Oluşturma:**\n1. Zimmet detay sayfasında **"QR Kod Oluştur"** butonuna tıklayın\n2. QR kodu **yazdırın** ve **cihaza yapıştırın**\n\n**QR Kod Okuma:**\n1. **Mobil uygulamamızı** açın veya web sitesindeki **"QR Okuyucu"** özelliğini kullanın\n2. **Kameranızı** QR koda doğrultun\n3. **Otomatik olarak** zimmet detay sayfası açılır\n\n**QR Kod ile Yapabilecekleriniz:**\n- Zimmet durumunu hızlıca görüntüleme\n- Hızlı iade işlemi\n- Zimmet geçmişi görüntüleme\n- Fotoğraf ekleme ve durum güncelleme\n\n**İpucu:** QR kodları su geçirmez etiket kağıdına yazdırmanızı öneriyoruz.',
      category: 'mobile',
      tags: ['QR kod', 'mobil', 'hızlı erişim', 'etiket'],
      popularity: 68,
      lastUpdated: '2024-01-30',
      helpful: 128,
      notHelpful: 9,
      isExpanded: false
    },
    {
      id: '6',
      question: 'Zimmet iadesi nasıl yapılır?',
      answer: 'Zimmet iade işlemi için şu adımları takip edin:\n\n1. **"Zimmetlerim"** sayfasına gidin\n2. **İade edilecek zimmeti** seçin\n3. **"İade Et"** butonuna tıklayın\n4. **İade bilgilerini** doldurun:\n   - İade gerekçesi (detaylı)\n   - Zimmet durumu (İyi, Hasarlı, Arızalı)\n   - İade tarihi\n5. **Hasarlı veya arızalı** ise fotoğraf ekleyin\n6. **Zimmet sorumlusunun onayına** gönderin\n\n**Önemli Notlar:**\n- İade işlemi **onaylanana kadar** sorumluluk sizde kalır\n- **Hasarlı ürünler** için hasar bedeli hesaplanabilir\n- **Acil iadeler** için zimmet sorumlusu ile iletişime geçin',
      category: 'asset-management',
      tags: ['zimmet iadesi', 'hasar', 'onay', 'sorumluluk'],
      popularity: 64,
      lastUpdated: '2024-01-27',
      helpful: 119,
      notHelpful: 6,
      isExpanded: false
    },
    {
      id: '7',
      question: 'SAP entegrasyonu nasıl çalışır?',
      answer: 'SAP entegrasyon detayları:\n\n**Otomatik Senkronizasyon:**\n- Günde **3 kez** otomatik veri senkronizasyonu\n- **Personel bilgileri** SAP\'tan otomatik çekilir\n- **Maliyet merkezi** bilgileri güncellenir\n\n**Senkronize Edilen Veriler:**\n- Çalışan bilgileri ve departman yapısı\n- Zimmet kategorileri ve kodları\n- Amortisman bilgileri\n- Maliyet merkezleri\n\n**Manuel Senkronizasyon:**\n- **Süper Yönetici** yetkisi ile manuel tetikleme\n- **Acil durumlar** için hemen senkronizasyon\n\n**Hata Durumunda:**\n1. **Hata logları** kontrol edilir\n2. **IT departmanına** otomatik bildirim gider\n3. **Geçici çözüm** için manuel veri girişi yapılır\n\n**İletişim:** SAP bağlantı sorunları için ext: 1234',
      category: 'technical',
      tags: ['SAP', 'entegrasyon', 'senkronizasyon', 'API'],
      popularity: 45,
      lastUpdated: '2024-02-05',
      helpful: 87,
      notHelpful: 23,
      isExpanded: false
    },
    {
      id: '8',
      question: 'Sistem yavaş çalışıyor, ne yapabilirim?',
      answer: 'Performans sorunları için aşağıdaki çözümleri deneyin:\n\n**Tarayıcı Optimizasyonu:**\n1. **Önbelleği temizleyin** (Ctrl+Shift+Del)\n2. **Gereksiz sekmeleri** kapatın\n3. **Tarayıcıyı güncelleyin**\n4. **Chrome veya Firefox** kullanın (IE desteklenmez)\n\n**Sistem Kontrolleri:**\n1. **İnternet hızınızı** test edin (minimum 1 Mbps)\n2. **Bilgisayarınızı** yeniden başlatın\n3. **Arka planda çalışan** uygulamaları kapatın\n\n**Sistem Durumu:**\n- **Sistem Durumu** sayfasından sunucu performansını kontrol edin\n- **Bakım saatleri:** 02:00-04:00 arası (hafta içi)\n\n**Hala Yavaşsa:**\n- **IT desteğine** ticket açın\n- **Sistem kullanım yoğunluğu** saatlerini kontrol edin\n- **VPN bağlantısı** varsa kapatmayı deneyin',
      category: 'technical',
      tags: ['performans', 'yavaşlık', 'optimizasyon', 'tarayıcı'],
      popularity: 58,
      lastUpdated: '2024-01-29',
      helpful: 145,
      notHelpful: 18,
      isExpanded: false
    },
    {
      id: '9',
      question: 'Mobil uygulama hangi özellikleri destekliyor?',
      answer: 'Mobil uygulama özellikleri:\n\n**Temel Özellikler:**\n- **QR kod okuma** ve hızlı zimmet erişimi\n- **Zimmet listesi** görüntüleme\n- **Fotoğraf çekme** ve zimmet durumu güncelleme\n- **Push notification** bildirimleri\n\n**Gelişmiş Özellikler:**\n- **GPS konum** bilgisi ile zimmet takibi\n- **Offline mod** - İnternet olmadan temel işlemler\n- **Barkod tarama** desteği\n- **Sesli not** ekleme özelliği\n\n**Desteklenen Platformlar:**\n- **iOS 13.0+** (iPhone/iPad)\n- **Android 8.0+** (API Level 26)\n\n**İndirme Linkleri:**\n- App Store: [Yakında]\n- Google Play: [Yakında]\n\n**Geçici Çözüm:** Şimdilik **mobil web** versiyonunu kullanabilirsiniz - tüm özelliklere responsive tasarım ile erişim mevcut.',
      category: 'mobile',
      tags: ['mobil uygulama', 'iOS', 'Android', 'özellikler'],
      popularity: 52,
      lastUpdated: '2024-02-02',
      helpful: 94,
      notHelpful: 11,
      isExpanded: false
    },
    {
      id: '10',
      question: 'Kullanıcı rolleri arasındaki farklar nelerdir?',
      answer: 'Kullanıcı rolleri ve yetkileri:\n\n**🔧 Süper Yönetici:**\n- Tüm sistem ayarları ve konfigürasyonlar\n- Kullanıcı rolleri atama ve düzenleme\n- Veri yedekleme ve sistem bakımı\n- Tüm raporlara erişim\n\n**⚡ Sistem Yöneticisi:**\n- Kullanıcı ve departman yönetimi\n- Zimmet kategorileri ve ayarları\n- Sistem raporları görüntüleme\n- Genel sistem işlemleri\n\n**👥 Departman Yöneticisi:**\n- Sadece kendi departmanı kullanıcıları\n- Departman zimmetleri yönetimi\n- Zimmet talep onaylama\n- Departman raporları\n\n**👤 Kullanıcı:**\n- Kendi zimmetlerini görüntüleme\n- Zimmet talep oluşturma\n- Zimmet iade işlemleri\n- Kişisel profil ayarları\n\n**Rol Değişikliği:** Sadece Süper Yönetici roller arasında değişiklik yapabilir.',
      category: 'user-roles',
      tags: ['roller', 'yetkiler', 'kullanıcı', 'yönetici'],
      popularity: 61,
      lastUpdated: '2024-01-26',
      helpful: 172,
      notHelpful: 13,
      isExpanded: false
    }
  ];

  // Filtrelenmiş SSS öğeleri
  const getFilteredFAQs = () => {
    let filtered = faqItems;

    // Kategori filtresi
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Arama filtresi
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.question.toLowerCase().includes(searchLower) ||
        item.answer.toLowerCase().includes(searchLower) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Son güncellenme filtresi
    if (showOnlyRecent) {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      filtered = filtered.filter(item => 
        new Date(item.lastUpdated) >= oneMonthAgo
      );
    }

    // Sıralama
    switch (sortBy) {
      case 'popularity':
        filtered.sort((a, b) => b.popularity - a.popularity);
        break;
      case 'helpful':
        filtered.sort((a, b) => b.helpful - a.helpful);
        break;
      case 'recent':
        filtered.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.question.localeCompare(b.question, 'tr'));
        break;
    }

    return filtered;
  };

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const handleHelpful = (itemId: string, isHelpful: boolean) => {
    // Bu fonksiyon backend'e istek gönderecek
    console.log(`Item ${itemId} marked as ${isHelpful ? 'helpful' : 'not helpful'}`);
    // Gerçek uygulamada API çağrısı yapılacak
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const getPopularityColor = (popularity: number) => {
    if (popularity >= 80) return 'success';
    if (popularity >= 60) return 'warning';
    return 'secondary';
  };

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-1 fw-bold">❓ Sık Sorulan Sorular (SSS)</h4>
              <p className="text-muted mb-0">Asyaport Zimmet Takip Sistemi - En çok merak edilen konular</p>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-primary btn-sm">
                <i className="bi bi-question-circle me-1"></i>
                Soru Sor
              </button>
              <button className="btn btn-primary btn-sm">
                <i className="bi bi-chat-dots me-1"></i>
                Canlı Destek
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-3">
              <div className="row text-center">
                <div className="col-md-3">
                  <div className="d-flex align-items-center justify-content-center">
                    <div className="me-3">
                      <i className="bi bi-question-circle-fill text-primary fs-3"></i>
                    </div>
                    <div>
                      <div className="fs-4 fw-bold text-primary">{faqItems.length}</div>
                      <small className="text-muted">Toplam Soru</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="d-flex align-items-center justify-content-center">
                    <div className="me-3">
                      <i className="bi bi-eye-fill text-success fs-3"></i>
                    </div>
                    <div>
                      <div className="fs-4 fw-bold text-success">
                        {faqItems.reduce((sum, item) => sum + item.helpful, 0)}
                      </div>
                      <small className="text-muted">Yararlı Oylar</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="d-flex align-items-center justify-content-center">
                    <div className="me-3">
                      <i className="bi bi-collection-fill text-warning fs-3"></i>
                    </div>
                    <div>
                      <div className="fs-4 fw-bold text-warning">{categories.length}</div>
                      <small className="text-muted">Kategori</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="d-flex align-items-center justify-content-center">
                    <div className="me-3">
                      <i className="bi bi-clock-fill text-info fs-3"></i>
                    </div>
                    <div>
                      <div className="fs-4 fw-bold text-info">
                        {faqItems.filter(item => {
                          const oneWeekAgo = new Date();
                          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                          return new Date(item.lastUpdated) >= oneWeekAgo;
                        }).length}
                      </div>
                      <small className="text-muted">Bu Hafta Güncellenen</small>
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
          <div className="card border-0 shadow-sm">
            <div className="card-body p-3">
              <h6 className="fw-bold mb-3">
                <i className="bi bi-grid me-2 text-primary"></i>
                Kategoriler
              </h6>
              <div className="row g-2">
                <div className="col-lg-2 col-md-3">
                  <button
                    className={`btn w-100 ${selectedCategory === 'all' ? 'btn-dark' : 'btn-outline-dark'}`}
                    onClick={() => setSelectedCategory('all')}
                  >
                    <i className="bi bi-collection me-1"></i>
                    <br />
                    <small>Tümü ({faqItems.length})</small>
                  </button>
                </div>
                {categories.map((category) => (
                  <div key={category.id} className="col-lg-2 col-md-3">
                    <button
                      className={`btn w-100 ${
                        selectedCategory === category.id 
                          ? `btn-${category.color}` 
                          : `btn-outline-${category.color}`
                      }`}
                      onClick={() => setSelectedCategory(category.id)}
                      title={category.description}
                    >
                      <i className={`bi ${category.icon} me-1`}></i>
                      <br />
                      <small>{category.name} ({category.questionCount})</small>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-3">
              <div className="row g-3 align-items-center">
                <div className="col-md-5">
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Sorularda ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => setSearchTerm('')}
                      >
                        <i className="bi bi-x"></i>
                      </button>
                    )}
                  </div>
                </div>
                <div className="col-md-2">
                  <select
                    className="form-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="popularity">En Popüler</option>
                    <option value="helpful">En Yararlı</option>
                    <option value="recent">En Güncel</option>
                    <option value="alphabetical">Alfabetik</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="recentOnly"
                      checked={showOnlyRecent}
                      onChange={(e) => setShowOnlyRecent(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="recentOnly">
                      <small>Son güncellenenler</small>
                    </label>
                  </div>
                </div>
                <div className="col-md-3 text-end">
                  <span className="text-muted">
                    <strong>{getFilteredFAQs().length}</strong> soru bulundu
                  </span>
                  {expandedItems.size > 0 && (
                    <button
                      className="btn btn-link btn-sm text-decoration-none ms-2"
                      onClick={() => setExpandedItems(new Set())}
                    >
                      Tümünü Kapat
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Items */}
      <div className="row">
        <div className="col-12">
          <div className="accordion" id="faqAccordion">
            {getFilteredFAQs().map((item, index) => (
              <div key={item.id} className="card border-0 shadow-sm mb-3">
                <div className="card-header bg-transparent border-0">
                  <div className="d-flex justify-content-between align-items-start">
                    <button
                      className="btn btn-link text-decoration-none p-0 text-start flex-grow-1"
                      onClick={() => toggleExpanded(item.id)}
                    >
                      <div className="d-flex align-items-start">
                        <div className="me-3 mt-1">
                          <i className={`bi ${expandedItems.has(item.id) ? 'bi-chevron-down' : 'bi-chevron-right'} text-primary`}></i>
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="fw-bold mb-1 text-dark">{item.question}</h6>
                          <div className="d-flex flex-wrap gap-1 mb-2">
                            {item.tags.slice(0, 3).map((tag, tagIndex) => (
                              <span key={tagIndex} className="badge bg-light text-dark">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </button>
                    <div className="d-flex align-items-center gap-2 ms-3">
                      <span className={`badge bg-${getPopularityColor(item.popularity)}`}>
                        {item.popularity}% popüler
                      </span>
                      <small className="text-muted">
                        <i className="bi bi-clock me-1"></i>
                        {formatDate(item.lastUpdated)}
                      </small>
                    </div>
                  </div>
                </div>

                {expandedItems.has(item.id) && (
                  <div className="card-body pt-0">
                    <div className="border-top pt-3">
                      <div className="row">
                        <div className="col-lg-10">
                          <div className="text-muted lh-lg" style={{ whiteSpace: 'pre-line' }}>
                            {item.answer}
                          </div>
                        </div>
                        <div className="col-lg-2">
                          <div className="card bg-light border-0">
                            <div className="card-body p-3 text-center">
                              <h6 className="fw-bold mb-3">Bu yanıt yararlı mı?</h6>
                              <div className="d-flex gap-2 justify-content-center mb-3">
                                <button
                                  className="btn btn-outline-success btn-sm"
                                  onClick={() => handleHelpful(item.id, true)}
                                >
                                  <i className="bi bi-hand-thumbs-up me-1"></i>
                                  Evet
                                </button>
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => handleHelpful(item.id, false)}
                                >
                                  <i className="bi bi-hand-thumbs-down me-1"></i>
                                  Hayır
                                </button>
                              </div>
                              <div className="text-center">
                                <small className="text-success">
                                  <i className="bi bi-hand-thumbs-up me-1"></i>
                                  {item.helpful}
                                </small>
                                <small className="text-muted mx-2">|</small>
                                <small className="text-danger">
                                  <i className="bi bi-hand-thumbs-down me-1"></i>
                                  {item.notHelpful}
                                </small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Empty State */}
      {getFilteredFAQs().length === 0 && (
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <div className="text-muted mb-3">
                  <i className="bi bi-search display-1"></i>
                </div>
                <h5 className="fw-bold mb-2">Soru Bulunamadı</h5>
                <p className="text-muted mb-4">
                  Arama kriterlerinize uygun soru bulunamadı. Filtreleri değiştirerek tekrar deneyin 
                  veya yeni bir soru sorun.
                </p>
                <div className="d-flex gap-2 justify-content-center">
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                      setShowOnlyRecent(false);
                    }}
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Filtreleri Temizle
                  </button>
                  <button className="btn btn-primary">
                    <i className="bi bi-plus-circle me-1"></i>
                    Yeni Soru Sor
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popular Questions */}
      {selectedCategory === 'all' && !searchTerm && (
        <div className="row mt-5">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-transparent border-0">
                <h6 className="fw-bold mb-0">
                  <i className="bi bi-fire text-danger me-2"></i>
                  En Popüler Sorular
                </h6>
              </div>
              <div className="card-body p-0">
                <div className="list-group list-group-flush">
                  {faqItems
                    .filter(item => item.popularity >= 70)
                    .slice(0, 5)
                    .map((item, index) => (
                      <div key={item.id} className="list-group-item border-0">
                        <div className="d-flex align-items-center">
                          <div className="me-3">
                            <span className="badge bg-danger rounded-pill">
                              #{index + 1}
                            </span>
                          </div>
                          <div className="flex-grow-1">
                            <button
                              className="btn btn-link text-decoration-none p-0 text-start"
                              onClick={() => {
                                setExpandedItems(new Set([item.id]));
                                document.getElementById(`faq-${item.id}`)?.scrollIntoView({ 
                                  behavior: 'smooth' 
                                });
                              }}
                            >
                              <h6 className="mb-1">{item.question}</h6>
                              <small className="text-muted">
                                {item.popularity}% popülerlik - {item.helpful} yararlı oy
                              </small>
                            </button>
                          </div>
                          <div>
                            <span className="badge bg-light text-dark">
                              {categories.find(c => c.id === item.category)?.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="alert alert-info border-0 shadow-sm">
            <div className="row align-items-center">
              <div className="col-md-8">
                <h6 className="fw-bold mb-1">
                  <i className="bi bi-lightbulb me-2"></i>
                  Cevabını bulamadınız mı?
                </h6>
                <p className="mb-0 text-muted">
                  Sorunuz SSS'lerde yoksa, size yardımcı olmaktan memnuniyet duyacağız. 
                  Canlı destek veya destek talebi oluşturarak bizimle iletişime geçebilirsiniz.
                </p>
              </div>
              <div className="col-md-4 text-end">
                <div className="d-flex gap-2 justify-content-end">
                  <button className="btn btn-outline-primary btn-sm">
                    <i className="bi bi-chat-dots me-1"></i>
                    Canlı Destek
                  </button>
                  <button className="btn btn-primary btn-sm">
                    <i className="bi bi-ticket me-1"></i>
                    Destek Talebi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="row mt-3">
        <div className="col-12">
          <div className="card border-0 bg-light shadow-lg rounded-4 position-relative overflow-visible">
            {/* Köşe Ribbon */}
            <div style={{
              position: 'absolute',
              top: -12,
              left: -12,
              zIndex: 2,
              background: 'linear-gradient(90deg, #dc3545 80%, #fff 100%)',
              color: '#fff',
              padding: '2px 18px 2px 12px',
              fontWeight: 700,
              fontSize: 13,
              borderTopLeftRadius: '1rem',
              borderBottomRightRadius: '1rem',
              boxShadow: '0 2px 8px rgba(220,53,69,0.15)'
            }}>
              <span className="text-uppercase">İleri</span>
            </div>
            <div className="card-body p-4 text-center rounded-4">
              <h6 className="fw-bold mb-2 text-primary">
                <i className="bi bi-star-fill me-2 text-warning"></i>
                SSS Sayfamızı Değerlendirin
              </h6>
              <p className="text-muted mb-3 fs-6">
                Bu sayfayı nasıl buldunuz? Geri bildiriminiz bize yardımcı olur.
              </p>
              <div className="d-flex gap-2 justify-content-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className="btn btn-outline-warning btn-sm rounded-circle border-2 shadow-sm"
                    style={{ width: 38, height: 38 }}
                    onClick={() => console.log(`Rated ${star} stars`)}
                  >
                    <i className="bi bi-star"></i>
                  </button>
                ))}
              </div>
              <div className="d-flex justify-content-center gap-2 mb-2">
                <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-1 fw-semibold">
                  Son güncelleme: {formatDate(new Date().toISOString().split('T')[0])}
                </span>
                <span className="badge bg-success bg-opacity-10 text-success border border-success border-1 fw-semibold">
                  {faqItems.length} Soru
                </span>
                <span className="badge bg-info bg-opacity-10 text-info border border-info border-1 fw-semibold">
                  {categories.length} Kategori
                </span>
              </div>
              <small className="text-muted d-block mt-2">
                Görüşünüz bizim için değerli! ⭐
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;