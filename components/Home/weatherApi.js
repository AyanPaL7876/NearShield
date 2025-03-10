import * as Location from 'expo-location';

const API_KEY = process.env.EXPO_PUBLIC_OPENWEATHERMAP_API_KEY;

export const fetchWeatherData = async () => {
  try {
    // Request location permissions
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permission to access location was denied');
    }

    // Get current location
    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    
    // Get location name using reverse geocoding
    const geoData = await Location.reverseGeocodeAsync({
      latitude,
      longitude
    });
    
    // Fetch current weather data (free API)
    const currentResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
    );
    
    if (!currentResponse.ok) {
      throw new Error(`Error fetching current weather data: ${currentResponse.status}`);
    }
    
    // Fetch forecast data (free API)
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
    );
    
    if (!forecastResponse.ok) {
      throw new Error(`Error fetching forecast data: ${forecastResponse.status}`);
    }
    
    // Fetch air pollution data (also free API)
    const pollutionResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
    );
    
    if (!pollutionResponse.ok) {
      throw new Error(`Error fetching air pollution data: ${pollutionResponse.status}`);
    }
    
    const currentData = await currentResponse.json();
    const forecastData = await forecastResponse.json();
    const pollutionData = await pollutionResponse.json();
    
    return {
      current: currentData,
      forecast: forecastData,
      pollution: pollutionData,
      location: {
        city: currentData.name,
        country: currentData.sys.country,
        coords: { latitude, longitude },
        address: geoData[0] || null
      }
    };
  } catch (error) {
    throw error;
  }
};

// Helper function to get weather icon URL
export const getIconUrl = (iconCode, size = 2) => 
  `https://openweathermap.org/img/wn/${iconCode}@${size}x.png`;

// Get AQI (Air Quality Index) label
export const getAQILabel = (aqiValue) => {
  switch(aqiValue) {
    case 1: return { label: 'Good', color: '#90EE90' };
    case 2: return { label: 'Fair', color: '#FFFF00' };
    case 3: return { label: 'Moderate', color: '#FFA500' };
    case 4: return { label: 'Poor', color: '#FF4500' };
    case 5: return { label: 'Very Poor', color: '#800000' };
    default: return { label: 'Unknown', color: '#808080' };
  }
};

// Format timestamp to readable time
export const formatTime = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Format timestamp to day name
export const formatDay = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

// Convert wind direction in degrees to cardinal direction
export const getWindDirection = (degrees) => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};