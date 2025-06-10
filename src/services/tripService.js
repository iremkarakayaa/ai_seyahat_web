import axios from 'axios';
import { toast } from 'react-toastify';

// API URL
const API_URL = 'http://localhost:3002/api'; // Yeni port numarası kullanılıyor

/**
 * Seyahat planını MongoDB'ye kaydeder
 * @param {Object} tripData - Seyahat planı verileri
 * @returns {Promise<string>} - Oluşturulan dökümanın ID'si
 */
export async function saveTripPlan(tripData) {
  try {
    // Token'ı localStorage'dan al
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error("Seyahat planını kaydetmek için giriş yapmalısınız");
      throw new Error("Kullanıcı oturum açmamış.");
    }
    
    console.log("Kaydedilecek veri:", tripData);
    
    // Veritabanı yapısına uygun veri hazırla
    const simplifiedTripData = {
      plan: String(tripData.planText || ""),
      userprompt: String(tripData.userPrompt || "")
    };
    
    console.log("Veritabanına kaydedilecek veri:", simplifiedTripData);
    
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    
    const response = await axios.post(
      `${API_URL}/trips`, 
      simplifiedTripData,
      config
    );

    console.log("✅ Seyahat planı başarıyla kaydedildi:", response.data._id);
    toast.success("Seyahat planınız başarıyla kaydedildi!");
    return response.data._id;
  } catch (error) {
    console.error("❌ Seyahat planı kaydedilirken hata:", error);
    toast.error("Seyahat planı kaydedilirken bir hata oluştu");
    throw error;
  }
}

/**
 * Kullanıcının seyahat planlarını getirir
 * @returns {Promise<Array>} - Seyahat planlarının listesi
 */
export async function getUserTrips() {
  try {
    // Token'ı localStorage'dan al
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error("Seyahat planlarınızı görmek için giriş yapmalısınız");
      throw new Error("Kullanıcı oturum açmamış.");
    }
    
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    
    const response = await axios.get(`${API_URL}/trips`, config);
    
    return response.data;
  } catch (error) {
    console.error("❌ Seyahat planları getirilirken hata:", error);
    toast.error("Seyahat planları yüklenirken bir hata oluştu");
    throw error;
  }
}

/**
 * Belirli bir seyahat planını ID'ye göre getirir
 * @param {string} tripId - Seyahat planı ID'si
 * @returns {Promise<Object>} - Seyahat planı detayları
 */
export async function getTripById(tripId) {
  try {
    // Token'ı localStorage'dan al
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error("Seyahat planı detaylarını görmek için giriş yapmalısınız");
      throw new Error("Kullanıcı oturum açmamış.");
    }
    
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    
    const response = await axios.get(`${API_URL}/trips/${tripId}`, config);
    
    return response.data;
  } catch (error) {
    console.error(`❌ Seyahat planı (ID: ${tripId}) getirilirken hata:`, error);
    toast.error("Seyahat planı detayları yüklenirken bir hata oluştu");
    throw error;
  }
}

/**
 * Seyahat planını siler
 * @param {string} tripId - Silinecek seyahat planı ID'si
 * @returns {Promise<void>}
 */
export async function deleteTrip(tripId) {
  try {
    // Token'ı localStorage'dan al
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error("Seyahat planını silmek için giriş yapmalısınız");
      throw new Error("Kullanıcı oturum açmamış.");
    }
    
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    
    await axios.delete(`${API_URL}/trips/${tripId}`, config);
    
    toast.success("Seyahat planı başarıyla silindi");
  } catch (error) {
    console.error(`❌ Seyahat planı (ID: ${tripId}) silinirken hata:`, error);
    toast.error("Seyahat planı silinirken bir hata oluştu");
    throw error;
  }
}