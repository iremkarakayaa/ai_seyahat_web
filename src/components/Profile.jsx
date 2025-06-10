import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import './Profile.css';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();
  const { logout, user: authUser } = useAuth();
  
  // API URL
  const API_URL = 'http://localhost:3002/api'; // Güncel port numarası

  useEffect(() => {
    if (!authUser) {
      navigate('/');
      return;
    }

    // Kullanıcı profil bilgilerini yükle
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        
        // Token'ı localStorage'dan al
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('Oturum bulunamadı');
        }
        
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        
        const { data } = await axios.get(`${API_URL}/users/profile`, config);
        
        setUser(data);
        setFormData({
          fullName: data.fullName,
          email: data.email
        });
      } catch (error) {
        console.error('Profil yükleme hatası:', error);
        toast.error('Profil bilgileri yüklenemedi');
        // Hata durumunda ana sayfaya yönlendir
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate, authUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Token'ı localStorage'dan al
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Oturum bulunamadı');
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      const { data } = await axios.put(
        `${API_URL}/users/profile`,
        formData,
        config
      );
      
      // LocalStorage'daki kullanıcı bilgisini güncelle
      const userData = JSON.parse(localStorage.getItem('user'));
      userData.fullName = data.fullName;
      // E-posta güncelleme devre dışı bırakıldığından bunu güncellemeyelim
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Güncel bilgileri state'e atayalım
      setUser(data);
      
      // Düzenleme modunu kapat
      setEditMode(false);
      
      toast.success('Profil bilgileriniz güncellendi');
    } catch (error) {
      console.error('Profil güncelleme hatası:', error);
      toast.error('Profil güncellenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    // Şifre eşleşme kontrolü
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Yeni şifreler eşleşmiyor');
      return;
    }
    
    try {
      setLoading(true);
      
      // Token'ı localStorage'dan al
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Oturum bulunamadı');
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      await axios.put(
        `${API_URL}/users/profile`,
        {
          password: passwordData.newPassword,
          currentPassword: passwordData.currentPassword
        },
        config
      );
      
      // Şifre verilerini temizle
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Şifre değiştirme modunu kapat
      setPasswordMode(false);
      
      toast.success('Şifreniz başarıyla güncellendi');
    } catch (error) {
      console.error('Şifre güncelleme hatası:', error);
      toast.error('Şifre güncellenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  return (
    <div className="profile-container">
      <div className="back-button" onClick={() => navigate('/my-trips')}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Geri</span>
      </div>
      
      <div className="profile-card">
        <div className="profile-header">
          <h2>Profil Bilgilerim</h2>
          {!editMode && !passwordMode && (
            <div className="action-buttons">
              <button 
                className="edit-button"
                onClick={() => setEditMode(true)}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.5 2.5L13.5 4.5M10 4L4 10V12H6L12 6L10 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Düzenle
              </button>
              <button 
                className="password-button"
                onClick={() => setPasswordMode(true)}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 7V5C4 2.791 5.791 1 8 1C10.209 1 12 2.791 12 5V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M8 10.5V12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <rect x="3" y="7" width="10" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                Şifre Değiştir
              </button>
              <button 
                className="logout-button"
                onClick={handleLogout}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 14H3C2.44772 14 2 13.5523 2 13V3C2 2.44772 2.44772 2 3 2H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M10.5 11L14 8L10.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Çıkış Yap
              </button>
            </div>
          )}
        </div>

        {!editMode && !passwordMode ? (
          <div className="profile-details">
            <div className="detail-item">
              <span className="detail-label">İsim Soyisim:</span>
              <span className="detail-value">{user?.fullName || "İrem"}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">E-posta:</span>
              <span className="detail-value">{user?.email || "iremm@gmail.com"}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Hesap Oluşturma Tarihi:</span>
              <span className="detail-value">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('tr-TR') : "06.06.2025"}
              </span>
            </div>
          </div>
        ) : editMode ? (
          <form onSubmit={handleProfileUpdate}>
            <div className="form-group">
              <label>İsim Soyisim</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>E-posta</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                readOnly
                className="disabled-input"
              />
            </div>
            <div className="form-actions">
              <button 
                type="submit" 
                className="save-button"
                disabled={loading}
              >
                {loading ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => {
                  setEditMode(false);
                  // Forma orijinal değerleri geri yükle
                  setFormData({
                    fullName: user.fullName,
                    email: user.email
                  });
                }}
              >
                İptal
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handlePasswordUpdate}>
            <div className="form-group">
              <label>Mevcut Şifre</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Yeni Şifre</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                minLength={6}
              />
            </div>
            <div className="form-group">
              <label>Yeni Şifre (Tekrar)</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
                minLength={6}
              />
            </div>
            <div className="form-actions">
              <button 
                type="submit" 
                className="save-button"
                disabled={loading}
              >
                {loading ? 'Kaydediliyor...' : 'Şifreyi Değiştir'}
              </button>
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => {
                  setPasswordMode(false);
                  // Şifre formunu temizle
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                }}
              >
                İptal
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;