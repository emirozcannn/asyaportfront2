import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import ComingSoon from '../components/ComingSoon';

const DashboardPage: React.FC = () => {
  return (
    <DashboardLayout>
      <ComingSoon 
        title="Dashboard Yakında Gelecek"
        description="Kapsamlı zimmet yönetim dashboard'ı şu anda geliştirme aşamasında. Yakında tüm sistem metrikleri, grafikler ve raporlar burada yer alacak."
        features={[
          "Gerçek zamanlı zimmet durumu",
          "Departman bazlı istatistikler",
          "Kullanıcı aktivite grafikleri",
          "Aylık/Yıllık raporlar",
          "Sistem performans metrikleri"
        ]}
      />
    </DashboardLayout>
  );
};

export default DashboardPage;
