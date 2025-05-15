import React, { useState } from 'react';
import './LoginModal.css'; // Aynı stilleri kullanacağız
import { toast } from 'react-toastify';
import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const SignupModal = ({ isOpen, onClose, onSuccess, onSwitchToLogin }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

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

  const validateForm = () => {
    const errors = [];

    if (!formData.fullName.trim()) {
      errors.push('İsim ve soyisim boş bırakılamaz.');
    }

    if (!formData.email) {
      errors.push('E-posta adresi boş bırakılamaz.');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.push('Geçerli bir e-posta adresi giriniz.');
    }

    if (!formData.password) {
      errors.push('Parola boş bırakılamaz.');
    } else if (formData.password.length < 6) {
      errors.push('Parola en az 6 karakter olmalıdır.');
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Form doğrulama
    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      setLoading(false);
      return;
    }

    try {
      console.log('Kayıt işlemi başlatılıyor...', formData.email);
      
      // Firebase Authentication'da kullanıcı oluştur
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
  
      console.log('Kullanıcı oluşturuldu:', userCredential.user.uid);
  
      // Kullanıcı profilini güncelle
      await updateProfile(userCredential.user, {
        displayName: formData.fullName
      });
  
      console.log('Profil güncellendi');
  
      // Firestore'a kullanıcı bilgilerini kaydet
      try {
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          fullName: formData.fullName,
          email: formData.email,
          createdAt: new Date().toISOString(),
          platform: 'web'
        });
        console.log('Firestore\'a kullanıcı bilgileri kaydedildi');
      } catch (firestoreError) {
        console.error('Firestore kayıt hatası:', firestoreError);
        throw firestoreError; // Hatayı yukarı ilet
      }
  
      // Önce alert ile test edelim
      alert('Kayıt başarılı! Giriş yapabilirsiniz.');
  
      // Toast bildirimi göster
      toast.success('Kayıt başarılı! Giriş yapabilirsiniz.');
      console.log('Toast bildirimi gönderildi');
  
      // Modal'ı kapat
      onClose();
  
      // Giriş ekranına yönlendir
      if (typeof onSwitchToLogin === 'function') {
        console.log('Giriş ekranına yönlendiriliyor...');
        onSwitchToLogin();
      } else {
        console.log('onSwitchToLogin fonksiyonu bulunamadı');
      }
  
    } catch (error) {
      console.error('Kayıt hatası:', error);
      console.error('Hata kodu:', error.code);
      console.error('Hata mesajı:', error.message);
      
      let errorMessage = 'Kayıt olurken bir hata oluştu.';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Bu e-posta adresi zaten kullanımda.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Geçersiz e-posta adresi.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'E-posta/parola girişi devre dışı bırakılmış.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Parola çok zayıf. En az 6 karakter kullanın.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'İnternet bağlantınızı kontrol edin.';
          break;
        default:
          errorMessage = `Kayıt olurken bir hata oluştu: ${error.message}`;
          break;
      }
      
      toast.error(errorMessage);
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
          <h2>Kayıt Ol</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>İsim Soyisim</label>
              <input
                type="text"
                name="fullName"
                placeholder="İsim ve soyisminiz"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  fullName: e.target.value
                }))}
                disabled={loading}
                required
              />
            </div>

            <div className="input-group">
              <label>E-posta Adresi</label>
              <input
                type="email"
                name="email"
                placeholder="E-posta adresiniz"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  email: e.target.value
                }))}
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
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    password: e.target.value
                  }))}
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
            
            <button 
              type="submit" 
              className="login-button" 
              disabled={loading}
            >
              {loading ? (
                <span>
                  <i className="fas fa-spinner fa-spin"></i> Kayıt yapılıyor...
                </span>
              ) : (
                'Kayıt Ol'
              )}
            </button>
          </form>
          
          <p className="signup-text">
            Zaten üye misiniz? <a href="#" onClick={(e) => {
              e.preventDefault();
              onSwitchToLogin();
            }}>Giriş yapın</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;