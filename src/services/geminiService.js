import { toast } from 'react-toastify';

/**
 * Gemini AI API'sini kullanarak seyahat planı oluşturur
 * @param {string} userPrompt - Kullanıcının seyahat tercihleri
 * @returns {Promise<string>} - Oluşturulan seyahat planı
 */
export async function generateTripPlan(userPrompt) {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  // Prompt'u formatla - daha detaylı ve yapılandırılmış bir prompt
  const formattedPrompt = `
    ${userPrompt}
    
    Lütfen yanıtını aşağıdaki formatta ver:
    
    # [Şehir] Seyahat Planı
    
    ## Gün 1
    ### Sabah Aktiviteleri
    [Sabah aktiviteleri için detaylı açıklamalar]
    
    ### Öğle Yemeği
    [Öğle yemeği önerileri ve açıklamaları]
    
    ### Öğleden Sonra
    [Öğleden sonra aktiviteleri için detaylı açıklamalar]
    
    ### Akşam Yemeği
    [Akşam yemeği önerileri ve açıklamaları]
    
    ### Gece Aktiviteleri
    [Gece aktiviteleri için öneriler]
    
    ## Gün 2
    [Aynı format Gün 2 için de tekrarlanacak]
    
    ...
    
    Önemli Notlar:
    1. Her aktivite için kısa açıklamalar ekle
    2. Yıldız işaretleri veya diğer özel karakterler kullanma
    3. Her gün için en az 5 aktivite öner
    4. Yerel yemek ve içecek önerileri ekle
    5. Ulaşım bilgileri ve tahmini maliyetler hakkında bilgi ver
    6. Her bölüm için en az 3-4 cümle kullan
  `;

  const requestBody = {
    contents: [
      {
        role: "user",
        parts: [{ text: formattedPrompt }],
      },
    ],
    generationConfig: {
      temperature: 0.8, // Biraz daha yaratıcı yanıtlar için arttırıldı
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 4096, // Daha uzun ve detaylı yanıtlar için arttırıldı
    },
  };

  try {
    console.log("Gemini API'ye istek gönderiliyor...");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API yanıt detayları:", errorData);
      throw new Error(`API hatası: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();

    if (!data.candidates || !data.candidates[0]?.content?.parts[0]?.text) {
      console.error("API yanıtı:", data);
      throw new Error("API boş bir yanıt döndürdü.");
    }

    const resultText = data.candidates[0].content.parts[0].text;
    console.log("Ham API yanıtı alındı, işleniyor...");
    
    // Yanıtı işle
    const processedText = processApiResponse(resultText);
    
    console.log("✅ Seyahat planı başarıyla oluşturuldu");
    return processedText;

  } catch (error) {
    console.error("❌ Seyahat planı oluşturulurken hata:", error.message);
    toast.error("Seyahat planı oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
    throw error;
  }
}

/**
 * API yanıtını işleyerek istenen formata dönüştürür
 * @param {string} text - API'den gelen ham yanıt
 * @returns {string} - İşlenmiş yanıt
 */
function processApiResponse(text) {
  // Tüm işaretleri kaldır
  let processed = text;
  
  // Yıldız işaretlerini kaldır
  processed = processed.replace(/\*/g, '');
  
  // Diğer işaretleri kaldır
  processed = processed.replace(/•/g, '');
  processed = processed.replace(/◦/g, '');
  processed = processed.replace(/○/g, '');
  processed = processed.replace(/▪/g, '');
  processed = processed.replace(/▫/g, '');
  processed = processed.replace(/>/g, '');
  processed = processed.replace(/»/g, '');
  processed = processed.replace(/✓/g, '');
  processed = processed.replace(/✔/g, '');
  processed = processed.replace(/★/g, '');
  processed = processed.replace(/☆/g, '');
  processed = processed.replace(/➤/g, '');
  processed = processed.replace(/➢/g, '');
  processed = processed.replace(/⇒/g, '');
  processed = processed.replace(/⇨/g, '');
  
  // Gün başlıklarını düzenle
  processed = processed.replace(/(\d+)\. Gün/g, 'Gün $1');
  processed = processed.replace(/Gün (\d+):/g, 'Gün $1');
  
  // Diğer başlıkları düzenle
  processed = processed.replace(/Sabah Aktiviteleri/g, 'Sabah Aktiviteleri');
  processed = processed.replace(/Öğle Yemeği/g, 'Öğle Yemeği');
  processed = processed.replace(/Öğleden Sonra/g, 'Öğleden Sonra');
  processed = processed.replace(/Akşam Yemeği/g, 'Akşam Yemeği');
  processed = processed.replace(/Gece Aktiviteleri/g, 'Gece Aktiviteleri');
  
  // Ek başlık formatlamaları
  processed = processed.replace(/Sabah:/g, 'Sabah Aktiviteleri');
  processed = processed.replace(/Öğle:/g, 'Öğle Yemeği');
  processed = processed.replace(/Öğleden sonra:/g, 'Öğleden Sonra');
  processed = processed.replace(/Akşam:/g, 'Akşam Yemeği');
  processed = processed.replace(/Gece:/g, 'Gece Aktiviteleri');
  
  // Fazla boşlukları temizle
  processed = processed.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  return processed;
}