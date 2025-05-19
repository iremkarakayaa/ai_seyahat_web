import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

function ViewTrip() {
  const [tripData, setTripData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // LocalStorage'dan seyahat planını al
    const storedTripPlan = localStorage.getItem('tripPlan');
    
    if (storedTripPlan) {
      try {
        const parsedData = JSON.parse(storedTripPlan);
        setTripData(parsedData);
      } catch (error) {
        console.error('Seyahat planı yüklenirken hata:', error);
      }
    } else {
      // Plan yoksa create-trip sayfasına yönlendir
      navigate('/create-trip');
    }
  }, [navigate]);

  const handleNewTrip = () => {
    navigate('/create-trip');
  };

  if (!tripData) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Seyahat planınız yükleniyor...</p>
      </div>
    );
  }

  // Markdown formatındaki metni HTML'e dönüştürmek için basit bir fonksiyon
  const formatPlanText = (text) => {
    // Başlıkları formatla
    let formattedText = text
      .replace(/# (.*)/g, '<h1>$1</h1>')
      .replace(/## (.*)/g, '<h2>$1</h2>')
      .replace(/### (.*)/g, '<h3>$1</h3>')
      .replace(/#### (.*)/g, '<h4>$1</h4>');
    
    // Madde işaretlerini formatla
    formattedText = formattedText.replace(/- (.*)/g, '<li>$1</li>');
    formattedText = formattedText.replace(/<li>(.*)<\/li>/g, '<ul><li>$1</li></ul>');
    formattedText = formattedText.replace(/<\/ul><ul>/g, '');
    
    // Paragrafları formatla
    formattedText = formattedText.replace(/\n\n/g, '</p><p>');
    formattedText = `<p>${formattedText}</p>`;
    formattedText = formattedText.replace(/<p><h([1-4])>/g, '<h$1>');
    formattedText = formattedText.replace(/<\/h([1-4])><\/p>/g, '</h$1>');
    formattedText = formattedText.replace(/<p><ul>/g, '<ul>');
    formattedText = formattedText.replace(/<\/ul><\/p>/g, '</ul>');
    
    return formattedText;
  };

  return (
    <div className="view-trip-container">
      <nav className="navbar">
        <div className="logo-container">
          <div className="logo-circle">LP</div>
          <span className="logo-text">Logoipsum</span>
        </div>
        <button className="new-trip-btn" onClick={handleNewTrip}>Yeni Seyahat Planı</button>
      </nav>

      <main className="trip-content">
        <div className="trip-header">
          <h1>{tripData.destination} Seyahat Planı</h1>
          <div className="trip-meta">
            <div className="meta-item">
              <span className="meta-icon">📅</span>
              <span>{tripData.days} Gün</span>
            </div>
            <div className="meta-item">
              <span className="meta-icon">💰</span>
              <span>{tripData.budget}</span>
            </div>
            <div className="meta-item">
              <span className="meta-icon">👥</span>
              <span>{tripData.travelGroup}</span>
            </div>
          </div>
        </div>

        <div className="trip-plan">
          <div 
            className="plan-content"
            dangerouslySetInnerHTML={{ __html: formatPlanText(tripData.plan) }}
          />
        </div>

        <div className="trip-actions">
          <button className="action-btn print-btn" onClick={() => window.print()}>
            <span className="btn-icon">🖨️</span> Yazdır
          </button>
          <button className="action-btn share-btn">
            <span className="btn-icon">🔗</span> Paylaş
          </button>
          <button className="action-btn save-btn">
            <span className="btn-icon">💾</span> Kaydet
          </button>
        </div>
      </main>
    </div>
  );
}

export default ViewTrip;