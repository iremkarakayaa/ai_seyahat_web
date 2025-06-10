import React, { useState } from 'react';
import './LoginModal.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginModal = ({ isOpen, onClose, onSuccess, onSwitchToSignup }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        console.log('Giriş başarılı:', result.data);
        toast.success('Giriş başarılı!');
        
        // Modal'ı kapat
        onClose();
        
        // Başarılı giriş callback'i varsa çağır
        if (typeof onSuccess === 'function') {
          onSuccess();
        } else {
          // Callback yoksa doğrudan yönlendir
          navigate('/create-trip');
        }
      } else {
        toast.error(result.error);
        
        // Form verilerini sıfırla
        setFormData({
          email: '',
          password: ''
        });
      }
    } catch (error) {
      console.error('Giriş hatası:', error);
      toast.error('E-posta veya şifre hatalı');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        
        <div className="modal-body">
          <h2>Giriş Yap</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>E-posta Adresi</label>
              <input
                type="email"
                name="email"
                placeholder="E-posta adresiniz"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
            
            <div className="input-group">
              <label>Parola</label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Parolanız"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  minLength={6}
                />
                <button 
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>
            
            <a href="#" className="forgot-password">
              Parolanızı mı unuttunuz?
            </a>
            
            <button 
              type="submit" 
              className="login-button" 
              disabled={loading}
            >
              {loading ? (
                <span>
                  <i className="fas fa-spinner fa-spin"></i> Giriş yapılıyor...
                </span>
              ) : (
                'Giriş Yap'
              )}
            </button>
          </form>
          
          <p className="signup-text">
            Henüz üye değil misiniz? <a href="#" onClick={(e) => {
              e.preventDefault();
              onSwitchToSignup();
            }}>Hemen üye olun</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;