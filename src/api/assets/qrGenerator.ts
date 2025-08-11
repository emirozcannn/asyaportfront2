const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7190';

export const qrGeneratorApi = {
  generateQR: async (assetId: string, assetNumber: string, assetName: string) => {
    try {
      // QR kod için asset bilgisini içeren URL veya text oluştur
      const qrData = JSON.stringify({
        assetId,
        assetNumber,
        assetName,
        timestamp: new Date().toISOString()
      });

      // QR kod oluşturma için bir kütüphane kullanabilirsiniz (qrcode.js vs.)
      // Şimdilik basit bir implementasyon
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
      
      // QR kodu yeni pencerede aç
      window.open(qrCodeUrl, '_blank');
      
      return {
        success: true,
        qrData,
        qrCodeUrl,
        message: 'QR kod başarıyla oluşturuldu'
      };
    } catch (error) {
      console.error('QR kod oluşturma hatası:', error);
      throw new Error('QR kod oluşturulamadı');
    }
  },

  // Asset için QR kod bilgisini güncelle
  updateAssetQR: async (assetId: string, qrCode: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Assets/${assetId}/qrcode`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qrCode }),
      });

      if (!response.ok) {
        throw new Error('QR kod güncellenemedi');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('QR kod güncelleme hatası:', error);
      throw error;
    }
  }
};