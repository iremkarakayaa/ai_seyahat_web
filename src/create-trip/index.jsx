import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './styles.css';
import { generateTripPlan } from '../services/geminiService';
// Google Maps ile ilgili importları kaldırıyoruz
// import { searchPlaces, getPlaceDetails, searchHotels, getMapsApiKey } from '../services/api';
// import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api';

function CreateTrip() {
  const [selectedBudget, setSelectedBudget] = useState('');
  const [selectedTravelGroup, setSelectedTravelGroup] = useState('');
  const [destination, setDestination] = useState('');
  // Arama sonuçları ve seçilen yer state'lerini kaldırıyoruz
  // const [searchResults, setSearchResults] = useState([]);
  // const [selectedPlace, setSelectedPlace] = useState(null);
  const [days, setDays] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // Maps ve otellerle ilgili state'leri kaldırıyoruz
  // const [hotels, setHotels] = useState([]);
  // const [mapsApiKey, setMapsApiKey] = useState('');
  // const [mapsLoaded, setMapsLoaded] = useState(false);
  // const [mapsError, setMapsError] = useState(null);
  // const [isInitializing, setIsInitializing] = useState(true);
  // const [loadRetries, setLoadRetries] = useState(0);
  // const MAX_RETRIES = 3;
  const navigate = useNavigate();

  // Önceden tanımlanmış destinasyon seçenekleri
  const destinationOptions = [
    {
      id: 1,
      name: 'İstanbul',
      country: 'Türkiye',
      description: 'Tarihi yarımada, Boğaz manzarası ve zengin kültürüyle',
      image: '🏙️'
    },
    {
      id: 2,
      name: 'Antalya',
      country: 'Türkiye',
      description: 'Muhteşem plajları ve antik kentleriyle',
      image: '🏖️'
    },
    {
      id: 3,
      name: 'Kapadokya',
      country: 'Türkiye',
      description: 'Peri bacaları ve sıcak hava balonlarıyla',
      image: '🎈'
    },
    {
      id: 4,
      name: 'Paris',
      country: 'Fransa',
      description: 'Romantizm, sanat ve moda şehri',
      image: '🗼'
    },
    {
      id: 5,
      name: 'Roma',
      country: 'İtalya',
      description: 'Antik tarih ve İtalyan mutfağıyla',
      image: '🏛️'
    },
    {
      id: 6,
      name: 'Barselona',
      country: 'İspanya',
      description: 'Gaudi mimarisi ve Akdeniz sahilleriyle',
      image: '🏝️'
    },
    {
      id: 7,
      name: 'Amsterdam',
      country: 'Hollanda',
      description: 'Kanallar, bisikletler ve müzelerle dolu',
      image: '🚲'
    },
    {
      id: 8,
      name: 'Prag',
      country: 'Çek Cumhuriyeti',
      description: 'Masalsı mimarisi ve tarihi atmosferiyle',
      image: '🏰'
    }
  ];

  // API ve Maps ile ilgili fonksiyonları kaldırıyoruz
  // ...

  const budgetOptions = [
    {
      type: 'cheap',
      title: 'Ekonomik',
      description: 'Maliyetleri düşük tutun',
      icon: '💰'
    },
    {
      type: 'moderate',
      title: 'Standart',
      description: 'Ortalama bir bütçe ile seyahat edin',
      icon: '💵'
    },
    {
      type: 'luxury',
      title: 'Lüks',
      description: 'Maliyet endişesi olmadan seyahat edin',
      icon: '💎'
    }
  ];

  const travelGroupOptions = [
    {
      type: 'solo',
      title: 'Yalnız',
      description: 'Keşif yapan tek gezgin',
      icon: '✈️'
    },
    {
      type: 'couple',
      title: 'Çift',
      description: 'İki kişilik seyahat',
      icon: '🥂'
    },
    {
      type: 'family',
      title: 'Aile',
      description: 'Eğlenceli maceraperest bir grup',
      icon: '🏡'
    },
    {
      type: 'friends',
      title: 'Arkadaşlar',
      description: 'Heyecan arayan bir ekip',
      icon: '⛵'
    }
  ];

  // Destinasyon seçme fonksiyonu
  const handleDestinationSelect = (selectedDestination) => {
    setDestination(selectedDestination);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!destination) {
      toast.error('Lütfen bir destinasyon seçin');
      return;
    }
    
    if (!days || days < 1) {
      toast.error('Lütfen geçerli bir gün sayısı girin');
      return;
    }
    
    if (!selectedBudget) {
      toast.error('Lütfen bir bütçe seçeneği seçin');
      return;
    }
    
    if (!selectedTravelGroup) {
      toast.error('Lütfen bir seyahat grubu seçin');
      return;
    }
    
    setIsLoading(true);
    
    const selectedBudgetOption = budgetOptions.find(option => option.type === selectedBudget);
    const selectedGroupOption = travelGroupOptions.find(option => option.type === selectedTravelGroup);
    
    const prompt = `${days} günlük ${destination.name}, ${destination.country} seyahati için detaylı bir gezi planı oluştur. 
    Bütçe: ${selectedBudgetOption.title} (${selectedBudgetOption.description})
    Seyahat grubu: ${selectedGroupOption.title} (${selectedGroupOption.description})
    
    Her gün için ayrı ayrı plan oluştur ve şunları içersin:
    - Sabah aktiviteleri
    - Öğle yemeği önerileri
    - Öğleden sonra aktiviteleri
    - Akşam yemeği önerileri
    - Gece aktiviteleri
    - Konaklama önerileri
    - Ulaşım tavsiyeleri
    
    Lütfen her gün için ayrı başlıklar kullan ve yerel kültürü yansıtan öneriler sun.`;
    
    try {
      const tripPlan = await generateTripPlan(prompt);
      
      const tripData = {
        destination: destination.country 
          ? `${destination.name}, ${destination.country}` 
          : destination.name,
        days,
        budget: selectedBudgetOption.title,
        travelGroup: selectedGroupOption.title,
        plan: tripPlan,
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem('tripPlan', JSON.stringify(tripData));
      
      toast.success('Seyahat planınız başarıyla oluşturuldu!');
      navigate('/view-trip');
    } catch (error) {
      console.error('Plan oluşturma hatası:', error);
      toast.error('Seyahat planı oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-trip-container">
      {/* Navbar kaldırıldı */}
    
      <main className="main-content">
        <div className="header-section">
          <h1>Seyahat tercihlerinizi öğrenelim 🏕️🌴</h1>
          <p>
            Sadece birkaç temel bilgi verin, seyahat planlayıcımız 
            tercihlerinize göre özelleştirilmiş bir gezi planı oluştursun.
          </p>
        </div>
    
        <form className="trip-form" onSubmit={handleSubmit}>
          {/* Form içeriği devam ediyor */}
          <div className="form-group destination-group">
            <label>Nereyi ziyaret etmek istersiniz?</label>
            <input 
              type="text" 
              placeholder="Örn. İstanbul, Türkiye"
              value={destination.name ? (destination.country ? `${destination.name}, ${destination.country}` : destination.name) : ''}
              onChange={(e) => {
                const value = e.target.value;
                // Doğrudan girilen değeri kullan, virgül işlemini yapma
                setDestination({
                  id: 'custom',
                  name: value, // Virgül dahil tüm değeri name olarak kaydet
                  country: '',  // Ülke alanını temizle
                  description: '',
                  image: '🌍'
                });
              }}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="days">Kaç gün kalmayı planlıyorsunuz?</label>
            <input 
              type="number" 
              id="days" 
              placeholder="Örn. 3"
              min="1"
              max="30"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              required
            />
          </div>

          <div className="budget-section">
            <h2>Bütçeniz Nedir?</h2>
            <div className="budget-options">
              {budgetOptions.map((option) => (
                <button
                  key={option.type}
                  type="button"
                  className={`budget-card ${selectedBudget === option.type ? 'selected' : ''}`}
                  onClick={() => setSelectedBudget(option.type)}
                >
                  <span className="budget-icon">{option.icon}</span>
                  <h3>{option.title}</h3>
                  <p>{option.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="travel-group-section">
            <h2>Kimlerle seyahat etmeyi planlıyorsunuz?</h2>
            <div className="travel-group-options">
              {travelGroupOptions.map((option) => (
                <button
                  key={option.type}
                  type="button"
                  className={`travel-group-card ${selectedTravelGroup === option.type ? 'selected' : ''}`}
                  onClick={() => setSelectedTravelGroup(option.type)}
                >
                  <span className="travel-group-icon">{option.icon}</span>
                  <h3>{option.title}</h3>
                  <p>{option.description}</p>
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Plan Oluşturuluyor...' : 'Seyahat Planımı Oluştur'}
          </button>
        </form>
      </main>
    </div>
  );
}

export default CreateTrip;