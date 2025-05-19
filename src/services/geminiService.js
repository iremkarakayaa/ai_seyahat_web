import { toast } from 'react-toastify';

/**
 * Gemini AI API'sini kullanarak seyahat planı oluşturur
 * @param {string} userPrompt - Kullanıcının seyahat tercihleri
 * @returns {Promise<string>} - Oluşturulan seyahat planı
 */
export async function generateTripPlan(userPrompt) {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  const requestBody = {
    contents: [
      {
        role: "user",
        parts: [{ text: userPrompt }],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048, // Daha uzun yanıtlar için arttırıldı
    },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API hatası: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();

    if (!data.candidates || !data.candidates[0]?.content?.parts[0]?.text) {
      throw new Error("API boş bir yanıt döndürdü.");
    }

    const resultText = data.candidates[0].content.parts[0].text;
    console.log("✅ Seyahat planı başarıyla oluşturuldu");
    return resultText;

  } catch (error) {
    console.error("❌ Seyahat planı oluşturulurken hata:", error.message);
    toast.error("Seyahat planı oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
    throw error;
  }
}