import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';

const LandingPage = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    setShowLoginModal(true);
    setShowSignupModal(false);
  };

  const handleSignupClick = () => {
    setShowSignupModal(true);
    setShowLoginModal(false);
  };

  const handleCloseModals = () => {
    setShowLoginModal(false);
    setShowSignupModal(false);
  };

  const handleStartJourney = () => {
    // Kullanıcının giriş durumunu kontrol etmeden doğrudan giriş modalını göster
    setShowLoginModal(true);
  };

  return (
    <div className="landing-container">
      <header className="header">
        <nav className="navbar">
          <div className="logo">
            <div className="logo-container">
              <svg className="logo-svg" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                <path className="logo-path" d="M25 2C12.3 2 2 12.3 2 25s10.3 23 23 23 23-10.3 23-23S37.7 2 25 2zm0 40c-9.4 0-17-7.6-17-17S15.6 8 25 8s17 7.6 17 17-7.6 17-17 17z"/>
                <path className="logo-plane" d="M35 25l-18-8v6l10 2-10 2v6l18-8z"/>
              </svg>
              <span className="logo-text">TravelAI</span>
            </div>
          </div>
          <div className="nav-buttons">
            <button onClick={handleLoginClick} className="login-btn">Giriş Yap</button>
            <button onClick={handleSignupClick} className="signup-btn">Kayıt Ol</button>
          </div>
        </nav>
      </header>

      <main className="hero-section">
        <div className="hero-content">
          <h1 className="gradient-text">Yapay Zeka ile Yeni Maceralara Hazır Olun</h1>
          <p className="subtitle">Kişiselleştirilmiş Seyahat Planları Parmaklarınızın Ucunda</p>
          <p className="description">
            Sizin için özel olarak tasarlanmış, ilgi alanlarınıza ve bütçenize uygun seyahat planları oluşturan akıllı asistanınız.
          </p>
          <button onClick={handleStartJourney} className="cta-button">
            Yeni Bir Yolculuğa Başla🌍
          </button>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">🎯</span>
            <h3>Kişiselleştirilmiş Planlar</h3>
            <p>Size özel tercihler ve öneriler</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">⚡</span>
            <h3>Hızlı Planlama</h3>
            <p>Dakikalar içinde hazır rotalar</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">💰</span>
            <h3>Bütçe Dostu</h3>
            <p>Her bütçeye uygun seçenekler</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🌟</span>
            <h3>Benzersiz Deneyimler</h3>
            <p>Unutulmaz anılar için özel öneriler</p>
          </div>
        </div>

        <div className="app-preview">
          <div className="phone-mockup">
            <div className="screen-content"></div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-left">
            <div className="footer-logo">
              <div className="logo-container">
                <svg className="logo-svg-small" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                  <path className="logo-path" d="M25 2C12.3 2 2 12.3 2 25s10.3 23 23 23 23-10.3 23-23S37.7 2 25 2zm0 40c-9.4 0-17-7.6-17-17S15.6 8 25 8s17 7.6 17 17-7.6 17-17 17z"/>
                  <path className="logo-plane" d="M35 25l-18-8v6l10 2-10 2v6l18-8z"/>
                </svg>
                <span className="footer-logo-text">TravelAI</span>
              </div>
            </div>
          </div>
          
          <div className="footer-center">
            <div className="footer-links">
              <a href="#">Hakkımızda</a>
              <span className="footer-divider">•</span>
              <a href="#">Gizlilik</a>
              <span className="footer-divider">•</span>
              <a href="#">İletişim</a>
            </div>
          </div>
          
          <div className="footer-right">
            <div className="social-links">
              <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 TravelAI. Tüm hakları saklıdır.</p>
        </div>
      </footer>

      {showLoginModal && (
        <LoginModal 
          isOpen={showLoginModal} 
          onClose={handleCloseModals}
          onSuccess={() => {
            handleCloseModals();
            navigate('/my-trips');
          }}
          onSwitchToSignup={() => {
            setShowLoginModal(false);
            setShowSignupModal(true);
          }}
        />
      )}
      
      {showSignupModal && (
        <SignupModal 
          isOpen={showSignupModal} 
          onClose={handleCloseModals}
          onSuccess={() => {
            handleCloseModals();
            navigate('/my-trips');
          }}
          onSwitchToLogin={() => {
            setShowSignupModal(false);
            setShowLoginModal(true);
            console.log('Kayıt başarılı, giriş modalı açılıyor');
          }}
        />
      )}
    </div>
  );
};

export default LandingPage;