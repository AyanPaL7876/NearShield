import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  Image, 
  ScrollView, 
  SafeAreaView,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import { fetchWeatherData, getIconUrl, getAQILabel, formatTime, formatDay, getWindDirection } from './weatherApi';
import { LinearGradient } from 'expo-linear-gradient'; // You'll need to install this package

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('hourly');

  useEffect(() => {
    const loadWeatherData = async () => {
      try {
        const data = await fetchWeatherData();
        setWeatherData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadWeatherData();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingWrapper}>
        <LinearGradient 
          colors={['#4c80f1', '#2b5be3']} 
          style={styles.loadingContainer}
        >
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Loading weather data...</Text>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorWrapper}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setLoading(true);
              setError(null);
              loadWeatherData();
            }}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!weatherData) return null;

  const { current, forecast, pollution, location } = weatherData;
  
  // Process hourly forecast
  const hourlyForecast = forecast.list.slice(0, 8); // Next 24 hours
  
  // Process daily forecast (need to aggregate from 3-hour forecasts)
  const dailyMap = new Map();
  
  forecast.list.forEach(item => {
    const day = formatDay(item.dt);
    
    if (!dailyMap.has(day)) {
      dailyMap.set(day, {
        temps: [],
        weather: item.weather[0],
        pops: [],
        dt: item.dt
      });
    }
    
    dailyMap.get(day).temps.push(item.main.temp);
    dailyMap.get(day).pops.push(item.pop || 0);
  });
  
  // Convert Map to Array and calculate min/max temps
  const dailyForecast = Array.from(dailyMap.entries())
    .slice(0, 5) // Get next 5 days
    .map(([day, data]) => ({
      day,
      dt: data.dt,
      weather: data.weather,
      temp: {
        max: Math.max(...data.temps),
        min: Math.min(...data.temps)
      },
      pop: Math.max(...data.pops)
    }));
  
  // Get air quality data
  const airQuality = pollution.list[0];
  const aqi = getAQILabel(airQuality.main.aqi);
  
  // Calculate sunrise and sunset times
  const sunrise = formatTime(current.sys.sunrise);
  const sunset = formatTime(current.sys.sunset);
  
  // Get wind direction
  const windDirection = getWindDirection(current.wind.deg);

  // Get weather condition for background gradient
  const getWeatherGradient = () => {
    const id = current.weather[0].id;
    const isDay = current.weather[0].icon.includes('d');
    
    if (id >= 200 && id < 300) return ['#2c3e50', '#34495e']; // Thunderstorm
    if (id >= 300 && id < 400) return ['#2980b9', '#3498db']; // Drizzle
    if (id >= 500 && id < 600) return ['#5d8cae', '#7f9eb2']; // Rain
    if (id >= 600 && id < 700) return ['#d5d5d5', '#f0f0f0']; // Snow
    if (id >= 700 && id < 800) return ['#bdc3c7', '#95a5a6']; // Atmosphere (fog, mist)
    if (id === 800) return isDay ? ['#3498db', '#87CEFA'] : ['#2c3e50', '#34495e']; // Clear
    if (id > 800) return isDay ? ['#7dace2', '#b4cded'] : ['#4b6584', '#778ca3']; // Clouds
    
    return isDay ? ['#3498db', '#87CEFA'] : ['#2c3e50', '#34495e']; // Default
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <LinearGradient 
        colors={getWeatherGradient()} 
        style={styles.gradientContainer}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Location Information */}
          <View style={styles.locationContainer}>
            <Text style={styles.locationName}>
              {location.city}, {location.country}
            </Text>
            <Text style={styles.currentDate}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </Text>
          </View>
          
          {/* Current Weather */}
          <View style={styles.currentWeather}>
            <View style={styles.currentTemp}>
              <Text style={styles.temperature}>{Math.round(current.main.temp)}°</Text>
              <Text style={styles.weatherDesc}>{current.weather[0].description}</Text>
              <Text style={styles.weatherRange}>
                H: {Math.round(current.main.temp_max)}°  L: {Math.round(current.main.temp_min)}°
              </Text>
            </View>
            <Image 
              source={{ uri: getIconUrl(current.weather[0].icon) }} 
              style={styles.mainIcon} 
            />
          </View>
          
          {/* Forecast Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'hourly' && styles.activeTab]}
              onPress={() => setActiveTab('hourly')}
            >
              <Text style={[styles.tabText, activeTab === 'hourly' && styles.activeTabText]}>Hourly</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'daily' && styles.activeTab]}
              onPress={() => setActiveTab('daily')}
            >
              <Text style={[styles.tabText, activeTab === 'daily' && styles.activeTabText]}>5-Day</Text>
            </TouchableOpacity>
          </View>
          
          {/* Forecast Content */}
          <View style={styles.forecastContainer}>
            {activeTab === 'hourly' ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.hourlyContainer}>
                  {hourlyForecast.map((hour, index) => {
                    return (
                      <View key={index} style={styles.hourItem}>
                        <Text style={styles.hourTime}>
                          {index === 0 ? 'Now' : formatTime(hour.dt)}
                        </Text>
                        <Image 
                          source={{ uri: getIconUrl(hour.weather[0].icon) }} 
                          style={styles.smallIcon} 
                        />
                        <Text style={styles.hourTemp}>{Math.round(hour.main.temp)}°</Text>
                        <View style={styles.popContainer}>
                          <Image 
                            source={require('../../assets/images/droplet.jpeg')} 
                            style={styles.dropletIcon} 
                          />
                          <Text style={styles.hourPop}>{Math.round(hour.pop * 100)}%</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
            ) : (
              <View style={styles.dailyContainer}>
                {dailyForecast.map((day, index) => {
                  return (
                    <View key={index} style={styles.dailyItem}>
                      <Text style={styles.dayName}>
                        {index === 0 ? 'Today' : day.day}
                      </Text>
                      <View style={styles.dayForecast}>
                        <View style={styles.popContainer}>
                          <Image 
                            source={require('../../assets/images/droplet.jpeg')} 
                            style={styles.dropletIcon} 
                          />
                          <Text style={styles.dayPop}>{Math.round(day.pop * 100)}%</Text>
                        </View>
                        <Image 
                          source={{ uri: getIconUrl(day.weather.icon) }} 
                          style={styles.smallIcon} 
                        />
                        <View style={styles.tempBar}>
                          <View style={styles.tempBarFill} />
                          <View 
                            style={[
                              styles.tempBarMinPoint, 
                              { left: `${((day.temp.min - 0) / (40 - 0)) * 100}%` }
                            ]} 
                          />
                          <View 
                            style={[
                              styles.tempBarMaxPoint, 
                              { left: `${((day.temp.max - 0) / (40 - 0)) * 100}%` }
                            ]} 
                          />
                        </View>
                        <Text style={styles.tempMin}>{Math.round(day.temp.min)}°</Text>
                        <Text style={styles.tempMax}>{Math.round(day.temp.max)}°</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
          
          {/* Weather Details Card */}
          <View style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>Weather Details</Text>
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Image 
                  source={require('../../assets/images/droplet.jpeg')} // wind
                  style={styles.detailIcon} 
                />
                <Text style={styles.detailLabel}>Wind</Text>
                <Text style={styles.detailValue}>{Math.round(current.wind.speed * 3.6)} km/h</Text>
                <Text style={styles.detailSubvalue}>{windDirection}</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Image 
                  source={require('../../assets/images/droplet.jpeg')}  //humidity
                  style={styles.detailIcon} 
                />
                <Text style={styles.detailLabel}>Humidity</Text>
                <Text style={styles.detailValue}>{current.main.humidity}%</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Image 
                  source={require('../../assets/images/droplet.jpeg')} 
                  style={styles.detailIcon} 
                />
                <Text style={styles.detailLabel}>Pressure</Text>
                <Text style={styles.detailValue}>{current.main.pressure}</Text>
                <Text style={styles.detailSubvalue}>hPa</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Image 
                  source={require('../../assets/images/droplet.jpeg')} 
                  style={styles.detailIcon} 
                />
                <Text style={styles.detailLabel}>UV Index</Text>
                <Text style={styles.detailValue}>{current.uvi || 'N/A'}</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Image 
                  source={require('../../assets/images/droplet.jpeg')} 
                  style={styles.detailIcon} 
                />
                <Text style={styles.detailLabel}>Visibility</Text>
                <Text style={styles.detailValue}>{(current.visibility / 1000).toFixed(1)}</Text>
                <Text style={styles.detailSubvalue}>km</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Image 
                  source={require('../../assets/images/droplet.jpeg')} 
                  style={styles.detailIcon} 
                />
                <Text style={styles.detailLabel}>Feels Like</Text>
                <Text style={styles.detailValue}>{Math.round(current.main.feels_like)}°</Text>
              </View>
            </View>
            
            <View style={styles.sunTimesContainer}>
              <View style={styles.sunTimeItem}>
                <Image 
                  source={require('../../assets/images/droplet.jpeg')} 
                  style={styles.sunIcon} 
                />
                <View>
                  <Text style={styles.sunLabel}>Sunrise</Text>
                  <Text style={styles.sunTime}>{sunrise}</Text>
                </View>
              </View>
              
              <View style={styles.sunDivider} />
              
              <View style={styles.sunTimeItem}>
                <Image 
                  source={require('../../assets/images/droplet.jpeg')} 
                  style={styles.sunIcon} 
                />
                <View>
                  <Text style={styles.sunLabel}>Sunset</Text>
                  <Text style={styles.sunTime}>{sunset}</Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Air Quality Card */}
          <View style={styles.aqiCard}>
            <View style={styles.aqiHeader}>
              <Text style={styles.aqiTitle}>Air Quality</Text>
              <View style={[styles.aqiIndicator, { backgroundColor: aqi.color }]}>
                <Text style={styles.aqiIndicatorText}>{aqi.label}</Text>
              </View>
            </View>
            
            <View style={styles.pollutantGrid}>
              <View style={styles.pollutantItem}>
                <View style={styles.pollutantHeader}>
                  <Text style={styles.pollutantName}>PM2.5</Text>
                  <Text style={styles.pollutantValue}>{airQuality.components.pm2_5.toFixed(1)}</Text>
                </View>
                <View style={styles.pollutantBar}>
                  <View 
                    style={[
                      styles.pollutantBarFill, 
                      { width: `${Math.min(100, (airQuality.components.pm2_5 / 75) * 100)}%` }
                    ]} 
                  />
                </View>
              </View>
              
              <View style={styles.pollutantItem}>
                <View style={styles.pollutantHeader}>
                  <Text style={styles.pollutantName}>PM10</Text>
                  <Text style={styles.pollutantValue}>{airQuality.components.pm10.toFixed(1)}</Text>
                </View>
                <View style={styles.pollutantBar}>
                  <View 
                    style={[
                      styles.pollutantBarFill, 
                      { width: `${Math.min(100, (airQuality.components.pm10 / 150) * 100)}%` }
                    ]} 
                  />
                </View>
              </View>
              
              <View style={styles.pollutantItem}>
                <View style={styles.pollutantHeader}>
                  <Text style={styles.pollutantName}>NO2</Text>
                  <Text style={styles.pollutantValue}>{airQuality.components.no2.toFixed(1)}</Text>
                </View>
                <View style={styles.pollutantBar}>
                  <View 
                    style={[
                      styles.pollutantBarFill, 
                      { width: `${Math.min(100, (airQuality.components.no2 / 200) * 100)}%` }
                    ]} 
                  />
                </View>
              </View>
              
              <View style={styles.pollutantItem}>
                <View style={styles.pollutantHeader}>
                  <Text style={styles.pollutantName}>O3</Text>
                  <Text style={styles.pollutantValue}>{airQuality.components.o3.toFixed(1)}</Text>
                </View>
                <View style={styles.pollutantBar}>
                  <View 
                    style={[
                      styles.pollutantBarFill, 
                      { width: `${Math.min(100, (airQuality.components.o3 / 180) * 100)}%` }
                    ]} 
                  />
                </View>
              </View>
            </View>
          </View>
          
          {/* Data Attribution */}
          <Text style={styles.attribution}>
            Weather data provided by OpenWeatherMap
          </Text>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  gradientContainer: {
    flex: 1,
    paddingTop: 20,
  },
  loadingWrapper: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 10,
    fontSize: 16,
  },
  errorWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  errorContainer: {
    padding: 24,
    alignItems: 'center',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  locationContainer: {
    marginHorizontal: 20,
    marginVertical: 16,
    alignItems: 'center',
  },
  locationName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  currentDate: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  currentWeather: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 24,
  },
  currentTemp: {
    flex: 1,
  },
  temperature: {
    fontSize: 80,
    fontWeight: '300',
    color: '#ffffff',
  },
  weatherDesc: {
    fontSize: 16,
    color: '#ffffff',
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  weatherRange: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  mainIcon: {
    width: 120,
    height: 120,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#ffffff',
  },
  tabText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
    fontSize: 14,
  },
  activeTabText: {
    color: '#3B82F6',
  },
  forecastContainer: {
    marginBottom: 24,
  },
  hourlyContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  hourItem: {
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 12,
    borderRadius: 18,
    minWidth: 70,
  },
  hourTime: {
    fontSize: 14,
    marginBottom: 4,
    color: '#ffffff',
    fontWeight: '500',
  },
  smallIcon: {
    width: 40,
    height: 40,
  },
  hourTemp: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginVertical: 4,
  },
  popContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropletIcon: {
    width: 12,
    height: 12,
    tintColor: '#89CFF0',
    marginRight: 4,
  },
  hourPop: {
    fontSize: 12,
    color: '#89CFF0',
  },
  dailyContainer: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 18,
    padding: 16,
  },
  dailyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  dayName: {
    width: 60,
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  dayForecast: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayPop: {
    fontSize: 12,
    color: '#89CFF0',
    width: 30,
  },
  tempBar: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 8,
    position: 'relative',
  },
  tempBarFill: {
    position: 'absolute',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  tempBarMinPoint: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#89CFF0',
    top: -3.5,
  },
  tempBarMaxPoint: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF9500',
    top: -3.5,
  },
  tempMin: {
    fontSize: 14,
    fontWeight: '500',
    color: '#89CFF0',
    width: 30,
    textAlign: 'right',
  },
  tempMax: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FF9500',
    width: 30,
    textAlign: 'right',
  },
  detailsCard: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    width: '30%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  detailIcon: {
    width: 24,
    height: 24,
    tintColor: '#ffffff',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  detailSubvalue: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  sunTimesContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-between',
  },
  sunTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sunIcon: {
    width: 32,
    height: 32,
    tintColor: '#FFD700',
    marginRight: 12,
  },
  sunLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  sunTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  sunDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  aqiCard: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  aqiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  aqiTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  aqiIndicator: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  aqiIndicatorText: {
    fontWeight: '600',
    fontSize: 12,
  },
  pollutantGrid: {
    gap: 12,
  },
  pollutantItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
  },
  pollutantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  pollutantName: {
    fontSize: 14,
    color: '#ffffff',
  },
  pollutantValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  pollutantBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
  },
  pollutantBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  attribution: {
    textAlign: 'center',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 20,
  },
});

export default Weather;