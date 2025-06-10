import axios from 'axios';

const GOOGLE_API_KEY = process.env.VITE_GOOGLE_MAPS_API_KEY;
const PLACES_API_BASE_URL = 'https://maps.googleapis.com/maps/api/place';

export const searchPlaces = async (input) => {
  try {
    const response = await axios.get(
      `${PLACES_API_BASE_URL}/autocomplete/json`,
      {
        params: {
          input,
          types: '(cities)',
          key: GOOGLE_API_KEY
        }
      }
    );
    return response.data.predictions;
  } catch (error) {
    console.error('Yer arama hatası:', error);
    throw error;
  }
};

export const getPlaceDetails = async (placeId) => {
  try {
    const response = await axios.get(
      `${PLACES_API_BASE_URL}/details/json`,
      {
        params: {
          place_id: placeId,
          fields: 'name,geometry,formatted_address',
          key: GOOGLE_API_KEY
        }
      }
    );
    return response.data.result;
  } catch (error) {
    console.error('Yer detayları alma hatası:', error);
    throw error;
  }
};

export const searchHotels = async (location) => {
  try {
    const response = await axios.get(
      `${PLACES_API_BASE_URL}/textsearch/json`,
      {
        params: {
          query: `hotels in ${location}`,
          type: 'lodging',
          key: GOOGLE_API_KEY
        }
      }
    );
    return response.data.results;
  } catch (error) {
    console.error('Otel arama hatası:', error);
    throw error;
  }
}; 