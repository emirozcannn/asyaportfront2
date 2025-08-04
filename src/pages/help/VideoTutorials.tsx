import React from 'react';

const VideoTutorials: React.FC = () => {
  return (
    <div className="video-tutorials-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Video Eğitimler</h2>
        <p className="text-muted">Sistem kullanımı hakkında video eğitimler</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .video-tutorials-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default VideoTutorials;
