import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import './styles.css';
import { getUserTrips, deleteTrip, saveTripPlan } from '../services/tripService';

function ViewTrip() {
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { tripId } = useParams();

  useEffect(() => {
    const fetchTripData = async () => {
      setLoading(true);
      try {
        // Firebase kodu kaldırıldı, sadece localStorage kullanılıyor
        const storedTripPlan = localStorage.getItem('tripPlan');
        if (storedTripPlan) {
          setTripData(JSON.parse(storedTripPlan));
        } else {
          navigate('/my-trips');
        }
      } catch (error) {
        console.error('Seyahat planı yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTripData();
  }, [tripId, navigate]);

  const handleBackToTrips = () => {
    navigate('/my-trips');
  };

  const handleNewTrip = () => {
    navigate('/create-trip');
  };

  // MongoDB'ye kaydetme fonksiyonu düzeltildi
  const handleSaveTrip = async () => {
    try {
      // MongoDB'ye kaydetme işlemi
      const tripDataForSave = {
        planText: tripData.plan,
        userPrompt: `${tripData.days} günlük ${tripData.destination} seyahati - ${tripData.budget} bütçe - ${tripData.travelGroup}`
      };
      
      await saveTripPlan(tripDataForSave);
      
      // Başarılı kaydın ardından seyahat listesine yönlendir
      navigate('/my-trips');
    } catch (error) {
      console.error('Seyahat kaydedilirken hata:', error);
      toast.error('Seyahat kaydedilirken bir hata oluştu');
    }
  };

  if (!tripData) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Seyahat planınız yükleniyor...</p>
      </div>
    );
  }

  // Markdown formatındaki metni HTML'e dönüştürmek için geliştirilmiş fonksiyon
  const formatPlanText = (text) => {
    if (!text) return '';
    
    // Günleri ayır
    const dayRegex = /## Gün (\d+)/g;
    let formattedText = text;
    
    // Gün başlıklarını özel div'lerle çevrele
    formattedText = formattedText.replace(dayRegex, '<div class="day-section"><h2 class="day-title">Gün $1</h2>');
    
    // Her günün sonuna div kapatma ekle
    const dayMatches = [...text.matchAll(dayRegex)];
    
    if (dayMatches.length > 0) {
      let lastIndex = 0;
      let result = '';
      
      for (let i = 0; i < dayMatches.length; i++) {
        const match = dayMatches[i];
        const startIndex = match.index;
        
        if (i > 0) {
          // Önceki günün içeriğini al ve div ile kapat
          const prevContent = text.substring(lastIndex, startIndex);
          result += prevContent + '</div>';
        }
        
        // Yeni günün başlangıcını ekle
        result += '<div class="day-section"><h2 class="day-title">Gün ' + (i + 1) + '</h2>';
        lastIndex = startIndex + match[0].length;
      }
      
      // Son günün içeriğini ekle
      result += text.substring(lastIndex) + '</div>';
      formattedText = result;
    }
    
    // Başlıkları formatla
    formattedText = formattedText
      .replace(/# (.*)/g, '<h1 class="plan-title">$1</h1>')
      .replace(/## (.*)/g, '<h2 class="section-title">$1</h2>')
      .replace(/### (.*)/g, '<h3 class="subsection-title">$3</h3>')
      .replace(/#### (.*)/g, '<h4 class="item-title">$1</h4>');
    
    // Madde işaretlerini formatla
    formattedText = formattedText.replace(/- (.*)/g, '<li>$1</li>');
    formattedText = formattedText.replace(/<li>(.*)<\/li>/g, '<ul class="plan-list"><li>$1</li></ul>');
    formattedText = formattedText.replace(/<\/ul><ul class="plan-list">/g, '');
    
    // Paragrafları formatla
    formattedText = formattedText.replace(/\n\n/g, '</p><p class="plan-paragraph">');
    formattedText = `<p class="plan-paragraph">${formattedText}</p>`;
    formattedText = formattedText.replace(/<p class="plan-paragraph"><h([1-4])/g, '<h$1');
    formattedText = formattedText.replace(/<\/h([1-4])><\/p>/g, '</h$1>');
    formattedText = formattedText.replace(/<p class="plan-paragraph"><ul/g, '<ul');
    formattedText = formattedText.replace(/<\/ul><\/p>/g, '</ul>');
    formattedText = formattedText.replace(/<p class="plan-paragraph"><div/g, '<div');
    formattedText = formattedText.replace(/<\/div><\/p>/g, '</div>');
    
    return formattedText;
  };

  return (
    <div className="view-trip-container">
      <nav className="navbar">
        {/* Logo kaldırıldı */}
        <button className="back-to-trips-btn" onClick={handleBackToTrips}>
          <i className="fas fa-arrow-left"></i> Seyahatlerime Dön
        </button>
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
          <button className="action-btn save-btn" onClick={handleSaveTrip}>
            <span className="btn-icon">💾</span> Kaydet
          </button>
        </div>
      </main>
    </div>
  );
}

export default ViewTrip;