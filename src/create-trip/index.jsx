import React, { useState } from 'react';
import './styles.css';

function CreateTrip() {
  const [selectedBudget, setSelectedBudget] = useState('');
  const [selectedTravelGroup, setSelectedTravelGroup] = useState('');

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

        <form className="trip-form">
          <div className="form-group">
            <label htmlFor="destination">Nereyi ziyaret etmek istersiniz?</label>
            <select id="destination" defaultValue="">
              <option value="" disabled>Seçiniz...</option>
              <option value="paris">Paris, Fransa</option>
              <option value="tokyo">Tokyo, Japonya</option>
              <option value="istanbul">İstanbul, Türkiye</option>
              <option value="newyork">New York, ABD</option>
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

          <button type="submit" className="submit-btn">
            Seyahat Planımı Oluştur
          </button>
        </form>
      </main>
    </div>
  );
}

export default CreateTrip;