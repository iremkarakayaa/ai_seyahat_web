import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import profileIcon from '../assets/profile-icon.png'; // İkon yolunu kendi projenize göre ayarlayın

function Navbar() {
  const { currentUser, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="logo-container">
        <div className="logo-circle">LP</div>
        <span className="logo-text">Logoipsum</span>
      </div>
      
      <div className="nav-links">
        <Link to="/" className="nav-link">Ana Sayfa</Link>
        <Link to="/create-trip" className="nav-link">Seyahat Oluştur</Link>
        <Link to="/my-trips" className="nav-link">Seyahatlerim</Link>
      </div>
      
      <div className="user-section">
        {currentUser ? (
          <div className="user-profile">
            <div className="profile-icon-container">
              <img src={profileIcon} alt="Profil" className="profile-icon" />
            </div>
            <div className="user-dropdown">
              <Link to="/profile" className="dropdown-item">Profilim</Link>
              <button onClick={logout} className="dropdown-item">Çıkış Yap</button>
            </div>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="login-btn">Giriş Yap</Link>
            <Link to="/register" className="register-btn">Kayıt Ol</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;


