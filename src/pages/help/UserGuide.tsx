// src/pages/help/UserGuide.tsx
import React, { useState } from 'react';

interface GuideStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  content: string[];
  screenshots?: string[];
  tips?: string[];
}

interface GuideSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  steps: GuideStep[];
}

const UserGuide: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('getting-started');
  const [activeStep, setActiveStep] = useState<string>('');

  // Rehber bölümleri
  const guideSections: GuideSection[] = [
    {
      id: 'getting-started',
      title: 'Başlangıç',
      description: 'Sisteme giriş ve ilk adımlar',
      icon: 'bi-play-circle',
      color: 'success',
      steps: [
        {
          id: 'login',
          title: 'Sisteme Giriş',
          description: 'Kullanıcı adı ve şifre ile güvenli giriş',
          icon: 'bi-box-arrow-in-right',
          content: [
            'Tarayıcınızda sistem adresini açın: https://zimmet.asyaport.com',
            'Kullanıcı adınızı (genellikle email adresiniz) girin',
            'İK departmanından aldığınız şifrenizi girin',
            '"Beni Hatırla" seçeneğini işaretleyerek sürekli giriş sağlayabilirsiniz',
            '"Giriş Yap" butonuna tıklayın'
          ],
          tips: [
            'İlk girişte mutlaka şifrenizi değiştirin',
            'Güvenlik için düzenli olarak şifrenizi güncelleyin',
            'Ortak kullanılan bilgisayarlarda "Beni Hatırla" seçeneğini kullanmayın'
          ]
        },
        {
          id: 'dashboard',
          title: 'Ana Sayfa (Dashboard)',
          description: 'Sistem ana sayfasını tanıma',
          icon: 'bi-speedometer2',
          content: [
            'Giriş yaptıktan sonra ana sayfa (Dashboard) açılır',
            'Sol menüden tüm modüllere erişebilirsiniz',
            'Üst kısımda hızlı erişim butonları bulunur',
            'Sağ üstte profil menünüz ve bildirimler yer alır',
            'Ana alanda size özel widget\'lar ve istatistikler görüntülenir'
          ],
          tips: [
            'Widget\'ları sürükleyerek yeniden düzenleyebilirsiniz',
            'Bildirim zili üzerindeki kırmızı nokta yeni mesajları gösterir'
          ]
        },
        {
          id: 'profile',
          title: 'Profil Ayarları',
          description: 'Kişisel bilgileri güncelleme',
          icon: 'bi-person-gear',
          content: [
            'Sağ üst köşedeki profil fotoğrafına tıklayın',
            '"Profil Ayarları" seçeneğini seçin',
            'Kişisel bilgilerinizi kontrol edin ve güncelleyin',
            'Şifre değiştirmek için "Şifre Değiştir" sekmesini kullanın',
            'Bildirim tercihlerinizi "Bildirimler" sekmesinden ayarlayın'
          ],
          tips: [
            'Profil fotoğrafınızı güncellemek sistemi daha kişisel hale getirir',
            'Email bildirimlerini departmanınıza göre ayarlayın'
          ]
        }
      ]
    },
    {
      id: 'asset-management',
      title: 'Zimmet Yönetimi',
      description: 'Zimmetlerin takibi ve yönetimi',
      icon: 'bi-box-seam',
      color: 'primary',
      steps: [
        {
          id: 'view-assets',
          title: 'Zimmetleri Görüntüleme',
          description: 'Mevcut zimmetleri listeleme ve filtreleme',
          icon: 'bi-eye',
          content: [
            'Sol menüden "Zimmet Yönetimi" → "Tüm Zimmetler" seçin',
            'Liste halinde tüm zimmetler görüntülenir',
            'Üst kısımdaki filtreler ile arama yapabilirsiniz',
            'Kategorilere göre filtreleyebilirsiniz (Bilgisayar, Telefon, vb.)',
            'Durum bazlı filtreleme yapabilirsiniz (Aktif, Bakımda, vb.)'
          ],
          tips: [
            'Hızlı arama için zimmet numarasını veya marka/model bilgisini kullanın',
            'Excel\'e aktarmak için "Dışa Aktar" butonunu kullanın'
          ]
        },
        {
          id: 'asset-details',
          title: 'Zimmet Detayları',
          description: 'Zimmet bilgilerini detaylı inceleme',
          icon: 'bi-info-circle',
          content: [
            'Zimmet listesinden herhangi bir ürüne tıklayın',
            'Detay sayfasında tüm teknik bilgileri görüntülenir',
            'Zimmet geçmişi ve hareket logları takip edilir',
            'Mevcut kullanıcı bilgisi ve departman gösterilir',
            'Bakım kayıtları ve notlar incelenebilir'
          ],
          tips: [
            'QR kod ile hızlı erişim sağlayabilirsiniz',
            'Fotoğraflar zimbeti tanımlamada yardımcı olur'
          ]
        },
        {
          id: 'request-asset',
          title: 'Zimmet Talep Etme',
          description: 'Yeni zimmet için talep oluşturma',
          icon: 'bi-plus-circle',
          content: [
            '"Zimmet Yönetimi" → "Yeni Talep" menüsüne gidin',
            'Talep türünü seçin (Yeni Zimmet, Değişim, vb.)',
            'Kategori ve ürün detaylarını belirtin',
            'Gerekçe ve aciliyet durumunu yazın',
            'Departman yöneticinizin onayına gönderin'
          ],
          tips: [
            'Detaylı gerekçe yazmanız onay sürecini hızlandırır',
            'Benzer ürünler için önceki talepleri inceleyebilirsiniz'
          ]
        },
        {
          id: 'return-asset',
          title: 'Zimmet İade',
          description: 'Kullanımda olmayan zimmetleri iade etme',
          icon: 'bi-arrow-return-left',
          content: [
            '"Zimmetlerim" sayfasından iade edilecek ürünü seçin',
            '"İade Et" butonuna tıklayın',
            'İade gerekçesini detaylı olarak açıklayın',
            'Ürünün mevcut durumunu belirtin (İyi, Hasarlı, vb.)',
            'Zimmet sorumlusunun onayını bekleyin'
          ],
          tips: [
            'Hasarlı ürünler için fotoğraf eklenmesi önerilir',
            'İade işlemi tamamlanana kadar sorumluluk sizde kalır'
          ]
        }
      ]
    },
    {
      id: 'reports',
      title: 'Raporlama',
      description: 'Raporları görüntüleme ve oluşturma',
      icon: 'bi-graph-up',
      color: 'info',
      steps: [
        {
          id: 'view-reports',
          title: 'Rapor Görüntüleme',
          description: 'Mevcut raporları inceleme',
          icon: 'bi-file-earmark-bar-graph',
          content: [
            '"Raporlar" menüsünden istediğiniz rapor türünü seçin',
            'Tarih aralığını belirleyin',
            'Departman veya kategori filtresi uygulayın',
            '"Raporu Oluştur" butonuna tıklayın',
            'Rapor hazırlandığında görüntülenecektir'
          ],
          tips: [
            'Büyük raporlar için email bildirimi alabilirsiniz',
            'Sık kullanılan raporları favorilerinize ekleyin'
          ]
        },
        {
          id: 'export-reports',
          title: 'Rapor Dışa Aktarma',
          description: 'Raporları farklı formatlarda kaydetme',
          icon: 'bi-download',
          content: [
            'Hazırlanmış raporu görüntüleyin',
            'Sağ üst köşedeki "Dışa Aktar" menüsüne tıklayın',
            'İstediğiniz formatı seçin (PDF, Excel, CSV)',
            'Dosya otomatik olarak indirilecektir',
            'İndirme geçmişi "İndirmelerim" bölümünden takip edilir'
          ],
          tips: [
            'Excel formatı veri analizi için en uygun seçenektir',
            'PDF formatı resmi sunumlar için tercih edilir'
          ]
        }
      ]
    },
    {
      id: 'mobile',
      title: 'Mobil Kullanım',
      description: 'Mobil uygulama ve responsive kullanım',
      icon: 'bi-phone',
      color: 'warning',
      steps: [
        {
          id: 'mobile-web',
          title: 'Mobil Web Kullanımı',
          description: 'Telefondan web sitesine erişim',
          icon: 'bi-browser-chrome',
          content: [
            'Telefonunuzun tarayıcısından sistem adresini açın',
            'Giriş bilgilerinizi girin',
            'Mobil uyumlu arayüz otomatik olarak yüklenir',
            'Ana menü sol üstteki hamburger menüden erişilebilir',
            'Touch friendly butonlar ve büyük dokunma alanları'
          ],
          tips: [
            'Ana ekrana kısayol ekleyerek uygulama gibi kullanabilirsiniz',
            'Offline çalışma kabiliyeti sınırlıdır'
          ]
        },
        {
          id: 'mobile-features',
          title: 'Mobil Özellikler',
          description: 'Mobilde kullanılabilen özellikler',
          icon: 'bi-phone-vibrate',
          content: [
            'QR kod okuyarak hızlı zimmet erişimi',
            'Fotoğraf çekerek zimmet durumu güncelleme',
            'Push notification ile anlık bildirimler',
            'GPS konum bilgisi ile zimmet takibi',
            'Offline mod ile internet olmadan temel işlemler'
          ],
          tips: [
            'Kamera iznini vermeniz QR kod okuma için gereklidir',
            'Konum izni zimmet takibi için yararlıdır'
          ]
        }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Sorun Giderme',
      description: 'Sık karşılaşılan sorunlar ve çözümleri',
      icon: 'bi-tools',
      color: 'danger',
      steps: [
        {
          id: 'login-issues',
          title: 'Giriş Sorunları',
          description: 'Sisteme giriş yapamama durumu',
          icon: 'bi-exclamation-triangle',
          content: [
            'Kullanıcı adı ve şifrenizi kontrol edin (büyük/küçük harf duyarlı)',
            'Caps Lock tuşunun kapalı olduğundan emin olun',
            'Tarayıcınızın çerezlerini temizleyin',
            'Farklı bir tarayıcı ile deneyin',
            'İT departmanından şifre sıfırlama talebinde bulunun'
          ],
          tips: [
            '3 kez yanlış giriş sonrası hesap 15 dakika kilitlenir',
            'Şifre kurtarma için kayıtlı email adresiniz olmalıdır'
          ]
        },
        {
          id: 'performance-issues',
          title: 'Performans Sorunları',
          description: 'Sistem yavaş çalışması durumu',
          icon: 'bi-speedometer',
          content: [
            'Tarayıcınızın önbelleğini temizleyin',
            'Gereksiz sekmeleri kapatın',
            'İnternet bağlantınızı kontrol edin',
            'Tarayıcınızı güncelleyin',
            'Bilgisayarınızı yeniden başlatın'
          ],
          tips: [
            'Chrome veya Firefox tarayıcıları önerilir',
            'Eski Internet Explorer desteği sonlandırılmıştır'
          ]
        },
        {
          id: 'data-issues',
          title: 'Veri Sorunları',
          description: 'Eksik veya hatalı veri görünmesi',
          icon: 'bi-database-exclamation',
          content: [
            'Sayfayı yenileyin (F5 veya Ctrl+R)',
            'Farklı bir menüden aynı veriye erişmeyi deneyin',
            'Filtrelerinizi temizleyin',
            'Çıkış yapıp tekrar giriş yapın',
            'Sorun devam ederse IT desteğine bildirin'
          ],
          tips: [
            'Veri senkronizasyonu günde 3 kez otomatik yapılır',
            'Kritik sorunları hemen IT departmanına bildirin'
          ]
        }
      ]
    }
  ];

  const getCurrentSection = () => {
    return guideSections.find(section => section.id === activeSection);
  };

  const getCurrentStep = () => {
    const section = getCurrentSection();
    if (!section || !activeStep) return null;
    return section.steps.find(step => step.id === activeStep);
  };

  const getStepNumber = (stepId: string) => {
    const section = getCurrentSection();
    if (!section) return 0;
    return section.steps.findIndex(step => step.id === stepId) + 1;
  };

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-1 fw-bold">📖 Kullanıcı Rehberi</h4>
              <p className="text-muted mb-0">Asyaport Zimmet Takip Sistemi - Adım Adım Kullanım Kılavuzu</p>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-primary btn-sm">
                <i className="bi bi-search me-1"></i>
                Rehberde Ara
              </button>
              <button className="btn btn-primary btn-sm">
                <i className="bi bi-printer me-1"></i>
                PDF İndir
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-3">
              <h6 className="fw-bold mb-3">
                <i className="bi bi-signpost-2 me-2 text-primary"></i>
                Hızlı Navigasyon
              </h6>
              <div className="row g-2">
                {guideSections.map((section) => (
                  <div key={section.id} className="col-md-4 col-lg-2">
                    <button
                      className={`btn w-100 ${
                        activeSection === section.id 
                          ? `btn-${section.color}` 
                          : `btn-outline-${section.color}`
                      }`}
                      onClick={() => {
                        setActiveSection(section.id);
                        setActiveStep('');
                      }}
                    >
                      <i className={`bi ${section.icon} me-1`}></i>
                      <br />
                      <small>{section.title}</small>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Section Steps Sidebar */}
        <div className="col-lg-3">
          <div className="card border-0 shadow-sm sticky-top">
            <div className="card-header bg-transparent border-0">
              <h6 className="fw-bold mb-0">
                <i className={`bi ${getCurrentSection()?.icon} me-2 text-${getCurrentSection()?.color}`}></i>
                {getCurrentSection()?.title}
              </h6>
              <small className="text-muted">{getCurrentSection()?.description}</small>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {getCurrentSection()?.steps.map((step, index) => (
                  <button
                    key={step.id}
                    className={`list-group-item list-group-item-action border-0 ${
                      activeStep === step.id ? 'active' : ''
                    }`}
                    onClick={() => setActiveStep(step.id)}
                  >
                    <div className="d-flex align-items-start">
                      <div className="me-3">
                        <span className={`badge ${
                          activeStep === step.id 
                            ? 'bg-white text-primary' 
                            : `bg-${getCurrentSection()?.color}`
                        } rounded-pill`}>
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-grow-1 text-start">
                        <div className="fw-bold">{step.title}</div>
                        <small className={
                          activeStep === step.id ? 'text-white-50' : 'text-muted'
                        }>
                          {step.description}
                        </small>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-lg-9">
          {!activeStep ? (
            // Section Overview
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <div className={`text-${getCurrentSection()?.color} mb-3`}>
                    <i className={`bi ${getCurrentSection()?.icon} display-1`}></i>
                  </div>
                  <h3 className="fw-bold">{getCurrentSection()?.title}</h3>
                  <p className="text-muted lead">{getCurrentSection()?.description}</p>
                </div>

                <div className="row g-3">
                  {getCurrentSection()?.steps.map((step, index) => (
                    <div key={step.id} className="col-md-6">
                      <div className="card border-0 bg-light h-100">
                        <div className="card-body p-3">
                          <div className="d-flex align-items-start">
                            <div className="me-3">
                              <span className={`badge bg-${getCurrentSection()?.color} rounded-pill`}>
                                {index + 1}
                              </span>
                            </div>
                            <div>
                              <h6 className="fw-bold mb-1">{step.title}</h6>
                              <p className="text-muted small mb-2">{step.description}</p>
                              <button
                                className={`btn btn-m btn-outline-${getCurrentSection()?.color}`}
                                onClick={() => setActiveStep(step.id)}
                              >
                                Detayları Gör
                                <i className="bi bi-arrow-right ms-1"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Step Detail
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-transparent border-0">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <span className={`badge bg-${getCurrentSection()?.color} rounded-pill me-3`}>
                      Adım {getStepNumber(activeStep)}
                    </span>
                    <div>
                      <h5 className="fw-bold mb-0">{getCurrentStep()?.title}</h5>
                      <small className="text-muted">{getCurrentStep()?.description}</small>
                    </div>
                  </div>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setActiveStep('')}
                  >
                    <i className="bi bi-arrow-left me-1"></i>
                    Geri Dön
                  </button>
                </div>
              </div>
              <div className="card-body p-4">
                <div className="row">
                  <div className="col-lg-8">
                    <h6 className="fw-bold mb-3">
                      <i className="bi bi-list-ol me-2 text-primary"></i>
                      Adım Adım Talimatlar
                    </h6>
                    <ol className="list-group list-group-numbered list-group-flush">
                      {getCurrentStep()?.content.map((instruction, index) => (
                        <li key={index} className="list-group-item border-0 px-0">
                          {instruction}
                        </li>
                      ))}
                    </ol>

                    {getCurrentStep()?.tips && getCurrentStep()?.tips.length > 0 && (
                      <div className="mt-4">
                        <h6 className="fw-bold mb-3">
                          <i className="bi bi-lightbulb me-2 text-warning"></i>
                          İpuçları
                        </h6>
                        <div className="alert alert-warning border-0">
                          <ul className="mb-0">
                            {getCurrentStep()?.tips.map((tip, index) => (
                              <li key={index} className="mb-1">{tip}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="col-lg-4">
                    <div className="card border-0 bg-light">
                      <div className="card-body text-center p-4">
                        <div className={`text-${getCurrentSection()?.color} mb-3`}>
                          <i className={`bi ${getCurrentStep()?.icon} display-4`}></i>
                        </div>
                        <h6 className="fw-bold mb-2">Görsel Yardım</h6>
                        <p className="text-muted small mb-3">
                          Ekran görüntüleri ve videolar yakında eklenecek
                        </p>
                        <button className="btn btn-outline-primary btn-sm">
                          <i className="bi bi-play-circle me-1"></i>
                          Video İzle
                        </button>
                      </div>
                    </div>

                    {/* Navigation */}
                    <div className="card border-0 bg-light mt-3">
                      <div className="card-body">
                        <h6 className="fw-bold mb-3">Navigasyon</h6>
                        <div className="d-grid gap-2">
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            disabled={getStepNumber(activeStep) <= 1}
                            onClick={() => {
                              const steps = getCurrentSection()?.steps || [];
                              const currentIndex = steps.findIndex(s => s.id === activeStep);
                              if (currentIndex > 0) {
                                setActiveStep(steps[currentIndex - 1].id);
                              }
                            }}
                          >
                            <i className="bi bi-chevron-left me-1"></i>
                            Önceki Adım
                          </button>
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            disabled={getStepNumber(activeStep) >= (getCurrentSection()?.steps.length || 0)}
                            onClick={() => {
                              const steps = getCurrentSection()?.steps || [];
                              const currentIndex = steps.findIndex(s => s.id === activeStep);
                              if (currentIndex < steps.length - 1) {
                                setActiveStep(steps[currentIndex + 1].id);
                              }
                            }}
                          >
                            Sonraki Adım
                            <i className="bi bi-chevron-right ms-1"></i>
                          </button>
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

      {/* Quick Help Footer */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="alert alert-info border-0 shadow-sm">
            <div className="row align-items-center">
              <div className="col-md-8">
                <h6 className="fw-bold mb-1">
                  <i className="bi bi-question-circle me-2"></i>
                  Hala yardıma mı ihtiyacınız var?
                </h6>
                <p className="mb-0 text-muted">
                  Rehberde bulamadığınız sorular için teknik destek ekibimiz size yardımcı olmak için hazır.
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
    </div>
  );
};

export default UserGuide;