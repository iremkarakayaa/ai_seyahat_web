import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // API URL
  const API_URL = 'http://localhost:3002/api'; // Yeni port numarası kullanılıyor

  useEffect(() => {
    // LocalStorage'dan kullanıcı bilgisini ve token'ı kontrol et
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Kullanıcı bilgisi çözümlenemedi:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    
    setLoading(false);
  }, []);

  // Giriş fonksiyonu
  const login = async (email, password) => {
    try {
      console.log(`Giriş isteği gönderiliyor: ${email}`);
      
      const response = await axios.post(`${API_URL}/users/login`, {
        email,
        password
      });

      const userData = response.data;
      console.log('Giriş cevabı:', userData);
      
      // Kullanıcı bilgisini ve token'ı localStorage'a kaydet
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userData.token);
      
      setUser(userData);
      return { success: true, data: userData };
    } catch (error) {
      console.error('Giriş hatası:', error);
      const errorMsg = error.response?.data?.message || 'Giriş sırasında bir hata oluştu';
      console.error('Hata mesajı:', errorMsg);
      
      return { 
        success: false, 
        error: errorMsg 
      };
    }
  };

  // Kayıt fonksiyonu
  const register = async (fullName, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/users/register`, {
        fullName,
        email,
        password,
        platform: 'web'
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Kayıt hatası:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Kayıt sırasında bir hata oluştu' 
      };
    }
  };

  // Çıkış fonksiyonu
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 