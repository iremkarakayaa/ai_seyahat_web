import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './styles.css';
import { generateTripPlan } from '../services/geminiService';

function CreateTrip() {
  const [selectedBudget, setSelectedBudget] = useState('');
  const [selectedTravelGroup, setSelectedTravelGroup] = useState('');
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form doğrulama
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
    
    // Gemini AI için prompt oluştur
    const selectedBudgetOption = budgetOptions.find(option => option.type === selectedBudget);
    const selectedGroupOption = travelGroupOptions.find(option => option.type === selectedTravelGroup);
    
    const prompt = `${days} günlük ${destination} seyahati için detaylı bir gezi planı oluştur. 
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
      // Gemini API'yi çağır
      const tripPlan = await generateTripPlan(prompt);
      
      // Planı localStorage'a kaydet
      localStorage.setItem('tripPlan', JSON.stringify({
        destination,
        days,
        budget: selectedBudgetOption.title,
        travelGroup: selectedGroupOption.title,
        plan: tripPlan,
        createdAt: new Date().toISOString()
      }));
      
      toast.success('Seyahat planınız başarıyla oluşturuldu!');
      
      // Görüntüleme sayfasına yönlendir
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
      <nav className="navbar">
        <div className="logo-container">
          <div className="logo-circle">LP</div>
          <span className="logo-text">Logoipsum</span>
        </div>
        <button className="sign-in-btn">Giriş Yap</button>
      </nav>

      <main className="main-content">
        <div className="header-section">
          <h1>Seyahat tercihlerinizi öğrenelim 🏕️🌴</h1>
          <p>
            Sadece birkaç temel bilgi verin, seyahat planlayıcımız 
            tercihlerinize göre özelleştirilmiş bir gezi planı oluştursun.
          </p>
        </div>

        <form className="trip-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="destination">Nereyi ziyaret etmek istersiniz?</label>
            <select 
              id="destination" 
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            >
              <option value="" disabled>Seçiniz...</option>
              <option value="Paris, Fransa">Paris, Fransa</option>
              <option value="Tokyo, Japonya">Tokyo, Japonya</option>
              <option value="İstanbul, Türkiye">İstanbul, Türkiye</option>
              <option value="New York, ABD">New York, ABD</option>
              <option value="Roma, İtalya">Roma, İtalya</option>
              <option value="Barselona, İspanya">Barselona, İspanya</option>
              <option value="Amsterdam, Hollanda">Amsterdam, Hollanda</option>
              <option value="Dubai, BAE">Dubai, BAE</option>
            </select>
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