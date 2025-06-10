import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { deleteTrip, getUserTrips } from '../services/tripService'; // tripService fonksiyonlarını import ediyoruz
import { toast } from 'react-toastify'; // Toast bildirimleri için
import './MyTrips.css';

const MyTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // LocalStorage'dan kullanıcı bilgisini al
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        const currentUser = JSON.parse(storedUser);
        setUser(currentUser);
        fetchUserTrips();
      } catch (error) {
        console.error('Kullanıcı bilgisi çözümlenemedi:', error);
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  const fetchUserTrips = async () => {
    try {
      setLoading(true);
      console.log("Kullanıcı seyahatleri getiriliyor...");
      
      // tripService'den getUserTrips fonksiyonunu kullanarak seyahatleri getir
      const userTrips = await getUserTrips();
      console.log("Seyahatler başarıyla getirildi:", userTrips);

      // Seyahat verilerinden hedef ve tarih bilgilerini çıkaralım
      const processedTrips = userTrips.map(trip => {
        // Varsayılan değerler
        let destination = "Belirtilmemiş";
        let startDate = "Belirtilmemiş";
        let endDate = "Belirtilmemiş";
        let days = "1";
        
        // Plan metninden bilgileri çıkar
        if (trip.plan) {
          // 1. Başlık içinde destinasyon arama
          const titleDestinationMatch = trip.plan.match(/^# (.*?) Seyahat Plan[ıi]/i);
          if (titleDestinationMatch && titleDestinationMatch[1]) {
            destination = titleDestinationMatch[1].trim();
          }
          
          // 2. Alternatif olarak "Destinasyon:" veya "Seyahat:" formatında arama
          else {
            const destMatch = trip.plan.match(/(?:Destinasyon|Seyahat|Gezi|Tatil):\s*([^,\n.]+)/i);
            if (destMatch && destMatch[1]) {
              destination = destMatch[1].trim();
            }
          }
          
          // 3. Eğer prompt'tan bilgi çıkarılabiliyorsa
          if (destination === "Belirtilmemiş" && trip.userprompt) {
            const promptMatch = trip.userprompt.match(/(\d+) günlük (.*?) seyahati/i);
            if (promptMatch && promptMatch[2]) {
              destination = promptMatch[2].trim();
            }
          }
          
          // Tarih bilgilerini bulmaya çalış
          const dateMatch = trip.plan.match(/(\d{1,2}[\/\.]\d{1,2}[\/\.]\d{2,4})\s*-\s*(\d{1,2}[\/\.]\d{1,2}[\/\.]\d{2,4})/);
          if (dateMatch) {
            startDate = dateMatch[1];
            endDate = dateMatch[2];
            
            // Gün sayısını hesapla
            try {
              const start = new Date(startDate.split('/').reverse().join('-'));
              const end = new Date(endDate.split('/').reverse().join('-'));
              const diffTime = Math.abs(end - start);
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
              days = String(diffDays);
            } catch (error) {
              console.error('Tarih hesaplama hatası:', error);
            }
          }
          
          // Prompt içinde gün sayısı belirtilmiş olabilir
          else if (trip.userprompt) {
            const daysMatch = trip.userprompt.match(/(\d+) günlük/i);
            if (daysMatch && daysMatch[1]) {
              days = daysMatch[1];
            }
          }
        }
        
        return {
          id: trip._id,
          destination: destination,
          startDate: startDate,
          endDate: endDate,
          days: days,
          plan: trip.plan || "Seyahat planı",
          ...trip
        };
      });
      
      setTrips(processedTrips);
    } catch (error) {
      console.error('Seyahatler yüklenirken hata oluştu:', error);
      toast.error('Seyahatleriniz yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTrip = () => {
    navigate('/create-trip');
  };

  const handleViewTrip = (tripId) => {
    navigate(`/view-trip/${tripId}`);
  };

  // Silme işlemi için yeni fonksiyon
  const handleDeleteTrip = async (e, tripId) => {
    e.stopPropagation(); // Kart tıklamasının tetiklenmesini engelle
    
    if (window.confirm('Bu seyahati silmek istediğinizden emin misiniz?')) {
      try {
        await deleteTrip(tripId);
        // Silme işlemi başarılı olduğunda listeyi güncelle
        setTrips(trips.filter(trip => trip.id !== tripId));
        toast.success('Seyahat başarıyla silindi!');
      } catch (error) {
        console.error('Seyahat silinirken hata:', error);
        toast.error('Seyahat silinirken bir hata oluştu.');
      }
    }
  };

  const handleProfileClick = () => {
    console.log('Profil butonuna tıklandı');
    try {
      console.log('Profil sayfasına yönlendiriliyor...');
      navigate('/profile');
    } catch (error) {
      console.error('Profil sayfasına yönlendirilirken hata:', error);
      toast.error('Profil sayfasına yönlendirilirken bir hata oluştu');
    }
  };

  return (
    <div className="my-trips-container">
      <header className="my-trips-header">
        <h1 className="page-title">Seyahatlerim</h1>
        <div className="header-actions">
          <button className="create-trip-button" onClick={handleCreateTrip}>
            <span className="plus-icon">+</span>
          </button>
          <button 
            className="profile-button" 
            onClick={handleProfileClick}
            style={{ cursor: 'pointer' }}
            aria-label="Profil sayfasına git"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </header>

      <main className="my-trips-content">

        {loading ? (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Seyahatleriniz yükleniyor...</p>
          </div>
        ) : trips.length > 0 ? (
          <div className="trips-grid">
            {trips.map((trip) => (
              <div 
                key={trip.id} 
                className="trip-card" 
                onClick={() => handleViewTrip(trip.id)}
              >
                <div className="trip-destination">
                  <h3>{trip.destination} Seyahati</h3>
                </div>
                <div className="trip-dates">
                  {trip.startDate} - {trip.endDate}
                </div>
                <div className="trip-location">
                  <span className="location-icon"></span>
                  {trip.destination}
                </div>
                <div className="trip-plan-info">
                  {trip.plan && trip.plan.length > 50 ? `${trip.plan.substring(0, 50)}...` : trip.plan}
                </div>
                <div className="trip-plan-day">
                  Gün {trip.days}
                </div>
                <div className="trip-cost">
                  <span className="cost-icon">💰</span>
                  <span className="cost-value">0 TL</span>
                </div>
                <div className="trip-actions">
                  <div></div>
                  <button className="view-details-button">
                    Detayları Görüntüle
                  </button>
                </div>
                <button 
                  className="delete-trip-button" 
                  onClick={(e) => handleDeleteTrip(e, trip.id)}
                  title="Seyahati Sil"
                >
                  <span className="delete-icon">🗑️</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="location-icon-large"></div>
            <h2>Henüz seyahat planın yok</h2>
            <p>Seyahat etmenin zamanı geldi. Planlamaya başlayın!</p>
            <button 
              className="start-journey-button"
              onClick={handleCreateTrip}
            >
              Yeni bir yolculuğa başla
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyTrips;